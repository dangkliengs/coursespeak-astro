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
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#fcd34d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background with gradient -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="1050" cy="100" r="250" fill="url(#accent)" opacity="0.08"/>
  <circle cx="180" cy="550" r="300" fill="#f59e0b" opacity="0.06"/>
  <circle cx="900" cy="500" r="150" fill="#3b82f6" opacity="0.05"/>
  
  <!-- Grid pattern overlay -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  </pattern>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  
  <!-- Left accent bar -->
  <rect x="64" y="64" width="6" height="200" rx="3" fill="url(#gold)" filter="url(#glow)"/>
  
  <!-- Main title -->
  <text x="96" y="150" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="64" font-weight="800" filter="url(#shadow)">Top Udemy Coupons</text>
  
  <!-- Date highlight -->
  <text x="96" y="250" fill="url(#gold)" font-family="system-ui, Segoe UI, sans-serif" font-size="48" font-weight="700" filter="url(#glow)">${label}</text>
  
  <!-- Subtitle with icon -->
  <g transform="translate(96, 310)">
    <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.9"/>
    <path d="M8 12 L11 15 L16 9" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="125" y="325" fill="#cbd5e1" font-family="system-ui, Segoe UI, sans-serif" font-size="26" font-weight="500">${escapeXml(countLine)} · CourseSpeak</text>
  
  <!-- Feature badges -->
  <g transform="translate(96, 370)">
    <rect x="0" y="0" width="160" height="48" rx="10" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" stroke-width="2"/>
    <text x="80" y="32" text-anchor="middle" fill="#3b82f6" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="700">100% OFF</text>
  </g>
  
  <g transform="translate(275, 370)">
    <rect x="0" y="0" width="160" height="48" rx="10" fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" stroke-width="2"/>
    <text x="80" y="32" text-anchor="middle" fill="#22c55e" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="700">VERIFIED</text>
  </g>
  
  <g transform="translate(454, 370)">
    <rect x="0" y="0" width="160" height="48" rx="10" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="2"/>
    <text x="80" y="32" text-anchor="middle" fill="#f59e0b" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="700">FREE</text>
  </g>
  
  <!-- Bottom branding -->
  <text x="${W - 64}" y="${H - 48}" text-anchor="end" fill="#64748b" font-family="system-ui, Segoe UI, sans-serif" font-size="18" font-weight="600">coursespeak.com</text>
  
  <!-- Decorative elements -->
  <circle cx="1100" cy="200" r="8" fill="#f59e0b" opacity="0.4"/>
  <circle cx="1130" cy="180" r="5" fill="#3b82f6" opacity="0.5"/>
  <circle cx="1080" cy="220" r="6" fill="#22c55e" opacity="0.4"/>
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
