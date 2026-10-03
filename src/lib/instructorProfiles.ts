import fs from 'node:fs/promises';
import path from 'node:path';
import instructorsData from '../data/instructors.json';
import { createInstructorSlug, parseInstructors } from './instructors';
import { readDeals } from './store';

export interface InstructorProfile {
  name?: string;
  image?: string;
}

type ProfilesMap = Record<string, InstructorProfile>;

const profiles = instructorsData as ProfilesMap;

/** Normalize slug (strip diacritics: ü → u). */
function normalizedSlug(nameOrSlug: string): string {
  return nameOrSlug
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export function readInstructorProfiles(): ProfilesMap {
  return profiles;
}

export function getInstructorProfile(slug: string): InstructorProfile | undefined {
  return (
    profiles[slug] ??
    profiles[normalizedSlug(slug)] ??
    undefined
  );
}

/** Resolve image for an instructor slug, with diacritics-normalized fallback. */
export function getInstructorImage(slug: string): string | undefined {
  const image = getInstructorProfile(slug)?.image;
  return image ? image : undefined;
}

/** Resolve image directly from display name (handles speak vs wyn slug differences). */
export function getInstructorImageByName(name: string): string | undefined {
  const slug = createInstructorSlug(name);
  return (
    getInstructorImage(slug) ??
    getInstructorImage(normalizedSlug(name)) ??
    undefined
  );
}

export interface InstructorEntry {
  slug: string;
  name: string;
  image?: string;
}

/** Build instructor list from coursespeak deals + photo registry (for admin manager). */
export interface InstructorListEntry extends InstructorEntry {
  count: number;
}

const profilesFile = path.join(process.cwd(), 'src', 'data', 'instructors.json');

async function readProfilesFile(): Promise<ProfilesMap> {
  try {
    const raw = await fs.readFile(profilesFile, 'utf8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export async function listInstructors(): Promise<InstructorListEntry[]> {
  const [deals, fileProfiles] = await Promise.all([readDeals(), readProfilesFile()]);
  const merged: ProfilesMap = { ...profiles, ...fileProfiles };
  const map = new Map<string, InstructorListEntry>();
  for (const deal of deals) {
    if (!deal.instructor) continue;
    for (const name of parseInstructors(deal.instructor)) {
      const slug = createInstructorSlug(name);
      if (!slug) continue;
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { slug, name, count: 1, image: merged[slug]?.image });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Save/clear an instructor photo in the registry file (used by /api/instructors). */
export async function setInstructorImage(slug: string, image: string, name?: string): Promise<InstructorProfile> {
  const fileProfiles = await readProfilesFile();
  const existing = fileProfiles[slug] || {};
  if (image) existing.image = image;
  else delete existing.image;
  if (name) existing.name = name;
  if (!existing.image && !existing.name) delete fileProfiles[slug];
  else fileProfiles[slug] = existing;
  await fs.mkdir(path.dirname(profilesFile), { recursive: true });
  await fs.writeFile(profilesFile, JSON.stringify(fileProfiles, null, 2) + '\n', 'utf8');
  return fileProfiles[slug] || {};
}
