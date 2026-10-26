export interface FAQ {
  q: string;
  a: string;
}

/**
 * Minimal structural shape of a deal needed to build FAQs.
 * Accepts both the page-local `Deal` interface and `types/deal.d.ts`.
 */
export interface FAQSource {
  title?: string;
  provider?: string;
  price?: number;
  originalPrice?: number;
  expiresAt?: string;
  updatedAt?: string;
  duration?: string;
  language?: string;
  learn?: string[];
  requirements?: string[];
  rating?: number;
  students?: number;
  category?: string;
  subcategory?: string;
  faqs?: { q: string; a: string }[];
}

const fmtDate = (iso?: string): string =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : "the date shown on this page";

// Same word-boundary heuristic used by the deal page: a loose /no|.../ pattern also
// matches "no" inside words such as "knowledge", which flips the meaning.
const BEGINNER_HINT = /\b(no|none|without|beginner|basic|familiar|any)\b/i;

/**
 * Returns hand-written FAQs when present, otherwise generates accurate,
 * data-driven FAQs from the deal. Shared by the visible FAQ section and the
 * FAQPage structured data so both always stay in sync.
 *
 * Generated questions are written as natural, keyword-bearing search queries
 * ("How much does <title> cost…") so they can serve as long-tail landing text.
 */
export function buildFAQs(deal: FAQSource): FAQ[] {
  if (deal.faqs && deal.faqs.length > 0) {
    return deal.faqs;
  }

  const generated: FAQ[] = [];
  const provider = deal.provider || "Udemy";
  const title = deal.title || "this course";
  const keyword = (deal.subcategory || deal.category || "").trim();

  if (deal.price !== undefined) {
    const price = deal.price ?? 9.99;
    const original = deal.originalPrice ?? 119.99;
    const discount = original > price ? Math.round(100 - (price / original) * 100) : 0;
    generated.push({
      q: `How much does ${title} cost with this coupon?`,
      a:
        price === 0
          ? `The regular price of this ${keyword || provider} course is $${original.toFixed(2)}, and it is currently free of charge on ${provider} with the coupon applied. ${provider} can restore the standard price at any time, so click "Redeem Coupon" to confirm the live price at checkout.`
          : `Regularly this course costs $${original.toFixed(2)} on ${provider}. With the coupon on this page you pay $${price.toFixed(2)} — a saving of $${(original - price).toFixed(2)}${discount > 0 ? ` (${discount}% off)` : ""}. ${provider} prices can change, so click "Redeem Coupon" to confirm the final price at checkout.`
    });
  }

  generated.push({
    q: `Is the coupon for ${title} still valid?`,
    a: `The coupon for this ${keyword || provider} course was verified on ${fmtDate(deal.updatedAt)}${deal.expiresAt ? ` and is scheduled to run until ${fmtDate(deal.expiresAt)}` : ""}. Coupons on ${provider} are time-limited and can be retired by the instructor without notice, so click "Redeem Coupon" to check current availability before the discount disappears.`
  });

  if (deal.duration) {
    const hours = parseHours(deal.duration);
    generated.push({
      q: `How long is the ${title} course?`,
      a: `The course contains about ${deal.duration} of on-demand video${deal.language ? ` and is taught in ${deal.language}` : ""}. Access is lifetime, so you can work through the material at your own pace and revisit any lecture after finishing.${deal.originalPrice != null && deal.price != null && hours > 0 ? ` At the current coupon price that works out to roughly $${(deal.price / hours).toFixed(2)} per hour of video.` : ""}`
    });
  }

  if (deal.learn && deal.learn.length > 0) {
    generated.push({
      q: `What will I learn in ${title}?`,
      a: `The course is built around these outcomes: ${deal.learn.slice(0, 5).join('; ')}. The full section-by-section breakdown is on the ${provider} course page, linked from the REDEEM COUPON button on this page.`
    });
  }

  if (deal.requirements && deal.requirements.length > 0) {
    const beginnerProof = deal.requirements.find(r => BEGINNER_HINT.test(r));
    const otherReqs = beginnerProof ? deal.requirements.filter(r => r !== beginnerProof) : deal.requirements;
    generated.push({
      q: `Do I need prior experience to take ${title}?`,
      a: beginnerProof
        ? `The course is set up so you can start without much of a barrier — the instructor lists: “${beginnerProof}”.${otherReqs.length ? ` Beyond that you will want: ${otherReqs.slice(0, 2).join('; ')}.` : ""}`
        : `Yes, some grounding helps. The instructor lists these prerequisites: ${deal.requirements.slice(0, 3).join('; ')}. Review them before enrolling so the ${keyword || provider} material does not move too fast.`
    });
  }

  generated.push({
    q: `Will I get a certificate after completing ${title}?`,
    a: `Yes. Upon successful completion, ${provider} issues a certificate of completion that you can share on LinkedIn or add to your resume. Lifetime access also means any future updates to the course are included.`
  });

  if (deal.rating) {
    generated.push({
      q: `What is the rating of ${title} on ${provider}?`,
      a: `It holds ${deal.rating.toFixed(1)} out of 5${deal.students ? ` from ${deal.students.toLocaleString()} student reviews` : ""} on ${provider}. That score, combined with the coupon price on this page, is the quickest signal of whether the ${keyword || "course"} content holds up in practice.`
    });
  }

  return generated;
}

/** Parse "5h 30m" / "22.5 hours" style durations into hours for cost-per-hour math. */
function parseHours(duration: string): number {
  const h = duration.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = duration.match(/(\d+)\s*m/);
  let total = 0;
  if (h) total += parseFloat(h[1]);
  if (m) total += parseInt(m[1], 10) / 60;
  return total;
}
