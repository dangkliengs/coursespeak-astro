/**
 * Split instructor list on commas that separate people.
 * Commas inside parentheses (e.g. "Faisal Memon (EmbarkX), Jane Doe") are not separators.
 */
export function parseInstructors(instructorField: string | undefined): string[] {
  if (!instructorField) return [];

  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < instructorField.length; i++) {
    const ch = instructorField[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === ',' && depth === 0) {
      parts.push(instructorField.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(instructorField.slice(start));

  return parts.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * URL slug for one instructor (aligned with DealCard / deal links).
 * Strips punctuation including parentheses: "Faisal Memon (EmbarkX)" → "faisal-memon-embarkx".
 */
export function createInstructorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

/** Older links kept "(" ")" in the slug; map these so bookmarks still resolve. */
export function legacyInstructorSlugWithParens(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s\-()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

/** All URL param values that should resolve to this display name. */
export function instructorSlugLookupKeys(name: string): string[] {
  const canonical = createInstructorSlug(name);
  const legacy = legacyInstructorSlugWithParens(name);
  return canonical === legacy ? [canonical] : [canonical, legacy];
}
