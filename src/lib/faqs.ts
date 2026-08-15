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
      q: `Is the ${deal.title} coupon still valid?`,
      a: `The ${deal.title} coupon listed on this page was verified on ${deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'the date shown above'}. It applies a ${discount}% discount${deal.expiresAt ? ` and is valid until ${new Date(deal.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}. Coupons can expire quickly — click "Redeem Coupon" to check current availability.`
    });
  }

  if (deal.duration) {
    generated.push({
      q: `How long is the ${deal.title} course?`,
      a: `The course is approximately ${deal.duration} of on-demand video content. You get lifetime access, so you can study at your own pace whenever it suits you.`
    });
    generated.push({
      q: `Can I take ${deal.title} online at my own pace?`,
      a: `Yes. ${deal.title} is a self-paced online course with about ${deal.duration} of on-demand video, so you can learn online from anywhere and revisit any lecture later with lifetime access.`
    });
  }

  if (deal.learn && deal.learn.length > 0) {
    generated.push({
      q: `What will I learn in ${deal.title}?`,
      a: `This course covers: ${deal.learn.slice(0, 5).join('; ')}. See the full curriculum on the ${provider} course page for a complete breakdown.`
    });
  }

  if (deal.requirements && deal.requirements.length > 0) {
    generated.push({
      q: `Do I need any prior knowledge to take this course?`,
      a: `The instructor recommends: ${deal.requirements.slice(0, 3).join('; ')}.`
    });
  }

  const price = deal.price ?? 9.99;
  const original = deal.originalPrice ?? 119.99;
  const discount = original > price ? Math.round(100 - (price / original) * 100) : 0;
  generated.push({
    q: discount > 0
      ? `How can I get the ${discount}% Udemy discount for ${deal.title}?`
      : `Is ${deal.title} free on ${provider}?`,
    a: discount > 0
      ? `Click the Redeem Coupon button on this page to apply the verified ${discount}% off coupon and lock in the discounted ${provider} price of ${price === 0 ? 'free' : '$' + price.toFixed(2)} before it expires.`
      : `Yes, the current promotion makes ${deal.title} free on ${provider}. Click Redeem Coupon and complete checkout at ${price === 0 ? 'no cost' : 'the reduced price of $' + price.toFixed(2)} to enroll.`
  });

  if (discount > 0) {
    generated.push({
      q: `Is there a Udemy promo code or voucher for ${deal.title}?`,
      a: `Yes. The ${discount}% off promo code for ${deal.title} is verified and active on this page — click Redeem Coupon to apply the voucher and get the best price of $${price.toFixed(2)} instead of $${original.toFixed(2)}. Promo codes can expire quickly, so check the countdown on this page.`
    });
  }

  generated.push({
    q: `Will I get a certificate after completing this course?`,
    a: `Yes. Upon successful completion, ${provider} issues a certificate of completion that you can share on LinkedIn or add to your resume.`
  });

  generated.push({
    q: `Can I download ${deal.title} and watch it offline?`,
    a: `${deal.title} cannot be downloaded for free directly from this website. However, ${provider} is a fully online course, and its official mobile app for iOS and Android lets you download individual lectures for offline viewing whenever you're on the go.`
  });

  return generated;
}
