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
}

function fmtPrice(p?: number): string {
  if (p == null || p < 0) return "$9.99";
  return `$${p.toFixed(2)}`;
}

function fmtRating(r?: number): string {
  if (r == null || !isFinite(r)) return "4.7";
  return r.toFixed(1);
}

function fmtStudents(s?: number): string {
  if (s == null || !isFinite(s)) return "12.3k";
  if (s >= 1e6) return `${(s / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (s >= 1e3) return `${(s / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
  return s.toString();
}

function discount(p?: number, o?: number): number {
  if (!p || !o || o <= p) return 0;
  return Math.round(100 - (p / o) * 100);
}

export default function CourseComparison({ currentDeal, similarDeals }: CourseComparisonProps) {
  if (!similarDeals || similarDeals.length === 0) return null;

  const deals = [currentDeal, ...similarDeals.slice(0, 3)];

  const rows: { label: string; render: (d: Deal, i: number) => React.ReactNode }[] = [
    {
      label: "Provider",
      render: (d) => <span style={{ color: "var(--muted)" }}>{d.provider || "Udemy"}</span>,
    },
    {
      label: "Price",
      render: (d) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
          <span style={{ fontWeight: 700, color: d.price === 0 ? "#22c55e" : "#fff", fontSize: "1.05rem" }}>
            {d.price === 0 ? "FREE" : fmtPrice(d.price)}
          </span>
          {d.originalPrice && d.price && d.originalPrice > d.price && (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--muted)", fontSize: "0.8rem" }}>
                {fmtPrice(d.originalPrice)}
              </span>
              <span style={{ background: "var(--brand)", color: "#080b12", padding: "1px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700 }}>
                -{discount(d.price, d.originalPrice)}%
              </span>
            </>
          )}
        </div>
      ),
    },
    {
      label: "Rating",
      render: (d) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--brand)">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span style={{ color: "var(--brand)", fontWeight: 600 }}>{fmtRating(d.rating)}</span>
          <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>({fmtStudents(d.students)})</span>
        </div>
      ),
    },
    {
      label: "Duration",
      render: (d) => <span style={{ color: "var(--muted)" }}>{d.duration || "—"}</span>,
    },
    {
      label: "Coupon",
      render: (d) =>
        d.coupon ? (
          <code style={{ background: "var(--border)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", color: "var(--brand)", letterSpacing: "0.5px" }}>
            {d.coupon.length > 6 ? `${d.coupon.slice(0, 6)}...` : d.coupon}
          </code>
        ) : (
          <span style={{ color: "var(--muted)" }}>—</span>
        ),
    },
  ];

  return (
    <section style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true" />
        Course Comparison
      </h2>
      <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
        Compare features side by side to find the best course for your needs.
      </p>

      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr>
              <th style={{ padding: "1rem 1.25rem", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", width: "120px" }}>
                Feature
              </th>
              {deals.map((d, i) => (
                <th key={d.id} style={{
                  padding: "1rem 1.25rem",
                  textAlign: "center",
                  borderBottom: "1px solid var(--border)",
                  background: i === 0 ? "rgba(212, 167, 55, 0.04)" : "transparent",
                  minWidth: "180px",
                }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: i === 0 ? "var(--brand)" : "#fff", marginBottom: "2px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.3 }}>
                    <a href={`/deal/${d.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {d.title}
                    </a>
                  </div>
                  {i === 0 && (
                    <span style={{ display: "inline-block", marginTop: "4px", background: "var(--brand)", color: "#080b12", padding: "1px 8px", borderRadius: "10px", fontSize: "0.65rem", fontWeight: 700 }}>
                      CURRENT
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} style={{ borderBottom: ri < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
                <td style={{ padding: "0.85rem 1.25rem", color: "var(--muted)", fontSize: "0.85rem", fontWeight: 500 }}>
                  {row.label}
                </td>
                {deals.map((d, i) => (
                  <td key={d.id} style={{
                    padding: "0.85rem 1.25rem",
                    textAlign: "center",
                    background: i === 0 ? "rgba(212, 167, 55, 0.02)" : "transparent",
                  }}>
                    {row.render(d, i)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ padding: "0.85rem 1.25rem" }} />
              {deals.map((d, i) => (
                <td key={d.id} style={{
                  padding: "1rem 1.25rem",
                  textAlign: "center",
                  background: i === 0 ? "rgba(212, 167, 55, 0.04)" : "transparent",
                }}>
                  <a
                    href={d.url || `/deal/${d.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "0.55rem 1.25rem",
                      background: i === 0 ? "rgba(212, 167, 55, 0.15)" : "var(--brand)",
                      color: i === 0 ? "var(--brand)" : "#fff",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: i === 0 ? "1px solid rgba(212, 167, 55, 0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {i === 0 ? "View Deal" : "Compare"}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
