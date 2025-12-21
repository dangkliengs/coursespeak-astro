export function normName(raw?: string | null) {
  if (!raw) return undefined;
  let v = String(raw).trim();
  v = v.replace(/&amp;/gi, "&");
  v = v.replace(/\s+/g, " ");
  return v || undefined;
}

export function slugifyCategory(name: string) {
  if (name === "Uncategorized") return "uncategorized";
  let v = name.toLowerCase();
  v = v.replace(/&amp;/gi, "&");
  v = v.replace(/&/g, " and ");
  v = v.replace(/[^\w\s-]/g, "");
  v = v.trim();
  v = v.replace(/\s+/g, "-");
  v = v.replace(/-+/g, "-");
  return v;
}
