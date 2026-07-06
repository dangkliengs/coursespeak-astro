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
  dateLabel: string;
}): string {
  const { dateLabel } = opts;
  const label = escapeXml(dateLabel);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Udemy Coupons ${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="warm" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <linearGradient id="cool" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="50"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="30"/></filter>
  </defs>
  
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  
  <circle cx="200" cy="160" r="320" fill="url(#accent)" opacity="0.10" filter="url(#blur1)"/>
  <circle cx="1000" cy="480" r="240" fill="url(#warm)" opacity="0.08" filter="url(#blur1)"/>
  <circle cx="600" cy="540" r="200" fill="url(#cool)" opacity="0.07" filter="url(#blur1)"/>

  <g transform="translate(96, 145)">
    <circle cx="40" cy="40" r="40" fill="rgba(99, 102, 241, 0.2)"/>
    <circle cx="40" cy="40" r="28" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <text x="40" y="48" text-anchor="middle" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="32" font-weight="800">%</text>
  </g>
  
  <text x="200" y="210" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="72" font-weight="800" letter-spacing="-0.02em">Udemy Coupons Today</text>

  <g transform="translate(200, 238)">
    <rect x="0" y="0" width="60" height="4" rx="2" fill="url(#accent)"/>
  </g>

  <text x="200" y="290" fill="#94a3b8" font-family="system-ui, Segoe UI, sans-serif" font-size="30" font-weight="500">${label}</text>

  <text x="200" y="340" fill="#64748b" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="400">Free courses · Verified daily · 100% off</text>

  <text x="${W - 64}" y="${H - 48}" text-anchor="end" fill="#475569" font-family="system-ui, Segoe UI, sans-serif" font-size="14" font-weight="600">coursespeak.com</text>
</svg>`;
}

/** Blog index / pagination OG image. */
export function buildBlogFeedCoverSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="CourseSpeak Blog — Daily Udemy Coupons">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="warm" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <linearGradient id="cool" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="50"/></filter>
  </defs>
  
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  
  <circle cx="200" cy="160" r="320" fill="url(#accent)" opacity="0.10" filter="url(#blur1)"/>
  <circle cx="1000" cy="480" r="240" fill="url(#warm)" opacity="0.08" filter="url(#blur1)"/>
  <circle cx="600" cy="540" r="200" fill="url(#cool)" opacity="0.07" filter="url(#blur1)"/>

  <g transform="translate(96, 145)">
    <circle cx="40" cy="40" r="40" fill="rgba(99, 102, 241, 0.2)"/>
    <circle cx="40" cy="40" r="28" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <text x="40" y="48" text-anchor="middle" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="32" font-weight="800">%</text>
  </g>
  
  <text x="200" y="210" fill="#f8fafc" font-family="system-ui, Segoe UI, sans-serif" font-size="72" font-weight="800" letter-spacing="-0.02em">Udemy Coupons Today</text>

  <g transform="translate(200, 238)">
    <rect x="0" y="0" width="60" height="4" rx="2" fill="url(#accent)"/>
  </g>

  <text x="200" y="290" fill="#94a3b8" font-family="system-ui, Segoe UI, sans-serif" font-size="30" font-weight="500">Daily free courses &amp; verified codes</text>

  <text x="200" y="340" fill="#64748b" font-family="system-ui, Segoe UI, sans-serif" font-size="20" font-weight="400">Browse by date · Development · Design · Business</text>

  <text x="${W - 64}" y="${H - 48}" text-anchor="end" fill="#475569" font-family="system-ui, Segoe UI, sans-serif" font-size="14" font-weight="600">coursespeak.com</text>
</svg>`;
}
