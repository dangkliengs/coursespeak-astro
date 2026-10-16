import { promises as fs } from 'node:fs';
import { readDeals, getDealsFilePath } from './store';
import { parseInstructors } from './instructors';

/**
 * Live instructor → course count, dihitung langsung dari deals.json.
 * Menggantikan instructorCounts.json statis yang dulu harus diupdate manual
 * (dan selalu basi setiap ada coupon baru).
 *
 * Cache di-memory diinvalidasi otomatis via mtime deals.json:
 * - selama file tidak berubah → pakai cache (1x stat per panggil, murah)
 * - begitu admin create/delete deal → mtime berubah → hitung ulang
 */
export function normalizeInstructorKey(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\u0300-\u036f/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/** Urutan bagian "A | B" vs "B | A" dianggap sama. */
export function pipeInsensitiveKey(value: string): string {
  return value
    .split('|')
    .map((p) => normalizeInstructorKey(p.trim()))
    .filter(Boolean)
    .sort()
    .join('|');
}

interface CountsIndex {
  /** normalized full name → count */
  byKey: Map<string, number>;
  /** pipe-insensitive key of raw display name → count (fallback urutan terbalik) */
  byPipe: Map<string, number>;
}

let cache: { mtimeMs: number; index: CountsIndex } | null = null;

export async function getInstructorCourseCounts(): Promise<CountsIndex> {
  const file = getDealsFilePath();
  let mtimeMs = 0;
  try {
    mtimeMs = (await fs.stat(file)).mtimeMs;
  } catch {
    /* file belum ada — lanjut dengan map kosong */
  }
  if (cache && cache.mtimeMs === mtimeMs) return cache.index;

  const deals = await readDeals();
  const byKey = new Map<string, number>();
  const byPipe = new Map<string, number>();
  for (const deal of deals) {
    if (!deal.instructor) continue;
    for (const name of parseInstructors(deal.instructor)) {
      const key = normalizeInstructorKey(name);
      if (!key) continue;
      byKey.set(key, (byKey.get(key) ?? 0) + 1);
      const pk = pipeInsensitiveKey(name);
      byPipe.set(pk, (byPipe.get(pk) ?? 0) + 1);
    }
  }
  const index = { byKey, byPipe };
  cache = { mtimeMs, index };
  return index;
}

/** Count untuk satu nama instructor (exact match dulu, lalu fallback pipe-insensitive + toleransi gelar Dr/Prof). */
export async function getInstructorCourseCount(firstInstructor: string): Promise<number | undefined> {
  if (!firstInstructor) return undefined;
  const index = await getInstructorCourseCounts();
  const direct = index.byKey.get(normalizeInstructorKey(firstInstructor));
  if (direct !== undefined) return direct;
  const piped = index.byPipe.get(pipeInsensitiveKey(firstInstructor));
  if (piped !== undefined) return piped;
  // Toleransi gelar: "Dr. Jane Doe" tetap menemukan "Jane Doe".
  const stripped = firstInstructor.replace(/^(?:dr|mr|mrs|ms|miss|prof|professor|sir|ir)\.?\s+/i, '').trim();
  if (stripped && stripped !== firstInstructor) {
    const d = index.byKey.get(normalizeInstructorKey(stripped));
    if (d !== undefined) return d;
    return index.byPipe.get(pipeInsensitiveKey(stripped));
  }
  return undefined;
}
