import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead, u as unescapeHTML } from '../../chunks/astro/server_C8kZGf5S.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DAouK2qU.mjs';
import { $ as $$DealCard } from '../../chunks/DealCard_BSSbe30g.mjs';
import { r as readDeals } from '../../chunks/store_BZaEBTqK.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://coursespeak.com");
const prerender = false;
const $$page = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$page;
  const allDeals = await readDeals();
  const PAGE_SIZE = 12;
  const currentPage = parseInt(Astro2.params.page || "1", 10);
  console.log("URL:", Astro2.url.href);
  console.log("Astro.params:", Astro2.params);
  console.log("Current page:", currentPage);
  const totalPages = Math.ceil(allDeals.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentItems = allDeals.slice(startIndex, endIndex);
  console.log("Total deals:", allDeals.length);
  console.log("Total pages:", totalPages);
  console.log("Start index:", startIndex);
  console.log("End index:", endIndex);
  console.log("Current items length:", currentItems.length);
  const currentDate = /* @__PURE__ */ new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const pageTitle = `All Udemy Deals & Discounts ${currentMonth} ${currentYear} | CourseSpeak`;
  const pageDescription = `Find ${allDeals.length}+ verified Udemy deals with up to 100% off. Latest coupons and discounts updated daily.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": "https://coursespeak.com/deals",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": currentItems.length,
      "itemListElement": currentItems.map((deal, index) => ({
        "@type": "Course",
        "position": startIndex + index + 1,
        "name": deal.title,
        "description": deal.description,
        "provider": {
          "@type": "Organization",
          "name": deal.instructor
        },
        "offers": {
          "@type": "Offer",
          "price": deal.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "validThrough": deal.expiresAt
        }
      }))
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", "<div", ">  <div", "> <h1", "> ", " </h1> <p", "> ", " </p> </div>  <div", "> ", " </div>  <div", "> <div", "> ", " <span", ">\nPage ", " of ", " </span> ", " </div> <div", ">\nShowing ", "-", " of ", " deals\n</div> </div> <!-- FAQ Section for SEO --> <div", "> <h2", ">\nFrequently Asked Questions\n</h2> <div", "> <div", "> <h3", ">\nAre these Udemy deals legitimate?\n</h3> <p", ">\nYes! All deals on CourseSpeak are verified and sourced directly from Udemy or authorized partners. We regularly check and update our deals to ensure they're active and legitimate.\n</p> </div> <div", "> <h3", ">\nHow often are new deals added?\n</h3> <p", ">\nWe update our deals database daily with new Udemy courses and coupons. Check back regularly for the latest discounts and free courses.\n</p> </div> <div", "> <h3", ">\nDo I need to pay for CourseSpeak?\n</h3> <p", ">\nNo! CourseSpeak is completely free to use. We don't charge for accessing deals, coupons, or course information. Our mission is to help you find the best educational opportunities.\n</p> </div> </div> </div> </div> "])), unescapeHTML(JSON.stringify(structuredData)), maybeRenderHead(), addAttribute({ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1rem" }, "style"), addAttribute({ textAlign: "center", marginBottom: "3rem" }, "style"), addAttribute({
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }, "style"), pageTitle, addAttribute({
    fontSize: "1.1rem",
    color: "var(--muted)",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6"
  }, "style"), pageDescription, addAttribute({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem"
  }, "style"), currentItems.map((deal) => renderTemplate`${renderComponent($$result2, "DealCard", $$DealCard, { "deal": deal })}`), addAttribute({ textAlign: "center", marginTop: "3rem", padding: "2rem" }, "style"), addAttribute({ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }, "style"), currentPage > 1 && renderTemplate`<a${addAttribute(`/deals/${currentPage - 1}`, "href")}${addAttribute({
    padding: "8px 16px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500"
  }, "style")}>
← Previous
</a>`, addAttribute({
    padding: "8px 16px",
    background: "var(--brand)",
    border: "1px solid var(--brand)",
    borderRadius: "6px",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold"
  }, "style"), currentPage, totalPages, currentPage < totalPages && renderTemplate`<a${addAttribute(`/deals/${currentPage + 1}`, "href")}${addAttribute({
    padding: "8px 16px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500"
  }, "style")}>
Next →
</a>`, addAttribute({ color: "var(--muted)", fontSize: "12px", marginTop: "10px" }, "style"), startIndex + 1, Math.min(endIndex, allDeals.length), allDeals.length, addAttribute({
    marginTop: "4rem",
    padding: "2rem",
    background: "linear-gradient(135deg, #1a1d29 0%, #2d3748 100%)",
    borderRadius: "16px",
    border: "1px solid #3b82f6",
    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.1)"
  }, "style"), addAttribute({
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: "white"
  }, "style"), addAttribute({ display: "grid", gap: "1rem" }, "style"), addAttribute({
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  }, "style"), addAttribute({ color: "white", marginBottom: "0.5rem", fontSize: "1.1rem" }, "style"), addAttribute({ color: "rgba(255, 255, 255, 0.8)", margin: 0, lineHeight: "1.6" }, "style"), addAttribute({
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  }, "style"), addAttribute({ color: "white", marginBottom: "0.5rem", fontSize: "1.1rem" }, "style"), addAttribute({ color: "rgba(255, 255, 255, 0.8)", margin: 0, lineHeight: "1.6" }, "style"), addAttribute({
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  }, "style"), addAttribute({ color: "white", marginBottom: "0.5rem", fontSize: "1.1rem" }, "style"), addAttribute({ color: "rgba(255, 255, 255, 0.8)", margin: 0, lineHeight: "1.6" }, "style")) })}`;
}, "D:/web/coursespeak-astro/src/pages/deals/[page].astro", void 0);

const $$file = "D:/web/coursespeak-astro/src/pages/deals/[page].astro";
const $$url = "/deals/[page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$page,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
