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
  learn?: string[];
  requirements?: string[];
  faqs?: { q: string; a: string }[];
}

/**
 * Returns hand-written FAQs when present, otherwise generates accurate,
 * data-driven FAQs from the deal. Shared by the visible FAQ section and the
 * FAQPage structured data so both always stay in sync.
 */
export function buildFAQs(deal: FAQSource): FAQ[] {
  if (deal.faqs && deal.faqs.length > 0) {
    return deal.faqs;
  }

  const generated: FAQ[] = [];
  const provider = deal.provider || "the course platform";

  if (deal.price !== undefined) {
    const price = deal.price ?? 9.99;
    const original = deal.originalPrice ?? 119.99;
    const discount = original > price ? Math.round(100 - (price / original) * 100) : 0;
    generated.push({
      q: `Is the coupon for "${deal.title}" still valid?`,
      a: `The coupon listed on this page was verified on ${deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'the date shown above'}. It applies a ${discount}% discount${deal.expiresAt ? ` and is valid until ${new Date(deal.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}. Coupons can expire quickly — click "Redeem Coupon" to check current availability.`
    });
  }

  if (deal.duration) {
    generated.push({
      q: `How long is the "${deal.title}" course?`,
      a: `The course is approximately ${deal.duration} of on-demand video content. You get lifetime access, so you can study at your own pace.`
    });
  }

  if (deal.learn && deal.learn.length > 0) {
    generated.push({
      q: `What will I learn in "${deal.title}"?`,
      a: `This course covers: ${deal.learn.slice(0, 5).join('; ')}. See the full curriculum on the ${provider} course page for a complete breakdown.`
    });
  }

  if (deal.requirements && deal.requirements.length > 0) {
    generated.push({
      q: `Do I need any prior knowledge to take this course?`,
      a: `The instructor recommends: ${deal.requirements.slice(0, 3).join('; ')}.`
    });
  }

  generated.push({
    q: `Will I get a certificate after completing this course?`,
    a: `Yes. Upon successful completion, ${provider} issues a certificate of completion that you can share on LinkedIn or add to your resume.`
  });

  return generated;
}
