"use client";
import React, { useMemo } from "react";
import { renderMarkdownToHtml } from "../lib/markdown";
import ActionsPanel from "./ActionsPanel";
import RelatedList from "./RelatedList";

interface Deal {
    id: string;
    title: string;
    description: string;
    content?: string;
    image?: string;
    price?: number;
    originalPrice?: number;
    url?: string;
    category?: string;
    provider?: string;
    instructor?: string;
    rating?: number;
    students?: number;
    updatedAt?: string;
    duration?: string;
    coupon?: string;
    language?: string;
    learn?: string[];
    faqs?: { q: string; a: string }[];
}

export default function DealPage({ deal, relatedDeals = [] }: { deal: Deal, relatedDeals?: any[] }) {
    // Prefer content (detailed) over description (short)
    const bodyContent = deal.content || deal.description || "";
    const htmlContent = useMemo(() => renderMarkdownToHtml(bodyContent), [bodyContent]);

    const price = deal.price ?? 9.99;
    const originalPrice = deal.originalPrice ?? 119.99;
    const discountPct = originalPrice > price ? Math.round(100 - (price / originalPrice) * 100) : 0;

    return (
        <div style={{ background: "#0b0d12", color: "#e2e8f0", minHeight: "100vh" }}>
            {/* Breadcrumb / Intro Section (Not a full header) */}
            <div style={{ background: "#1f2330", padding: "2rem 0", color: "#fff", borderBottom: "1px solid #2d3748" }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", position: "relative" }}>
                    <div style={{ maxWidth: "700px" }}>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "1rem", fontSize: "14px", color: "#3b82f6", fontWeight: 600 }}>
                            <a href="/" style={{ color: "#a9b0c0", textDecoration: "none" }}>Home</a>
                            <span style={{ color: "#64748b" }}>/</span>
                            <a href="/deals" style={{ color: "#a9b0c0", textDecoration: "none" }}>Deals</a>
                            <span style={{ color: "#64748b" }}>/</span>
                            <span style={{ color: "#3b82f6" }}>{deal.category || "Course"}</span>
                        </div>

                        <h1 style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
                            {deal.title}
                        </h1>

                        <div style={{ fontSize: "1.1rem", lineHeight: 1.5, marginBottom: "1.5rem", color: "#cbd5e1" }}>
                            {deal.description}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "14px" }}>
                            {deal.rating && (
                                <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                                    {deal.rating.toFixed(1)} <span style={{ color: "#f59e0b" }}>★★★★★</span>
                                </span>
                            )}
                            {deal.students && (
                                <span>{deal.students.toLocaleString()} students</span>
                            )}
                            <span style={{ display: "flex", gap: "4px" }}>
                                Created by <span style={{ color: "#3b82f6", textDecoration: "underline" }}>{deal.instructor || deal.provider || "Instructor"}</span>
                            </span>
                            {deal.updatedAt && (
                                <span style={{ color: "#9ca3af" }}>Last updated {new Date(deal.updatedAt).toLocaleDateString()}</span>
                            )}
                            {deal.language && (
                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    🌐 {deal.language}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", position: "relative" }}>

                {/* Left Column */}
                <div style={{ minWidth: 0 }}>
                    {/* What you'll learn */}
                    {deal.learn && deal.learn.length > 0 && (
                        <div style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>What you'll learn</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", fontSize: "0.95rem", color: "#cbd5e1" }}>
                                {deal.learn.map((point, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                        <span style={{ color: "#a9b0c0", marginTop: "2px" }}>✓</span>
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Description</h2>
                        {/* Render Markdown Content */}
                        <div
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                            style={{ lineHeight: 1.7, color: "#cbd5e1" }}
                        />
                    </div>

                    {/* FAQs Section */}
                    {deal.faqs && deal.faqs.length > 0 && (
                        <div style={{ marginBottom: "2rem", borderTop: "1px solid #1f2330", paddingTop: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#fff" }}>Frequently Asked Questions</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {deal.faqs.map((faq, idx) => (
                                    <div key={idx}>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>
                                            {faq.q}
                                        </h3>
                                        <p style={{ color: "#cbd5e1", lineHeight: 1.6, fontSize: "0.95rem" }}>
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div style={{ marginBottom: "2rem", borderTop: "1px solid #1f2330", paddingTop: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#fff" }}>Student Feedback</h2>
                        {/* Rating Summary */}
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "4rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{deal.rating?.toFixed(1) || "4.8"}</div>
                                <div style={{ color: "#f59e0b", fontSize: "1.2rem", fontWeight: 700 }}>★★★★★</div>
                                <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Course Rating</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                {[5, 4, 3, 2, 1].map((star, i) => (
                                    <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                        <div style={{ width: "100%", height: "8px", background: "#2d3748", borderRadius: "4px", overflow: "hidden" }}>
                                            <div style={{ width: i === 0 ? "75%" : i === 1 ? "15%" : "5%", height: "100%", background: "#9ca3af" }}></div>
                                        </div>
                                        <div style={{ color: "#3b82f6", fontSize: "0.85rem", width: "30px" }}>{i === 0 ? "75%" : i === 1 ? "15%" : "5%"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Reviews List */}
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                            {[
                                { name: "Sarah J.", rating: 5, date: "2 weeks ago", text: "This course was absolutely amazing! The instructor explained everything clearly and the projects were very helpful." },
                                { name: "Michael T.", rating: 4.5, date: "1 month ago", text: "Great content, highly recommended for beginners. Just wish there were more practice exercises." },
                                { name: "David K.", rating: 5, date: "2 months ago", text: "Best course on this topic I've taken so far. Worth every penny (even better since I got it for free!)." }
                            ].map((review, idx) => (
                                <div key={idx} style={{ borderBottom: "1px solid #1f2330", paddingBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ color: "#fff", fontWeight: 600 }}>{review.name}</div>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <span style={{ color: "#f59e0b", fontSize: "12px" }}>{"★".repeat(Math.floor(review.rating))}</span>
                                                <span style={{ color: "#64748b", fontSize: "12px" }}>{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.5 }}>{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related List Section */}
                    {relatedDeals.length > 0 && (
                        <div style={{ marginTop: "4rem", borderTop: "1px solid #1f2330", paddingTop: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#fff" }}>
                                More Courses You Might Like
                            </h2>
                            <RelatedList items={relatedDeals} />
                        </div>
                    )}

                </div>

                {/* Right Column: Sticky Sidebar */}
                <div style={{ position: "relative" }}>
                    <div style={{ position: "sticky", top: "2rem", background: "#1f2330", border: "1px solid #2d3748", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)" }}>
                        {deal.image && (
                            <div style={{ position: "relative" }}>
                                <img src={deal.image} alt={deal.title} style={{ width: "100%", height: "190px", objectFit: "cover" }} />
                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)" }}></div>
                                {/* Play icon overlay simulation */}
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", borderRadius: "50%", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
                                    <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid #000", marginLeft: "4px" }}></div>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
                                    {price === 0 ? "Free" : `$${price}`}
                                </span>
                                {discountPct > 0 && (
                                    <span style={{ fontSize: "1.1rem", color: "#9ca3af", textDecoration: "line-through" }}>
                                        ${originalPrice}
                                    </span>
                                )}
                                {discountPct > 0 && (
                                    <span style={{ fontSize: "1rem", color: "#fff", padding: "4px 8px", background: "#ef4444", fontWeight: 600 }}>
                                        {discountPct}% Off
                                    </span>
                                )}
                            </div>
                            {discountPct > 0 && (
                                <div style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                                    <svg style={{ width: "16px", height: "16px", display: "inline", marginRight: "4px" }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                    <b>1 day</b> left at this price!
                                </div>
                            )}

                            <a
                                href={deal.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "block", textAlign: "center", background: "#a855f7", color: "#fff", fontWeight: 700, padding: "12px", fontSize: "1rem", border: "1px solid #9333ea", marginBottom: "12px", textDecoration: "none" }}
                            >
                                Get Deal
                            </a>

                            <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#9ca3af", marginBottom: "1.5rem" }}>30-Day Money-Back Guarantee</div>

                            <div style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
                                <div style={{ fontWeight: 700, marginBottom: "8px", color: "#fff" }}>This course includes:</div>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>📺</span> {deal.duration || "12 hours"} on-demand video</li>
                                    <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>📱</span> Access on mobile and TV</li>
                                    <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>♾️</span> Full lifetime access</li>
                                    <li style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span>🏆</span> Certificate of completion</li>
                                </ul>
                            </div>

                            <div style={{ borderTop: "1px solid #2d3748", marginTop: "1rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <a href="#" style={{ color: "#fff", fontWeight: 600, textDecoration: "underline", fontSize: "0.9rem" }}>Share</a>
                                <ActionsPanel deal={{ ...deal, url: deal.url || '' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
            .prose h1, .prose h2, .prose h3 { color: #fff; margin-top: 1.5em; margin-bottom: 0.5em; }
            .prose p { margin-bottom: 1em; }
            .prose ul, .prose ol { margin-bottom: 1em; padding-left: 1.5em; list-style: disc; }
            .prose li { margin-bottom: 0.5em; }
            .prose a { color: #3b82f6; text-decoration: underline; }
            @media (max-width: 900px) {
                .container { grid-template-columns: 1fr !important; }
            }
          `}
            </style>
        </div>
    );
}
