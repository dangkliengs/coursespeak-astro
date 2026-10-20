"use client";

import React from "react";

type Deal = {
  id: string;
  title: string;
  provider?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  students?: number;
  duration?: string;
  url?: string;
  coupon?: string;
  expiresAt?: string;
  image?: string;
  category?: string;
  updatedAt?: string;
};

interface CourseComparisonProps {
  currentDeal: Deal;
  similarDeals: Deal[];
};

function fmtPrice(p?: number): string {
  if (p == null || p < 0) return "Check price";
  return `$${p.toFixed(2)}`;
}

function discount(p?: number, o?: number): number {
  if (!p || !o || o <= p) return 0;
  return Math.round(100 - (p / o) * 100);
}

export default function CourseComparison({ currentDeal, similarDeals }: CourseComparisonProps) {
  if (!similarDeals || similarDeals.length === 0) return null;

  const deals = [currentDeal, ...similarDeals.slice(0, 3)];

  return (
    <section style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true" />
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: 0 }}>Course Comparison</h2>
      </div>
      <p style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: "2rem" }}>
        Compare {deals.length} Udemy courses side by side — rating, price, duration, and active coupon.
      </p>

      <div style={{ borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden", background: "var(--bg)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>
                Course
              </th>
              <th style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                Rating
              </th>
              <th style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                Price
              </th>
              <th style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                Duration
              </th>
              <th style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>
                Why pick this one
              </th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: i < deals.length - 1 ? "1px solid var(--border)" : "none", background: i === 0 ? "rgba(212, 167, 55, 0.06)" : "var(--bg)" }}>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.95rem", fontWeight: 600, color: i === 0 ? "var(--brand)" : "#fff", verticalAlign: "middle", lineHeight: 1.4 }}>
                  <a href={`/deal/${d.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {d.title}
                    {i === 0 && <span style={{ marginLeft: "6px", fontSize: "0.75rem", fontWeight: 700, color: "var(--brand)" }}>This</span>}
                  </a>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "1rem", fontWeight: 800, color: "#fff", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  {d.rating ? d.rating.toFixed(1) : "—"}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", color: d.price === 0 ? "#22c55e" : "#fff", fontWeight: 600, verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  <div style={{ fontWeight: 700 }}>{d.price === 0 ? "FREE" : fmtPrice(d.price)}</div>
                  {d.originalPrice && d.price && d.originalPrice > d.price && (
                    <>
                      <div style={{ fontSize: "0.75rem", textDecoration: "line-through", color: "var(--muted)", fontWeight: 500, marginTop: "2px" }}>
                        ${d.originalPrice.toFixed(2)}
                      </div>
                      <div style={{ display: "inline-block", fontSize: "0.75rem", background: "var(--brand)", color: "#080b12", padding: "2px 8px", borderRadius: "4px", fontWeight: 800, marginTop: "2px" }}>
                        -{discount(d.price, d.originalPrice)}%
                      </div>
                    </>
                  )}
                  {d.price == null && <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>Check price</span>}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--muted)", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  {d.duration || "—"}
                </td>
                <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                    {i === 0 ? "Most popular" : "Best alternative"} · {d.category || "Course"}
                  </div>
                  <a
                    href={d.url || `/deal/${d.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      background: i === 0 ? "rgba(212, 167, 55, 0.15)" : "var(--brand)",
                      color: i === 0 ? "var(--brand)" : "#080b12",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      border: i === 0 ? "1px solid rgba(212, 167, 55, 0.3)" : "none",
                    }}
                  >
                    {i === 0 ? "View Deal" : "View"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
