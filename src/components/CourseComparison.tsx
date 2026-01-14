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
};

interface CourseComparisonProps {
  currentDeal: Deal;
  similarDeals: Deal[];
}

export default function CourseComparison({ currentDeal, similarDeals }: CourseComparisonProps) {
  if (!similarDeals || similarDeals.length === 0) return null;

  const dealsToCompare = [currentDeal, ...similarDeals.slice(0, 2)]; // Current + 2 similar

  const formatPrice = (price?: number) => price ? `${price.toFixed(2)}` : "$9.99";
  const formatRating = (rating?: number) => rating ? rating.toFixed(1) : "4.7";

  return (
    <div style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>

      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: 0, marginBottom: "0.5rem" }}>Compare Similar Courses</h2>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af", background: "#1f2937", padding: "3px 6px", borderRadius: "8px", border: "1px solid #374151", fontWeight: 500 }}>Price Comparison</span>
      </div>

      <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1.5rem" }}>
        This section allows you to compare the current course with similar options to help you make an informed decision by evaluating prices, ratings, and key features side by side.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${dealsToCompare.length}, 1fr)`, gap: "1rem", marginBottom: "1.5rem" }}>
        {dealsToCompare.map((deal, index) => (
          <div key={deal.id} style={{
            background: "linear-gradient(135deg, rgba(31, 41, 55, 0.5) 0%, rgba(17, 24, 39, 0.5) 100%)",
            border: index === 0 ? "2px solid #8b5cf6" : "1px solid rgba(75, 85, 99, 0.3)",
            borderRadius: "8px",
            padding: "1.5rem",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: "default",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = index === 0 ? "0 8px 25px rgba(139, 92, 246, 0.3)" : "0 8px 25px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            {index === 0 && (
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)"
              }}></div>
            )}

            {index === 0 && (
              <div style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "#8b5cf6",
                color: "#0b0d12",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.6rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                ⭐ Current
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                {deal.provider}
              </div>
              <h3 style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "0.75rem",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "4rem" // Ensure consistent height
              }}>
                {deal.title}
              </h3>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <span style={{ color: "#f59e0b", fontSize: "0.9rem" }}>⭐</span>
                <span style={{ color: "#f59e0b", fontSize: "0.9rem", fontWeight: 600 }}>{formatRating(deal.rating)}</span>
              </div>
              {deal.students && (
                <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                  👥 {deal.students.toLocaleString()}
                </span>
              )}
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold" }}>
                  {formatPrice(deal.price)}
                </span>
                {deal.originalPrice && deal.originalPrice > deal.price! && (
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem", textDecoration: "line-through" }}>
                    {formatPrice(deal.originalPrice)}
                  </span>
                )}
              </div>
              {deal.originalPrice && deal.originalPrice > deal.price! && (
                <div style={{
                  display: "inline-block",
                  background: "#ef4444",
                  color: "#0b0d12",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  marginTop: "4px"
                }}>
                  {Math.round(100 - (deal.price! / deal.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Duration */}
            {deal.duration && (
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>📅</span>
                <span>{deal.duration}</span>
              </div>
            )}

            {/* CTA Button */}
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                width: "100%",
                padding: "8px 16px",
                background: index === 0 ? "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)" : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "600",
                textAlign: "center",
                transition: "all 0.3s ease",
                border: index === 0 ? "1px solid #7c3aed" : "1px solid #374151"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = index === 0 ? "0 4px 12px rgba(139, 92, 246, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {index === 0 ? "🎯 Current Deal" : "🔍 View Deal"}
            </a>
          </div>
        ))}
      </div>



      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
          Compare prices and features to find the best deal for your learning needs
        </p>
      </div>
    </div>
  );
}