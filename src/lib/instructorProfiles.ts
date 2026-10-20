import fs from 'node:fs/promises';
import path from 'node:path';
import instructorsData from '../data/instructors.json';
import { createInstructorSlug, parseInstructors } from './instructors';
import { readDeals } from './store';

export interface InstructorProfile {
  name?: string;
  image?: string;
  about?: string;
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

export async function getInstructorProfile(slug: string): Promise<InstructorProfile | undefined> {
  const fileProfiles = await readProfilesFile();
  const merged = { ...profiles, ...fileProfiles };
  return (
    merged[slug] ??
    merged[normalizedSlug(slug)] ??
    undefined
  );
}

/** Resolve image for an instructor slug, with diacritics-normalized fallback. */
export async function getInstructorImage(slug: string): Promise<string | undefined> {
  const image = (await getInstructorProfile(slug))?.image;
  return image ? image : undefined;
}

/** Resolve image directly from display name (handles speak vs wyn slug differences). */
export async function getInstructorImageByName(name: string): Promise<string | undefined> {
  const slug = createInstructorSlug(name);
  return (
    await getInstructorImage(slug) ??
    await getInstructorImage(normalizedSlug(name)) ??
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
      else map.set(slug, { slug, name, count: 1, image: merged[slug]?.image, about: merged[slug]?.about });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Save/clear an instructor photo in the registry file (used by /api/instructors). */
export async function setInstructorImage(slug: string, image: string, name?: string): Promise<InstructorProfile> {
  return setInstructorProfile(slug, { image, name });
}

/** Save/clear instructor profile fields (photo, name, about) in the registry file. */
export async function setInstructorProfile(slug: string, patch: {
  image?: string | null;
  name?: string | null;
  about?: string | null;
}): Promise<InstructorProfile> {
  const fileProfiles = await readProfilesFile();
  const existing = fileProfiles[slug] || {};
  if (patch.image !== undefined) {
    if (patch.image) existing.image = patch.image;
    else delete existing.image;
  }
  if (patch.name !== undefined) {
    if (patch.name) existing.name = patch.name;
    else delete existing.name;
  }
  if (patch.about !== undefined) {
    if (patch.about) existing.about = patch.about;
    else delete existing.about;
  }
  if (!existing.image && !existing.name && !existing.about) delete fileProfiles[slug];
  else fileProfiles[slug] = existing;
  await fs.mkdir(path.dirname(profilesFile), { recursive: true });
  await fs.writeFile(profilesFile, JSON.stringify(fileProfiles, null, 2) + '\n', 'utf8');
  return fileProfiles[slug] || {};
}
