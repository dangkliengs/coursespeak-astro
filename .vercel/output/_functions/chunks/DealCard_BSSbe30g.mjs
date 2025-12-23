import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent, w as Fragment } from './astro/server_C8kZGf5S.mjs';
import 'piccolore';

const $$Astro = createAstro("https://coursespeak.com");
const $$DealCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DealCard;
  const { deal } = Astro2.props;
  function formatStudents(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }
  function genRating(key2) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < key2.length; i++) {
      h ^= key2.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    const r2 = (h >>> 0) / 4294967295;
    const val = 4.5 + 0.3 * r2;
    return Math.round(val * 10) / 10;
  }
  function genStudents(key2) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < key2.length; i++) {
      h ^= key2.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    const r2 = (h >>> 0) / 4294967295;
    const min = 1e3, max = 8e4;
    const val = Math.floor(min + (max - min) * Math.pow(r2, 0.6));
    return Math.round(val / 10) * 10;
  }
  const key = String(deal.id || "");
  const p = typeof deal.price === "number" && isFinite(deal.price) && deal.price > 0 ? deal.price : 0;
  const opRaw = typeof deal.originalPrice === "number" && isFinite(deal.originalPrice) ? deal.originalPrice : 119.99;
  const op = opRaw > p ? opRaw : 119.99;
  const r = typeof deal.rating === "number" && isFinite(deal.rating) ? deal.rating : genRating(key);
  const s = typeof deal.students === "number" && isFinite(deal.students) ? deal.students : genStudents(key);
  const hasDiscount = op > p && p > 0;
  const discountPct = hasDiscount ? Math.round(100 - p / op * 100) : null;
  const title = String(deal.title || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;|&#8217;/g, "'").replace(/&ndash;|&#8211;/g, " & ").replace(/\s{2,}/g, " ").trim();
  return renderTemplate`${maybeRenderHead()}<div${addAttribute({
    background: "var(--card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    position: "relative"
  }, "style")}>  ${p === 0 && renderTemplate`<div${addAttribute({
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "var(--brand)",
    color: "var(--bg)",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    zIndex: 10
  }, "style")}>
FREE
</div>`}  <div${addAttribute({
    height: "180px",
    background: `linear-gradient(135deg, var(--brand-soft) 0%, var(--accent-soft) 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }, "style")}> ${deal.image ? renderTemplate`<img${addAttribute(deal.image, "src")}${addAttribute(title, "alt")}${addAttribute({
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }, "style")} loading="lazy">` : renderTemplate`<svg width="60" height="60" viewBox="0 0 24 24" fill="var(--muted)" opacity="0.5"> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path> </svg>`} ${deal.duration && renderTemplate`<div${addAttribute({
    position: "absolute",
    top: "1rem",
    left: "1rem",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "0.25rem"
  }, "style")}> <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path> </svg> ${deal.duration} </div>`} </div>  <div${addAttribute({ padding: "1.5rem" }, "style")}> <h3${addAttribute({
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: "0.5rem",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  }, "style")}> <a${addAttribute(deal.url || `/deal/${deal.id}`, "href")}${addAttribute({
    color: "inherit",
    textDecoration: "none"
  }, "style")}> ${title} </a> </h3> <p${addAttribute({
    color: "var(--muted)",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  }, "style")}> ${deal.description || "Master this in-demand skill with comprehensive training from industry experts."} </p> <div${addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem"
  }, "style")}> <div${addAttribute({
    display: "flex",
    gap: "0.25rem",
    alignItems: "center"
  }, "style")}> ${[...Array(5)].map((_, i) => renderTemplate`<svg width="16" height="16" viewBox="0 0 24 24"${addAttribute(i < r ? "var(--brand)" : "var(--border)", "fill")}> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path> </svg>`)} </div> <span${addAttribute({
    color: "var(--muted)",
    fontSize: "0.85rem",
    fontWeight: 600
  }, "style")}> ${r.toFixed(1)} (${formatStudents(s)})
</span> </div> <div${addAttribute({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  }, "style")}> <div${addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  }, "style")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--muted)"> <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path> </svg> <span${addAttribute({
    color: "var(--muted)",
    fontSize: "0.85rem"
  }, "style")}> ${deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString() : "Updated recently"} </span> </div> ${deal.category && renderTemplate`<div${addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  }, "style")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--muted)"> <path d="M10 4H4c-1.11 0-2 .89-2 2v3h2V6h4V4zM10 19v-2H4v-3H2v3c0 1.11.89 2 2 2h6zM20 4h-6v2h4v3h2V6c0-1.11-.89-2-2-2zM20 16h-2v3h-4v2h6c1.11 0 2-.89 2-2v-3z"></path> </svg> <span${addAttribute({
    color: "var(--muted)",
    fontSize: "0.85rem"
  }, "style")}> ${deal.category} </span> </div>`} </div> <div${addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem"
  }, "style")}> <span${addAttribute({
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--brand)"
  }, "style")}> ${p === 0 ? "FREE" : `$${p.toFixed(2)}`} </span> ${hasDiscount && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <span${addAttribute({
    textDecoration: "line-through",
    color: "var(--muted)",
    fontSize: "0.9rem"
  }, "style")}>
$${op.toFixed(2)} </span> <span${addAttribute({
    background: "hsl(0, 84%, 60%)",
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 700
  }, "style")}> ${discountPct}% OFF
</span> ` })}`} </div> <a${addAttribute(deal.url || `/deal/${deal.id}`, "href")}${addAttribute({
    display: "block",
    width: "100%",
    padding: "0.75rem",
    background: "var(--brand)",
    color: "var(--bg)",
    textDecoration: "none",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer"
  }, "style")}> ${p === 0 ? "Enroll for Free" : "Get Deal"} </a> </div> </div>`;
}, "D:/web/coursespeak-astro/src/components/DealCard.astro", void 0);

export { $$DealCard as $ };
