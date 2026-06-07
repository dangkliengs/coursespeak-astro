/** Escape text for use inside SVG/XML. */
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Human-readable label from ISO date yyyy-mm-dd (UTC calendar day). */
export function formatBlogDateLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const W = 1200;
const H = 630;

/** OG-style cover for a daily coupon article. */
export function buildBlogCoverSvg(opts: {
  dateIso: string;
  dateLabel: string;
  couponCount?: number;
}): string {
  const { dateLabel } = opts;
  const label = escapeXml(dateLabel);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Top Udemy Coupons ${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <pattern id="noise" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="rgba(255,255,255,0.02)"/>
      <circle cx="2" cy="2" r="0.5" fill="rgba(255,255,255,0.08)"/>
    </pattern>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <!-- Background with gradient -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  
  <!-- Subtle noise overlay -->
  <rect width="${W}" height="${H}" fill="url(#noise)" opacity="0.08"/>
  
  <!-- Background accents -->
  <circle cx="1040" cy="120" r="220" fill="url(#accent)" opacity="0.08"/>
  <circle cx="250" cy="520" r="260" fill="rgba(59, 130, 246, 0.10)"/>
  
  <!-- Main icon -->
  <g transform="translate(96, 140)">
    <rect x="0" y="0" width="96" height="96" rx="28" fill="rgba(59, 130, 246, 0.18)"/>
    <path d="M28 32h40a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V38a6 6 0 0 1 6-6Z" fill="none" stroke="#f8fafc" stroke-width="6" stroke-linejoin="round"/>
    <path d="M40 54l14 14 24-32" fill="none" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  
  <!-- Title text -->
  <text x="220" y="190" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="70" font-weight="800" filter="url(#shadow)"># Top Udemy Coupons</text>
  <text x="220" y="260" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="40" font-weight="600" opacity="0.9">(${label})</text>
  
  <!-- Supporting tagline -->
  <text x="220" y="330" fill="#cbd5e1" font-family="system-ui, Segoe UI, sans-serif" font-size="28" font-weight="500" opacity="0.85">Free course coupons updated daily with verified discounts.</text>
  
  <!-- Bottom branding -->
  <text x="${W - 64}" y="${H - 48}" text-anchor="end" fill="#94a3b8" font-family="system-ui, Segoe UI, sans-serif" font-size="18" font-weight="600">CourseSpeak</text>
</svg>`;
}

/** Blog index / pagination OG image. */
export function buildBlogFeedCoverSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="CourseSpeak Blog — Daily Udemy Coupons">
  <defs>
    <linearGradient id="bgb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="goldb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#fcd34d"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bgb)"/>
  <rect x="64" y="64" width="10" height="200" rx="5" fill="url(#goldb)" opacity="0.95"/>
  <text x="96" y="150" fill="#94a3b8" font-family="system-ui, Segoe UI, sans-serif" font-size="24" font-weight="600" letter-spacing="0.14em">COURSESPEAK BLOG</text>
  <text x="96" y="260" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="58" font-weight="800">Daily Udemy Coupons</text>
  <text x="96" y="340" fill="#cbd5e1" font-family="system-ui, Segoe UI, sans-serif" font-size="32" font-weight="500">Free courses &amp; verified codes — updated every day</text>
  <text x="96" y="420" fill="#64748b" font-family="system-ui, Segoe UI, sans-serif" font-size="24">Browse by date · Development · Design · Business</text>
  <text x="${W - 64}" y="${H - 48}" text-anchor="end" fill="#64748b" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="600">coursespeak.com/blog</text>
</svg>`;
}
