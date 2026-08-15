/**
 * CourseSpeak Verdict — proprietary 0-10 score computed from real deal data.
 * Shared by the visible verdict badge (DealPage), the Review structured data,
 * and the SEO description generator so every surface stays consistent.
 */

export interface VerdictSource {
  id?: string;
  title?: string;
  provider?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  students?: number;
  duration?: string;
  learn?: string[];
  updatedAt?: string;
  coupon?: string;
  expiresAt?: string;
}

export interface Verdict {
  score: number;          // 0-10, one decimal
  label: string;          // "Excellent", "Great", "Good", "Fair"
  summary: string;        // one-sentence rationale
  grade: string;          // e.g. "A", "B+", "C"
}

/** Deterministic hash so the same deal always gets the same variant picks. */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function parseDurationHours(duration?: string): number | null {
  if (!duration) return null;
  const h = duration.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = duration.match(/(\d+)\s*m/);
  let total = 0;
  if (h) total += parseFloat(h[1]);
  if (m) total += parseInt(m[1], 10) / 60;
  return total > 0 ? total : null;
}

export function computeVerdict(deal: VerdictSource): Verdict {
  // Base from rating: 5.0★ → 7.0, 4.6★ → ~6.4, 4.0★ → ~5.6.
  // A perfect 5.0 (all 5-star reviews) gets a large bonus so it lands on A,
  // while a strong 4.6 stays around A-/B+ and never reads as "Excellent".
  let score = deal.rating != null ? Math.min(deal.rating, 5) * 1.4 : 5.8;

  const rating = deal.rating ?? 0;
  if (rating >= 5) score += 1.2;
  else if (rating >= 4.8) score += 0.5;
  else if (rating >= 4.6) score += 0.1;

  // Depth: longer courses with real substance score a bit higher
  const hours = parseDurationHours(deal.duration);
  if (hours != null) {
    if (hours >= 15) score += 0.4;
    else if (hours >= 6) score += 0.3;
    else if (hours >= 2) score += 0.1;
  }

  // Social proof: student count signals the content holds up in practice
  const students = deal.students ?? 0;
  if (students >= 50000) score += 0.5;
  else if (students >= 10000) score += 0.3;
  else if (students >= 1000) score += 0.1;

  // Currency: recently verified + active coupon = more actionable
  const dealPrice = deal.price ?? 0;
  const original = deal.originalPrice ?? 0;
  const discountPct = original > dealPrice ? Math.round(100 - (dealPrice / original) * 100) : 0;
  if (discountPct >= 90) score += 0.3;
  else if (discountPct > 0) score += 0.15;
  if (deal.coupon) score += 0.1;

  // Freshness: a recently checked deal is more reliable right now
  if (deal.updatedAt) {
    const days = (Date.now() - new Date(deal.updatedAt).getTime()) / (24 * 60 * 60 * 1000);
    if (days <= 7) score += 0.2;
    else if (days <= 30) score += 0.1;
  }

  score = Math.min(Math.max(score, 4.0), 9.9);
  score = Math.round(score * 10) / 10;

  return {
    score,
    label: score >= 8.5 ? "Excellent" : score >= 7.5 ? "Great" : score >= 6.5 ? "Good" : score >= 5.5 ? "Worthwhile" : "Fair",
    grade: score >= 8.5 ? "A" : score >= 7.5 ? "A-" : score >= 6.5 ? "B+" : score >= 5.5 ? "B" : "C+",
    summary: buildVerdictSummary({ ...deal, discountPct, hours })
  };
}

function buildVerdictSummary(deal: VerdictSource & { discountPct: number; hours: number | null }): string {
  const title = deal.title || "This course";
  const parts: string[] = [];

  if (deal.rating != null && deal.students) {
    parts.push(`a ${deal.rating.toFixed(1)}-star average from ${deal.students.toLocaleString()} students`);
  } else if (deal.rating != null) {
    parts.push(`a ${deal.rating.toFixed(1)}-star average`);
  }

  if (deal.hours != null) {
    parts.push(`${deal.hours} hours of on-demand video`);
  }

  const hasStrongDiscount = deal.discountPct >= 90;
  const hasAnyDiscount = deal.discountPct > 0;

  if (hasStrongDiscount || deal.coupon) {
    parts.push(deal.coupon ? "an active verified coupon" : "a verified coupon");
  }

  const intro = hasStrongDiscount ? "Unusually strong value" : hasAnyDiscount ? "Solid value" : "Reasonable value";
  const what = parts.length > 0 ? `, backed by ${parts.join(", ")}` : "";
  return `${intro} for ${title}${what}.`;
}

/**
 * Snippet-friendly plain-text block for the coupon status area.
 * This is the text Google tends to pick when it rewrites the meta
 * description, so it deliberately mirrors the search intent.
 */
export function buildCouponSnippet(deal: VerdictSource): string {
  const title = deal.title || "This course";
  const dealPrice = deal.price ?? 0;
  const original = deal.originalPrice ?? 0;
  const discountPct = original > dealPrice ? Math.round(100 - (dealPrice / original) * 100) : 0;

  let text = `Check Udemy coupon availability for ${title}. See current price, coupon availability and last verified date`;

  if (discountPct > 0) {
    text = `Check Udemy coupon availability for ${title}. See current price (${discountPct}% off), coupon availability and last verified date`;
  }
  if (deal.expiresAt) {
    const d = new Date(deal.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    text = `Check Udemy coupon availability for ${title}. Valid until ${d} — see current price, coupon availability and last verified date`;
  }
  return text;
}

/**
 * Varied, data-driven SEO description (~150-200 chars).
 * Always leads with the FULL course title (the primary query users type,
 * e.g. "Complete 2026 Python Bootcamp: Learn Python from Scratch coupon"),
 * then a natural deal phrase, one short UNTRUNCATED benefit, and a compact
 * data tail. Variants are chosen deterministically per deal id so no two
 * pages share an identical string while every description stays factual.
 */
export function buildSeoDescription(deal: VerdictSource): string {
  const title = deal.title || "This course";
  const provider = deal.provider || "Udemy";

  const dealPrice = deal.price ?? 0;
  const original = deal.originalPrice ?? 0;
  const discountPct = original > dealPrice ? Math.round(100 - (dealPrice / original) * 100) : 0;
  const hours = parseDurationHours(deal.duration);
  const level = deal.rating != null ? `${deal.rating.toFixed(1)}★` : null;

  const benefit = pickBenefit(deal.learn || []);
  const freeOrOff = dealPrice === 0 ? "free" : `${discountPct}% off`;
  const seed = hashString(deal.id || title);
  const variant = seed % 4;

  // All variants carry the full title (the #1 query) up front.
  const headline =
    variant === 0 ? `${title} — ${freeOrOff} with our verified ${provider} coupon.`
    : variant === 1 ? `Get ${title} ${freeOrOff} — verified ${provider} coupon.`
    : variant === 2 ? `${title}: claim our verified ${discountPct}% off ${provider} coupon.`
    : `Save ${discountPct}% on ${title} with a verified ${provider} coupon.`;

  const benefitSentence = benefit ? ` ${benefit}` : "";
  const base = headline + benefitSentence;

  const tailParts: string[] = [];
  if (hours != null) tailParts.push(`${hours}h`);
  if (level) tailParts.push(level);
  if (deal.students && deal.students > 0) tailParts.push(`${deal.students.toLocaleString()} students`);
  if (deal.expiresAt) tailParts.push(`expires ${new Date(deal.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
  const tail = tailParts.length > 0 ? ` ${tailParts.join(" · ")}.` : "";

  let description = (base + tail).replace(/\s+/g, " ").trim();
  if (description.length > 200 && tail) {
    description = base.replace(/\s+/g, " ").trim();
  }

  // Safety: the transactional keyword must always be present.
  if (!/udemy|discount|off|coupon|free/i.test(description)) {
    return `${headline} ${provider} coupon.`.replace(/\s+/g, " ").trim();
  }
  return description;
}

/**
 * Pick the shortest complete learning outcome so the description reads
 * naturally without an awkward "…" truncation. Only items that fit whole
 * (20-70 chars) are used; if none fit, the benefit is omitted entirely
 * rather than being cut off mid-phrase.
 */
function pickBenefit(learn: string[]): string | null {
  const items = learn.map((s) => cleanLearn(s)).filter(Boolean);
  if (items.length === 0) return null;

  const complete = items.filter((s) => s.length >= 20 && s.length <= 70)
    .sort((a, b) => a.length - b.length);
  if (complete.length > 0) return capitalize(complete[0]) + ".";

  return null;
}

function cleanLearn(item: string): string {
  return item.replace(/\r/g, "").replace(/\.+$/g, "").replace(/\s+/g, " ").trim();
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}