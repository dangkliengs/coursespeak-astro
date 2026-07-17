"use client";

import { useState, useEffect } from "react";

export default function HeaderSearch() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  
  const searchTerms = [
    "JavaScript",
    "Python", 
    "React",
    "Web development",
    "100 days of code",
    "TypeScript",
    "Node.js",
    "Machine learning"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % searchTerms.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <form
      action="/search"
      method="get"
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <input
        type="search"
        name="q"
        placeholder={`${searchTerms[currentPlaceholder]}...`}
        aria-label="Search courses"
        style={{
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid var(--brand-soft)",
          background: "rgba(15, 14, 12, 0.8)",
          color: "var(--text)",
          minWidth: 180,
          transition: "all 0.3s ease",
          boxShadow: "0 0 0 0 transparent",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--brand)";
          e.target.style.boxShadow = "0 0 0 2px var(--brand-soft)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--brand-soft)";
          e.target.style.boxShadow = "0 0 0 0 transparent";
        }}
      />
      <button
        type="submit"
        className="pill"
        style={{ 
          padding: "6px 14px",
          background: "linear-gradient(135deg, var(--brand), var(--brand-hover))",
          border: "1px solid var(--brand)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #C5A028, #B8860B)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, var(--brand), var(--brand-hover))";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <span style={{ color: "var(--bg)", fontWeight: 600 }}>Search</span>
      </button>
    </form>
  );
}
