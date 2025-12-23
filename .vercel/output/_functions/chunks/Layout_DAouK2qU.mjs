import { e as createAstro, f as createComponent, r as renderTemplate, l as renderScript, h as addAttribute, n as renderSlot, v as renderHead } from './astro/server_C8kZGf5S.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://coursespeak.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "CourseSpeak - Free Udemy Courses & Deals",
    description = "Find verified Udemy deals with 100% off coupons. Updated daily with free courses and discounts.",
    image,
    // No default - let each page provide its own image
    type = "website",
    canonical
  } = Astro2.props;
  const siteUrl = "https://coursespeak.com";
  const canonicalURL = canonical || new URL(Astro2.url.pathname, siteUrl).href;
  (/* @__PURE__ */ new Date()).getFullYear();
  const absoluteImageUrl = image ? image.startsWith("http") ? image : new URL(image, siteUrl).href : null;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Performance & SEO Meta Tags --><meta name="theme-color" content="#1a1a2e"><meta name="msapplication-TileColor" content="#1a1a2e"><meta name="referrer" content="no-referrer-when-downgrade"><meta name="format-detection" content="telephone=no"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="CourseSpeak"><!-- Preconnect for performance --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://images.unsplash.com" crossorigin><link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin><!-- DNS prefetch for external domains --><link rel="dns-prefetch" href="//www.udemy.com"><link rel="dns-prefetch" href="//www.coursera.org"><link rel="dns-prefetch" href="//www.edx.org"><!-- Resource hints --><link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml"><link rel="preload" href="../styles/globals.css" as="style"><!-- Google AdSense --><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8220442576502761" crossorigin="anonymous"></script><meta name="generator"', '><link rel="canonical"', "><title>", '</title><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', ">", "", "", "", "", '<!-- Twitter --><meta property="twitter:card"', '><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', ">", "", '<!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=cal:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-sckkx6r4> <header class="site-header"', ' data-astro-cid-sckkx6r4> <nav class="container"', ' data-astro-cid-sckkx6r4> <a href="/" class="logo" data-astro-cid-sckkx6r4> <div', " data-astro-cid-sckkx6r4> <div", ' data-astro-cid-sckkx6r4> <svg width="24" height="24" viewBox="0 0 24 24" fill="white" data-astro-cid-sckkx6r4> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-astro-cid-sckkx6r4></path> </svg> </div> <div', " data-astro-cid-sckkx6r4> <span", " data-astro-cid-sckkx6r4> <span", " data-astro-cid-sckkx6r4>Course</span> <span", " data-astro-cid-sckkx6r4>Speak</span> </span> <span", " data-astro-cid-sckkx6r4>FREE UDEMY COURSES</span> </div> </div> </a> <div", " data-astro-cid-sckkx6r4>  <div", ' data-astro-cid-sckkx6r4> <a href="/"', ' data-astro-cid-sckkx6r4> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" data-astro-cid-sckkx6r4></path> </svg>\nFree Courses\n</a> <a href="/categories"', ' data-astro-cid-sckkx6r4> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M12 2l-5.5 9h11z" data-astro-cid-sckkx6r4></path> <circle cx="17.5" cy="17.5" r="4.5" data-astro-cid-sckkx6r4></circle> <path d="M3 13.5h8v8H3z" data-astro-cid-sckkx6r4></path> </svg>\nCategories\n</a> <a href="/deals"', ' data-astro-cid-sckkx6r4> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" data-astro-cid-sckkx6r4></path> </svg>\nLatest Coupons\n</a> <a href="/popular"', ' data-astro-cid-sckkx6r4> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-astro-cid-sckkx6r4></path> </svg>\nPopular\n<span', ' data-astro-cid-sckkx6r4>HOT</span> </a> <a href="/success-stories"', ' data-astro-cid-sckkx6r4> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" data-astro-cid-sckkx6r4></path> </svg>\nStories\n</a> </div>  <div', ' data-astro-cid-sckkx6r4> <form action="/search" method="get"', ' data-astro-cid-sckkx6r4> <input type="text" name="q" placeholder="Search courses..."', ' data-astro-cid-sckkx6r4> <button type="submit"', ' data-astro-cid-sckkx6r4> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" data-astro-cid-sckkx6r4></path> </svg> </button> </form> </div> </div> </nav> </header> <main', " data-astro-cid-sckkx6r4> ", " </main> <footer", " data-astro-cid-sckkx6r4> <div", " data-astro-cid-sckkx6r4>  <div", " data-astro-cid-sckkx6r4> <div", " data-astro-cid-sckkx6r4></div> <h3", " data-astro-cid-sckkx6r4>\nGet Exclusive Udemy Coupons\n</h3> <p", " data-astro-cid-sckkx6r4>\nSubscribe to our newsletter and never miss a deal. Get the latest Udemy coupons delivered to your inbox daily.\n</p> <div", ' data-astro-cid-sckkx6r4> <input type="email" placeholder="Enter your email"', " data-astro-cid-sckkx6r4> <button", " data-astro-cid-sckkx6r4>\nSubscribe\n</button> </div> </div>  <div", " data-astro-cid-sckkx6r4> <div data-astro-cid-sckkx6r4> <h3", " data-astro-cid-sckkx6r4>\nCourseSpeak\n</h3> <p", " data-astro-cid-sckkx6r4>\nFind the best online course deals and coupons. Daily updated\n              discounts for Udemy, Coursera, and more.\n</p> </div> <div data-astro-cid-sckkx6r4> <h4", " data-astro-cid-sckkx6r4>Links</h4> <ul", " data-astro-cid-sckkx6r4> <li", ' data-astro-cid-sckkx6r4> <a href="/"', " data-astro-cid-sckkx6r4>Home</a> </li> <li", ' data-astro-cid-sckkx6r4> <a href="/deals"', " data-astro-cid-sckkx6r4>Deals</a> </li> <li", ' data-astro-cid-sckkx6r4> <a href="/about"', " data-astro-cid-sckkx6r4>About</a> </li> <li", ' data-astro-cid-sckkx6r4> <a href="/udemy-coupons-guide"', " data-astro-cid-sckkx6r4>Udemy Coupons Guide</a> </li> <li", ' data-astro-cid-sckkx6r4> <a href="/how-to-redeem-coupon"', " data-astro-cid-sckkx6r4>How to Redeem</a> </li> </ul> </div> <div data-astro-cid-sckkx6r4> <h4", " data-astro-cid-sckkx6r4>Company</h4> <ul", " data-astro-cid-sckkx6r4> <li", ' data-astro-cid-sckkx6r4> <a href="/privacy"', " data-astro-cid-sckkx6r4>Privacy</a> </li> <li", ' data-astro-cid-sckkx6r4> <a href="/terms"', " data-astro-cid-sckkx6r4>Terms</a> </li> <li", ' data-astro-cid-sckkx6r4> <a href="/contact"', " data-astro-cid-sckkx6r4>Contact</a> </li> </ul> </div> </div>  <div", " data-astro-cid-sckkx6r4> <h4", " data-astro-cid-sckkx6r4>\nTrusted by 100,000+ Learners Worldwide\n</h4> <div", " data-astro-cid-sckkx6r4> <div", ' data-astro-cid-sckkx6r4> <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" data-astro-cid-sckkx6r4> <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" data-astro-cid-sckkx6r4></path> </svg> <span data-astro-cid-sckkx6r4>Verified Coupons</span> </div> <div', ' data-astro-cid-sckkx6r4> <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" data-astro-cid-sckkx6r4> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" data-astro-cid-sckkx6r4></path> </svg> <span data-astro-cid-sckkx6r4>Secure Payments</span> </div> <div', ' data-astro-cid-sckkx6r4> <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" data-astro-cid-sckkx6r4> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-astro-cid-sckkx6r4></path> </svg> <span data-astro-cid-sckkx6r4>4.8★ Rating</span> </div> <div', ' data-astro-cid-sckkx6r4> <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" data-astro-cid-sckkx6r4> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" data-astro-cid-sckkx6r4></path> </svg> <span data-astro-cid-sckkx6r4>24/7 Support</span> </div> </div> </div>  <div', " data-astro-cid-sckkx6r4> <p", " data-astro-cid-sckkx6r4>\n&copy; ", " CourseSpeak. All rights reserved.\n</p> <p", ' data-astro-cid-sckkx6r4>\nHelping learners save money on online courses since 2023\n</p> </div> </div> </footer>  <button id="backToTop"', ' aria-label="Back to top" data-astro-cid-sckkx6r4> <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sckkx6r4> <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" data-astro-cid-sckkx6r4></path> </svg> </button> ', " </body> </html>"])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), addAttribute(canonicalURL, "href"), title, addAttribute(type, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), absoluteImageUrl && renderTemplate`<meta property="og:image"${addAttribute(absoluteImageUrl, "content")}>`, absoluteImageUrl && renderTemplate`<meta property="og:image:secure_url"${addAttribute(absoluteImageUrl, "content")}>`, absoluteImageUrl && renderTemplate`<meta property="og:image:width" content="1200">`, absoluteImageUrl && renderTemplate`<meta property="og:image:height" content="630">`, absoluteImageUrl && renderTemplate`<meta property="og:image:alt"${addAttribute(title, "content")}>`, addAttribute(absoluteImageUrl ? "summary_large_image" : "summary", "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), absoluteImageUrl && renderTemplate`<meta property="twitter:image"${addAttribute(absoluteImageUrl, "content")}>`, absoluteImageUrl && renderTemplate`<meta property="twitter:image:alt"${addAttribute(title, "content")}>`, renderHead(), addAttribute({
    position: "sticky",
    top: 0,
    zIndex: 1e3,
    background: "var(--bg)",
    borderBottom: "1px solid var(--border)"
  }, "style"), addAttribute({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    maxWidth: "1400px",
    margin: "0 auto"
  }, "style"), addAttribute({ display: "flex", alignItems: "center", gap: "12px" }, "style"), addAttribute({
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, var(--brand) 0%, hsl(35, 90%, 68%) 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: "0 4px 12px -2px hsla(45, 95%, 58%, 0.3)"
  }, "style"), addAttribute({ display: "flex", flexDirection: "column" }, "style"), addAttribute({
    fontSize: "1.6rem",
    fontWeight: 800,
    lineHeight: "1.2"
  }, "style"), addAttribute({
    background: "linear-gradient(135deg, var(--brand) 0%, hsl(35, 90%, 68%) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }, "style"), addAttribute({
    background: "linear-gradient(135deg, var(--text) 0%, var(--muted) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }, "style"), addAttribute({
    fontSize: "0.75rem",
    color: "var(--muted)",
    fontWeight: 600,
    letterSpacing: "0.1em"
  }, "style"), addAttribute({ display: "flex", gap: "12px", alignItems: "center", flex: 1, justifyContent: "space-between" }, "style"), addAttribute({
    display: "flex",
    gap: "4px",
    alignItems: "center",
    background: "var(--card)",
    padding: "4px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    flexWrap: "nowrap",
    overflow: "auto"
  }, "style"), addAttribute({
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap",
    flexShrink: 0
  }, "style"), addAttribute({
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap",
    flexShrink: 0
  }, "style"), addAttribute({
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap",
    flexShrink: 0
  }, "style"), addAttribute({
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap",
    flexShrink: 0
  }, "style"), addAttribute({
    background: "var(--brand)",
    color: "var(--bg)",
    fontSize: "0.6rem",
    padding: "1px 4px",
    borderRadius: "999px",
    fontWeight: 700
  }, "style"), addAttribute({
    color: "var(--text)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap",
    flexShrink: 0
  }, "style"), addAttribute({ flex: 1, display: "flex", justifyContent: "center" }, "style"), addAttribute({
    display: "flex",
    gap: "0",
    background: "var(--input)",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    overflow: "hidden",
    maxWidth: "300px",
    width: "100%"
  }, "style"), addAttribute({
    background: "transparent",
    color: "var(--text)",
    border: "none",
    padding: "6px 12px",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none"
  }, "style"), addAttribute({
    background: "var(--brand)",
    color: "var(--bg)",
    border: "none",
    padding: "6px 10px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ minHeight: "calc(100vh - 300px)" }, "style"), renderSlot($$result, $$slots["default"]), addAttribute({
    color: "hsl(215, 20%, 65%)",
    padding: "80px 0 40px",
    marginTop: "auto",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, hsl(222, 47%, 7%) 0%, hsl(222, 43%, 10%) 100%)"
  }, "style"), addAttribute({ maxWidth: "1400px", margin: "0 auto", padding: "0 1rem" }, "style"), addAttribute({
    background: "var(--card)",
    padding: "3rem",
    borderRadius: "24px",
    marginBottom: "64px",
    border: "1px solid var(--border)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden"
  }, "style"), addAttribute({
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "150px",
    height: "150px",
    background: "var(--brand)",
    borderRadius: "50%",
    opacity: 0.1
  }, "style"), addAttribute({
    color: "#fff",
    fontSize: "2rem",
    fontWeight: 800,
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }, "style"), addAttribute({
    color: "hsl(215, 20%, 65%)",
    marginBottom: "2rem",
    maxWidth: "600px",
    margin: "0 auto 2rem",
    fontSize: "1.1rem",
    lineHeight: 1.6
  }, "style"), addAttribute({
    display: "flex",
    gap: "1rem",
    maxWidth: "600px",
    margin: "0 auto",
    flexWrap: "wrap"
  }, "style"), addAttribute({
    flex: 1,
    minWidth: "250px",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    border: "2px solid var(--border)",
    background: "var(--input)",
    color: "var(--text)",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({
    padding: "1rem 2.5rem",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    color: "var(--bg)",
    border: "none",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px -4px rgba(255, 193, 7, 0.4)"
  }, "style"), addAttribute({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "32px",
    marginBottom: "48px"
  }, "style"), addAttribute({
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "16px",
    fontSize: "1.2rem",
    fontWeight: "700"
  }, "style"), addAttribute({
    fontSize: "0.9rem",
    lineHeight: "1.5",
    color: "hsl(215, 20%, 65%)",
    marginBottom: "16px"
  }, "style"), addAttribute({
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "16px",
    fontSize: "1.1rem",
    fontWeight: "600"
  }, "style"), addAttribute({ listStyle: "none", padding: 0, margin: 0 }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "16px",
    fontSize: "1.1rem",
    fontWeight: "600"
  }, "style"), addAttribute({ listStyle: "none", padding: 0, margin: 0 }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({ marginBottom: "12px" }, "style"), addAttribute({
    color: "hsl(215, 20%, 85%)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }, "style"), addAttribute({
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    padding: "32px 0",
    marginBottom: "32px",
    textAlign: "center"
  }, "style"), addAttribute({
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
    fontWeight: "700"
  }, "style"), addAttribute({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3rem",
    flexWrap: "wrap"
  }, "style"), addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "8px 16px",
    background: "rgba(255, 193, 7, 0.1)",
    border: "1px solid rgba(255, 193, 7, 0.3)",
    borderRadius: "8px",
    color: "#FFC107",
    fontWeight: "500"
  }, "style"), addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "8px 16px",
    background: "rgba(255, 193, 7, 0.1)",
    border: "1px solid rgba(255, 193, 7, 0.3)",
    borderRadius: "8px",
    color: "#FFC107",
    fontWeight: "500"
  }, "style"), addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "8px 16px",
    background: "rgba(255, 193, 7, 0.1)",
    border: "1px solid rgba(255, 193, 7, 0.3)",
    borderRadius: "8px",
    color: "#FFC107",
    fontWeight: "500"
  }, "style"), addAttribute({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "8px 16px",
    background: "rgba(255, 193, 7, 0.1)",
    border: "1px solid rgba(255, 193, 7, 0.3)",
    borderRadius: "8px",
    color: "#FFC107",
    fontWeight: "500"
  }, "style"), addAttribute({
    paddingTop: "24px",
    textAlign: "center",
    fontSize: "0.9rem"
  }, "style"), addAttribute({ margin: 0, marginBottom: "0.5rem" }, "style"), (/* @__PURE__ */ new Date()).getFullYear(), addAttribute({ margin: 0, fontSize: "0.8rem", opacity: 0.7 }, "style"), addAttribute({
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    color: "var(--bg)",
    border: "none",
    cursor: "pointer",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(255, 193, 7, 0.3)",
    transition: "all 0.3s ease",
    zIndex: 1e3
  }, "style"), renderScript($$result, "D:/web/coursespeak-astro/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"));
}, "D:/web/coursespeak-astro/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
