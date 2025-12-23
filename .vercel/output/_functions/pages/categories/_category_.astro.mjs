import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_C8kZGf5S.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DAouK2qU.mjs';
import { r as readDeals } from '../../chunks/store_BZaEBTqK.mjs';
import { $ as $$DealCard } from '../../chunks/DealCard_BSSbe30g.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://coursespeak.com");
const prerender = false;
const $$category = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  const urlParams = new URLSearchParams(Astro2.url.search);
  const page = urlParams.get("page");
  const allDeals = await readDeals();
  const categoryDeals = allDeals.filter((deal) => {
    if (!deal.category || !category) return false;
    const dealCat = deal.category.toLowerCase().trim();
    const targetCat = category.toLowerCase().replace(/-/g, " ").trim();
    return dealCat === targetCat || dealCat.includes(targetCat) || targetCat.includes(dealCat);
  });
  const PAGE_SIZE = 12;
  const currentPage = parseInt(page || "1") || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentItems = categoryDeals.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categoryDeals.length / PAGE_SIZE);
  const displayName = (category || "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Courses";
  const categoryName = displayName;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${categoryName} Courses | Udemy Deals`, "description": `Browse ${categoryDeals.length} ${categoryName.toLowerCase()} courses with exclusive deals and discounts.` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div${addAttribute({ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1rem" }, "style")}>  <div${addAttribute({ textAlign: "center", marginBottom: "3rem" }, "style")}> <h1${addAttribute({
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }, "style")}> ${categoryName} Courses
</h1> <p${addAttribute({
    fontSize: "1.1rem",
    color: "var(--muted)",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6"
  }, "style")}>
Discover ${categoryDeals.length}+ verified ${categoryName.toLowerCase()} courses with massive discounts. Learn from industry experts and advance your career today.
</p> <a href="/deals"${addAttribute({
    color: "#FFC107",
    textDecoration: "none",
    fontWeight: "600",
    display: "inline-block",
    marginTop: "1rem"
  }, "style")}>
← Back to all deals
</a> </div>  <div${addAttribute({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem"
  }, "style")}> ${currentItems.length > 0 ? currentItems.map((deal) => renderTemplate`${renderComponent($$result2, "DealCard", $$DealCard, { "deal": deal })}`) : renderTemplate`<div${addAttribute({
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "3rem",
    background: "var(--card)",
    borderRadius: "20px",
    border: "1px solid var(--border)"
  }, "style")}> <h3${addAttribute({ color: "var(--text)", marginBottom: "1rem", fontSize: "1.5rem" }, "style")}>
No courses found in ${categoryName} </h3> <p${addAttribute({ color: "var(--muted)", marginBottom: "1.5rem", lineHeight: "1.6" }, "style")}>
We couldn't find any courses in this category. Try browsing our other categories or check back later for new courses.
</p> <a href="/deals"${addAttribute({
    padding: "12px 24px",
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    border: "2px solid #FFC107",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    display: "inline-block"
  }, "style")}>
Browse All Courses
</a> </div>`} </div>  ${totalPages > 1 && renderTemplate`<div${addAttribute({ textAlign: "center", marginTop: "3rem", padding: "2rem" }, "style")}> <div${addAttribute({ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }, "style")}>  ${currentPage > 1 && renderTemplate`<a${addAttribute(`/categories/${category}?page=${currentPage - 1}`, "href")}${addAttribute({
    padding: "8px 12px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600"
  }, "style")}>
←
</a>`}  ${Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (pageNum) => pageNum === 1 || pageNum === totalPages || pageNum >= currentPage - 1 && pageNum <= currentPage + 1
  ).map((pageNum) => renderTemplate`<a${addAttribute(`/categories/${category}?page=${pageNum}`, "href")}${addAttribute({
    padding: "8px 12px",
    background: pageNum === currentPage ? "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)" : "var(--card)",
    border: pageNum === currentPage ? "2px solid #FFC107" : "1px solid var(--border)",
    borderRadius: "6px",
    color: pageNum === currentPage ? "white" : "var(--text)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: pageNum === currentPage ? "bold" : "600"
  }, "style")}> ${pageNum} </a>`)}  ${currentPage < totalPages && renderTemplate`<a${addAttribute(`/categories/${category}?page=${currentPage + 1}`, "href")}${addAttribute({
    padding: "8px 12px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600"
  }, "style")}>
→
</a>`} </div> <div${addAttribute({ color: "var(--muted)", fontSize: "14px", marginTop: "10px" }, "style")}>
Showing ${startIndex + 1}-${Math.min(endIndex, categoryDeals.length)} of ${categoryDeals.length} courses
</div> </div>`} </div> ` })}`;
}, "D:/web/coursespeak-astro/src/pages/categories/[category].astro", void 0);

const $$file = "D:/web/coursespeak-astro/src/pages/categories/[category].astro";
const $$url = "/categories/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
