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
  const { dateIso, dateLabel, couponCount } = opts;
  const label = escapeXml(dateLabel);
  const iso = escapeXml(dateIso);
  const countLine =
    typeof couponCount === 'number' && couponCount > 0
      ? `${couponCount} verified coupons`
      : 'Verified Udemy coupons';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Top Udemy Coupons ${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="55%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#fcd34d"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1020" cy="120" r="200" fill="#fbbf24" opacity="0.06"/>
  <circle cx="140" cy="520" r="260" fill="#38bdf8" opacity="0.05"/>
  <rect x="64" y="64" width="8" height="180" rx="4" fill="url(#gold)" opacity="0.9"/>
  <text x="96" y="130" fill="#94a3b8" font-family="system-ui, Segoe UI, sans-serif" font-size="22" font-weight="600" letter-spacing="0.12em">${iso}</text>
  <text x="96" y="240" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="56" font-weight="800">Top Udemy Coupons</text>
  <text x="96" y="310" fill="url(#gold)" font-family="system-ui, Segoe UI, sans-serif" font-size="44" font-weight="700">${label}</text>
  <text x="96" y="390" fill="#cbd5e1" font-family="system-ui, Segoe UI, sans-serif" font-size="28" font-weight="500">${escapeXml(countLine)} · CourseSpeak</text>
  <g transform="translate(96, 440)" filter="url(#glow)">
    <rect x="0" y="0" width="200" height="56" rx="12" fill="#1e293b" stroke="#fbbf24" stroke-width="2" opacity="0.95"/>
    <text x="100" y="37" text-anchor="middle" fill="#fbbf24" font-family="system-ui, Segoe UI, sans-serif" font-size="22" font-weight="700">100% off deals</text>
  </g>
  <text x="${W - 64}" y="${H - 48}" text-anchor="end" fill="#64748b" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="600">coursespeak.com</text>
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
