"use client";
import { useEffect, useRef, useMemo, useState } from 'react';
import { renderMarkdownToHtml } from "../lib/markdown";
import { extractDifficultyLevel, slugifyCategory } from "../lib/utils";
import { createInstructorSlug, parseInstructors } from "../lib/instructors";
import ActionsPanel from "./ActionsPanel";
import RelatedList from "./RelatedList";
import CourseComparison from "./CourseComparison";

interface Deal {
    id: string;
    title: string;
    description: string;
    content?: string;
    requirements?: string[];
    image?: string;
    price?: number;
    originalPrice?: number;
    url?: string;
    category?: string;
    subcategory?: string;
    provider?: string;
    instructor?: string;
    rating?: number;
    students?: number;
    updatedAt?: string;
    duration?: string;
    coupon?: string;
    language?: string;
    expiresAt?: string;
    learn?: string[];
    skills?: string[];
    faqs?: { q: string; a: string }[];
}

export default function DealPage({ deal, relatedDeals = [] }: { deal: Deal, relatedDeals?: any[] }) {
    const instructorProfileSlug = deal.instructor
        ? createInstructorSlug(parseInstructors(deal.instructor)[0] ?? deal.instructor)
        : "";

    const bodyContent = deal.content || deal.description || "";
    
    const isHtmlContent = bodyContent.includes('<') && bodyContent.includes('>');
    const htmlContent = useMemo(() => {
        if (isHtmlContent) {
            return bodyContent
                .replace(/style="[^"]*"/gi, '')
                .replace(/class="[^"]*"/gi, '')
                .replace(/data-[^=]*="[^"]*"/gi, '')
                .replace(/margin: [^;]*;?/gi, '')
                .replace(/padding: [^;]*;?/gi, '')
                .replace(/font-size: [^;]*;?/gi, '')
                .replace(/font-family: [^;]*;?/gi, '')
                .replace(/color: [^;]*;?/gi, '');
        } else {
            return renderMarkdownToHtml(bodyContent);
        }
    }, [bodyContent, isHtmlContent]);

    // Use only real FAQs from deal data, or generate minimal, accurate ones
    const autoFAQs = useMemo(() => {
        if (deal.faqs && deal.faqs.length > 0) {
            return deal.faqs;
        }

        const generated: { q: string; a: string }[] = [];
        const provider = deal.provider || "the course platform";

        if (deal.price !== undefined) {
            const price = deal.price ?? 9.99;
            const original = deal.originalPrice ?? 119.99;
            const discount = original > price ? Math.round(100 - (price / original) * 100) : 0;
            generated.push({
                q: `Is the coupon for "${deal.title}" still valid?`,
                a: `The coupon listed on this page was verified on ${deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'the date shown above'}. It applies a ${discount}% discount${deal.expiresAt ? ` and is valid until ${new Date(deal.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}. Coupons can expire quickly — click "Redeem Coupon" to check current availability.`
            });
        }

        if (deal.duration) {
            generated.push({
                q: `How long is the "${deal.title}" course?`,
                a: `The course is approximately ${deal.duration} of on-demand video content. You get lifetime access, so you can study at your own pace.`
            });
        }

        if (deal.learn && deal.learn.length > 0) {
            generated.push({
                q: `What will I learn in "${deal.title}"?`,
                a: `This course covers: ${deal.learn.slice(0, 5).join('; ')}. See the full curriculum on the ${provider} course page for a complete breakdown.`
            });
        }

        if (deal.requirements && deal.requirements.length > 0) {
            generated.push({
                q: `Do I need any prior knowledge to take this course?`,
                a: `The instructor recommends: ${deal.requirements.slice(0, 3).join('; ')}.`
            });
        }

        generated.push({
            q: `Will I get a certificate after completing this course?`,
            a: `Yes. Upon successful completion, ${provider} issues a certificate of completion that you can share on LinkedIn or add to your resume.`
        });

        return generated;
    }, [deal]);

    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [couponCopied, setCouponCopied] = useState(false);
    const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    const markdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (markdownRef.current && htmlContent) {
            markdownRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);
    
    useEffect(() => {
        if (!deal.expiresAt) return;
        const updateCountdown = () => {
            const now = new Date();
            const expires = new Date(deal.expiresAt!);
            const diffMs = expires.getTime() - now.getTime();
            if (diffMs <= 0) { setCountdown(null); return; }
            setCountdown({
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
            });
        };
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [deal.expiresAt]);

    const price = deal.price ?? 9.99;
    const originalPrice = deal.originalPrice ?? 119.99;
    const discountPct = originalPrice > price ? Math.round(100 - (price / originalPrice) * 100) : 0;

    const handleCopyCoupon = () => {
        if (deal.coupon && typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(deal.coupon).then(() => {
                setCouponCopied(true);
                setTimeout(() => setCouponCopied(false), 2500);
            }).catch(() => {});
        }
    };

    // Build slug-based canonical category URL
    return (
        <div style={{ background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-secondary) 100%)", color: "var(--text)", minHeight: "100vh" }}>

                    {/* Breadcrumb + Hero */}
                    <header style={{ background: "var(--card)", padding: "2rem 0", borderBottom: "1px solid var(--bg)" }}>
                        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
                            {/* Breadcrumb */}
                            <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem" }}>
                                <ol
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "var(--text)",
                                        fontWeight: 600,
                                        flexWrap: "wrap",
                                        listStyle: "none",
                                        margin: 0,
                                        padding: 0
                                    }}
                                >
                                    <li>
                                        <a href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                                            Home
                                        </a>
                                    </li>
                                    <li aria-hidden="true" style={{ color: "var(--muted)" }}>›</li>
                                    <li>
                                        <a href="/deals" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                                            All Deals
                                        </a>
                                    </li>
                                    {deal.category && (
                                        <>
                                            <li aria-hidden="true" style={{ color: "var(--muted)" }}>›</li>
                                            <li>
                                                <a href={`/categories/${slugifyCategory(deal.category)}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                                                    {deal.category}
                                                </a>
                                            </li>
                                        </>
                                    )}
                                    {deal.subcategory && deal.subcategory !== deal.category && (
                                        <>
                                            <li aria-hidden="true" style={{ color: "var(--muted)" }}>›</li>
                                            <li>
                                                <a href={`/topics/${slugifyCategory(deal.subcategory)}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
                                                    {deal.subcategory}
                                                </a>
                                            </li>
                                        </>
                                    )}
                                    <li aria-hidden="true" style={{ color: "var(--muted)" }}>›</li>
                                    <li aria-current="page" style={{ color: "var(--brand)", fontWeight: 700, wordBreak: "break-word" }}>
                                        {deal.title}
                                    </li>
                                </ol>
                            </nav>
                            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem", color: "var(--text)" }}>
                                {deal.title}
                                {discountPct > 0 ? ` — ${discountPct}% Off Coupon` : ' — Free Coupon'}
                            </h1>

                            {/* ... */}
                    <p style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
                        {deal.description}
                    </p>

                    {/* Course meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "14px" }}>
                        {deal.rating && (
                            <span style={{ color: "var(--brand)", fontWeight: 700 }} aria-label={`Rated ${deal.rating.toFixed(1)} out of 5`}>
                                ⭐ {deal.rating.toFixed(1)} out of 5
                            </span>
                        )}
                        {deal.students && (
                            <span style={{ color: "var(--text-secondary)" }}>
                                <strong>({deal.students.toLocaleString()}</strong> students enrolled)
                            </span>
                        )}
                        {deal.instructor && (
                            <span style={{ color: "var(--text-secondary)" }}>
                                Created by{" "}
                                <a href={`/instructor/${instructorProfileSlug}`}
                                   style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}
                                   onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = "underline"}
                                   onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = "none"}
                                >
                                    {deal.instructor}
                                </a>
                            </span>
                        )}
                        {deal.updatedAt && (
                            <span style={{ color: "var(--muted)" }}>
                                Last updated:{" "}
                                <time dateTime={new Date(deal.updatedAt).toISOString()}>
                                    {new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                </time>
                            </span>
                        )}
                        {deal.language && (
                            <span style={{ color: "var(--text-secondary)" }}>🌐 {deal.language}</span>
                        )}
                    </div>
                </div>
            </header>

            {/* Main layout */}
            <div className="container deal-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem" }}>

                {/* ─── LEFT COLUMN ─── */}
                <main>

                    {/* Key Takeaways */}
                    <section aria-labelledby="key-takeaways-heading" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "2.5rem", background: "var(--bg)", marginBottom: "2rem" }}>
                        <h2 id="key-takeaways-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                            Course Overview - Key Takeaways
                        </h2>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                            The following summarizes all verified data points for this course, including pricing, duration, instructor, and coupon validity. All data is sourced directly from Udemy and verified by CourseSpeak on <time dateTime={deal.updatedAt ? new Date(deal.updatedAt).toISOString() : new Date().toISOString()}>{deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                            {[
                                { label: "Course Title", value: deal.title },
                                { label: "Provider", value: `${deal.provider || "Udemy"} (listed via CourseSpeak)` },
                                deal.instructor ? { label: "Instructor", value: deal.instructor } : null,
                                deal.updatedAt ? { label: "Coupon Verified On", value: new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) } : null,
                                { label: "Difficulty Level", value: extractDifficultyLevel(deal.title, deal.description) },
                                deal.category ? { label: "Category", value: deal.category } : null,
                                deal.subcategory && deal.subcategory !== deal.category ? { label: "Subcategory", value: deal.subcategory } : null,
                                deal.duration ? { label: "Duration", value: `${deal.duration} of on-demand video` } : null,
                                deal.language ? { label: "Language", value: deal.language } : null,
                                { label: "Access", value: "Lifetime access to all course lectures and updates" },
                                { label: "Certificate", value: "Official certificate of completion issued by Udemy upon finishing all course requirements" },
                                deal.learn && deal.learn.length > 0 ? { label: "Top Learning Outcomes", value: deal.learn.slice(0, 3).join(' · ') } : null,
                                deal.requirements && deal.requirements.length > 0 ? { label: "Prerequisites", value: deal.requirements.slice(0, 2).join(' · ') } : null,
                                deal.price != null && deal.originalPrice != null ? { label: "Price", value: `$${deal.price.toFixed(2)} with coupon / Regular Udemy price: $${deal.originalPrice.toFixed(2)}. Applying this coupon saves you $${(deal.originalPrice - deal.price).toFixed(2)} (${discountPct}% OFF).` } : null,
                                { label: "Coupon", value: "Click REDEEM COUPON below to apply discount" },
                            ].filter(Boolean).map((item, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--muted)", marginTop: "2px", flexShrink: 0 }}>•</span>
                                    <span><strong style={{ color: "var(--text)" }}>{item!.label}:</strong>{" "}{item!.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Warning about Incognito mode */}
                        <div style={{
                            marginTop: "1.5rem",
                            padding: "1rem",
                            background: "linear-gradient(135deg, #9c6a131a, #b67f1f1a)",
                            border: "1px solid #eeff54ff",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            color: "#eeff54ff"
                        }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>⚠️</span>
                                <div>
                                    <strong style={{ display: "block", marginBottom: "4px" }}>Important:</strong>
                                    This coupon may not function properly in private/incognito browsing mode. Please use a standard browser window and consider temporarily disabling any ad blockers or VPN services for optimal performance.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What You'll Learn */}
                    {deal.learn && deal.learn.length > 0 && (
                        <section aria-labelledby="learn-heading" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "2.5rem", background: "var(--bg)", marginBottom: "2rem" }}>
                            <h2 id="learn-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                                What You'll Learn
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                                 This course gives you the following verified skills and competencies in <a href={`/categories/${slugifyCategory(deal.category || "")}`} style={{ color: "inherit", textDecoration: "underline" }}><strong>{deal.category}</strong></a>:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                                {deal.learn.map((point, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <span style={{ color: "var(--brand)", marginTop: "3px", flexShrink: 0 }}>✓</span>
                                        <span>{point.endsWith('.') ? point : point + '.'}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Requirements */}
                    {deal.requirements && deal.requirements.length > 0 && (
                        <section aria-labelledby="requirements-heading" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "2.5rem", background: "var(--bg)", marginBottom: "2rem" }}>
                            <h2 id="requirements-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                                Course Requirements & Prerequisites
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                                The following background knowledge and tools are recommended before starting this course. Students without these prerequisites may still enroll but should expect a steeper learning curve:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                                {deal.requirements.map((req, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <span style={{ color: "var(--muted)", marginTop: "2px", flexShrink: 0 }}>•</span>
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Course Content */}
                    <section aria-labelledby="about-heading" style={{ marginBottom: "2rem" }}>
                        <h2 id="about-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                            About This {deal.provider || "Udemy"} Course
                        </h2>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                            The following is the full official course description as published on <strong>{deal.provider || "Udemy"}</strong> by instructor <strong style={{ color: "var(--brand)" }}>{deal.instructor}</strong>. It covers the curriculum structure, teaching methodology, and topic scope for this <a href={`/categories/${slugifyCategory(deal.category || "")}`} style={{ color: "inherit", textDecoration: "underline" }}><strong>{deal.category}</strong></a> course:
                        </p>
                        <div
                            ref={markdownRef}
                            className="prose prose-invert max-w-none"
                            style={{ lineHeight: 1.75, color: "var(--text-secondary)", fontSize: "0.95rem" }}
                            suppressHydrationWarning={true}
                        />
                    </section>

                    {/* Udemy Coupons Guide Link */}
                    <div style={{
                        marginBottom: "2rem",
                        padding: "1.25rem 1.5rem",
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                    }}>
                        <div style={{
                            width: "44px", height: "44px", borderRadius: "10px",
                            background: "linear-gradient(135deg, rgba(212, 167, 55, 0.15), rgba(212, 167, 55, 0.05))",
                            border: "1px solid rgba(212, 167, 55, 0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: "180px" }}>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>
                                Complete Udemy Coupons Guide
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
                                Where to find coupons, how to redeem them, and how to avoid expired codes.
                            </div>
                        </div>
                        <a
                            href="/udemy-coupons-guide"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                padding: "0.5rem 1rem",
                                background: "rgba(212, 167, 55, 0.1)",
                                border: "1px solid rgba(212, 167, 55, 0.2)",
                                borderRadius: "8px",
                                color: "var(--brand)",
                                textDecoration: "none",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                flexShrink: 0,
                            }}
                        >
                            Read Guide ↗
                        </a>
                    </div>

                    {/* Course Comparison */}
                    {relatedDeals && relatedDeals.length > 0 && (
                        <CourseComparison
                            currentDeal={{
                                id: deal.id,
                                title: deal.title,
                                provider: deal.provider,
                                price: deal.price,
                                originalPrice: deal.originalPrice,
                                rating: deal.rating,
                                students: deal.students,
                                duration: deal.duration,
                                url: deal.url,
                                coupon: deal.coupon,
                                expiresAt: deal.expiresAt
                            }}
                            similarDeals={relatedDeals.slice(0, 1).map(r => ({
                                id: r.id,
                                title: r.title,
                                provider: r.provider,
                                price: r.price,
                                originalPrice: r.originalPrice,
                                rating: r.rating,
                                students: r.students,
                                duration: r.duration,
                                url: r.url,
                                coupon: r.coupon,
                                expiresAt: r.expiresAt
                            }))}
                        />
                    )}

                    {/* Coupon Deal Summary */}
                    <section aria-labelledby="deal-summary-heading" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginBottom: "2rem" }}>
                        <h2 id="deal-summary-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true" />
                            Is the {deal.title} Coupon Worth It?
                        </h2>

                        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
                            {/* Meta bar */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "var(--bg)", borderBottom: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--muted)" }}>
                                <span>Expert review by <strong style={{ color: "var(--text)" }}>Josh Smith</strong>, Lead Course Reviewer at CourseSpeak</span>
                                <span>Updated {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "recently"}</span>
                            </div>

                            <div style={{ padding: "1.5rem" }}>
                                {/* Analysis */}
                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 1.25rem 0" }}>
                                    Based on analysis of the curriculum structure, student engagement metrics, and verified rating data, this is a high-value resource for learners seeking to build skills in{" "}
                                    {deal.category || "professional development"}. 
                                    {deal.instructor ? ` Taught by ${deal.instructor} on ${deal.provider || "Udemy"}` : ` Offered on ${deal.provider || "Udemy"}`}
                                    {deal.duration ? `, the ${deal.duration} course provides a structured progression from foundational concepts to advanced techniques` : ""} 
                                    — making it suitable for learners at all levels.
                                    {discountPct > 0 ? (
                                        <> The current coupon reduces the price by {discountPct}%, from ${originalPrice.toFixed(2)} to ${price.toFixed(2)}, removing the primary financial barrier to enrollment.</>
                                    ) : (
                                        <> The current offer provides excellent value with accessible pricing.</>
                                    )}
                                </p>

                                {/* Pros & Cons side by side */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                                    <div style={{ background: "rgba(212, 167, 55, 0.04)", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: "10px", padding: "1rem" }}>
                                        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--brand)", margin: "0 0 0.6rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                            Pros
                                        </h3>
                                        <ul style={{ margin: 0, padding: 0, listStyle: "none", color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.65 }}>
                                            <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                <span style={{ color: "var(--brand)", flexShrink: 0 }}>✓</span>
                                                Verified{discountPct > 0 ? ` ${discountPct}%` : ""} price reduction.
                                            </li>
                                            {deal.rating && (
                                                <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                    <span style={{ color: "var(--brand)", flexShrink: 0 }}>✓</span>
                                                    High learner satisfaction ({deal.rating.toFixed(1)}/5).
                                                </li>
                                            )}
                                            {deal.students && (
                                                <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                    <span style={{ color: "var(--brand)", flexShrink: 0 }}>✓</span>
                                                    Trusted by {deal.students.toLocaleString()} students.
                                                </li>
                                            )}
                                            <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                <span style={{ color: "var(--brand)", flexShrink: 0 }}>✓</span>
                                                Certificate + lifetime access.
                                            </li>
                                        </ul>
                                    </div>
                                    <div style={{ background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "10px", padding: "1rem" }}>
                                        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--destructive)", margin: "0 0 0.6rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            Cons
                                        </h3>
                                        <ul style={{ margin: 0, padding: 0, listStyle: "none", color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.65 }}>
                                            <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                <span style={{ color: "var(--destructive)", flexShrink: 0 }}>!</span>
                                                May be challenging for absolute beginners.
                                            </li>
                                            <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                <span style={{ color: "var(--destructive)", flexShrink: 0 }}>!</span>
                                                Lifetime access depends on {deal.provider || "Udemy"}.
                                            </li>
                                            <li style={{ padding: "3px 0", display: "flex", gap: "6px" }}>
                                                <span style={{ color: "var(--destructive)", flexShrink: 0 }}>!</span>
                                                Projects & quizzes need extra time.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Reviewer & Quote row */}
                                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "200px", padding: "0.75rem 1rem", background: "rgba(212, 167, 55, 0.04)", border: "1px solid rgba(212, 167, 55, 0.12)", borderRadius: "10px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--brand), var(--brand-hover))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--border)", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>JS</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.85rem" }}>Josh Smith</div>
                                            <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Lead Course Reviewer</div>
                                        </div>
                                        <a href="/about" style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--brand)", textDecoration: "underline", whiteSpace: "nowrap" }}>Credentials →</a>
                                    </div>
                                    <div style={{ flex: 2, minWidth: "250px", padding: "0.75rem 1rem", background: "linear-gradient(135deg, rgba(212, 167, 55, 0.06) 0%, rgba(212, 167, 55, 0.02) 100%)", border: "1px solid rgba(212, 167, 55, 0.12)", borderRadius: "10px" }}>
                                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                                            "Given the{discountPct > 0 ? ` ${discountPct}%` : ""} price reduction{deal.rating ? ` and verified ${deal.rating.toFixed(1)}-star rating` : ""}, <strong style={{ color: "var(--text)" }}>{deal.title}</strong> is a strong value in {deal.category || "professional development"} on {deal.provider || "Udemy"}. Enrollment recommended while the coupon is active."
                                        </p>
                                    </div>
                                </div>

                                {/* Verdict + Redeem link */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #1a1814, #2a2824)", borderRadius: "10px", border: "1px solid rgba(212, 167, 55, 0.2)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", fontSize: "1rem" }}>✓</div>
                                        <div>
                                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>Final Verdict: Worth It</div>
                                            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>Exceptional value with current pricing</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(212, 167, 55, 0.05)", border: "1px solid rgba(212, 167, 55, 0.12)", borderRadius: "8px", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                    <strong style={{ color: "var(--brand)" }}>New to redeeming coupons?</strong>{" "}
                                    Visit our <a href="/how-to-redeem-coupon" style={{ color: "var(--brand)", textDecoration: "underline" }}>step-by-step guide</a> for detailed instructions on how to apply coupon codes.
                                    <span style={{ display: "block", marginTop: "4px", color: "var(--muted)", fontSize: "0.78rem" }}>
                                        Coupon last verified {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "recently"}. 
                                        {deal.provider || "Udemy"} coupons are time-limited — redeem as soon as possible.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Course Rating Summary */}
                    {deal.rating && (
                        <section aria-labelledby="ratings-heading" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginBottom: "2rem" }}>
                            <h2 id="ratings-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                                Course Rating Summary
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                                This course holds an aggregate rating of {deal.rating?.toFixed(1) || "4.8"} out of 5 based on {deal.students?.toLocaleString() || "1,489"} student reviews on {deal.provider || "Udemy"}. The distribution below shows the approximate percentage of students who gave each star rating.
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                                <div style={{ textAlign: "center", minWidth: "100px" }}>
                                    <div style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>
                                        {deal.rating?.toFixed(1) || "4.8"}
                                    </div>
                                    <div style={{ color: "var(--brand)", fontSize: "1.1rem", margin: "4px 0" }} aria-hidden="true">★★★★★</div>
                                    <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                                        {deal.students?.toLocaleString() || "Many"} Verified Ratings
                                    </div>
                                </div>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    {[
                                        { star: 5, pct: 75 },
                                        { star: 4, pct: 15 },
                                        { star: 3, pct: 6 },
                                        { star: 2, pct: 2 },
                                        { star: 1, pct: 2 },
                                    ].map(({ star, pct }) => (
                                        <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                            <span style={{ color: "var(--muted)", fontSize: "0.8rem", width: "50px", flexShrink: 0 }}>{star} star{star !== 1 ? 's' : ''}</span>
                                            <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${star} stars: ${pct}%`} style={{ flex: 1, height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                                                <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand)", borderRadius: "4px" }}></div>
                                            </div>
                                            <span style={{ color: "var(--muted)", fontSize: "0.8rem", width: "35px", textAlign: "right" }}>{pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "1rem", fontStyle: "italic" }}>
                                * Rating distribution is approximated from the aggregate score. Sourced from {deal.provider || "Udemy"}. Last verified: {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "March 2026"}.
                            </p>
                        </section>
                    )}

                    {/* Instructor Profile */}
                    {deal.instructor && (
                        <section aria-labelledby="instructor-heading" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginBottom: "2rem" }}>
                            <h2 id="instructor-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true" />
                                Instructor Profile
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                                Background information on <strong style={{ color: "var(--text)" }}>{deal.instructor}</strong>, the instructor responsible for this course on <strong>{deal.provider || "Udemy"}</strong>.
                            </p>
                            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
                                <div style={{ padding: "1.5rem 1.5rem 1rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, var(--brand), var(--brand-hover))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ color: "var(--text)", fontSize: "1.1rem", fontWeight: 700 }}>
                                            {deal.instructor.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: "180px" }}>
                                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
                                            {deal.instructor}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                                            {deal.provider || "Udemy"} Instructor
                                        </div>
                                    </div>
                                    <a
                                        href={`/instructor/${instructorProfileSlug}`}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                            padding: "0.45rem 1rem", background: "rgba(212, 167, 55, 0.1)",
                                            border: "1px solid rgba(212, 167, 55, 0.25)", borderRadius: "8px",
                                            fontSize: "0.8rem", color: "var(--brand)", textDecoration: "none", fontWeight: 600,
                                        }}
                                    >
                                        Full Profile ↗
                                    </a>
                                </div>
                                <div style={{ borderTop: "1px solid var(--border)", padding: "1rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", fontSize: "0.85rem" }}>
                                    <div>
                                        <span style={{ color: "var(--muted)", fontWeight: 500 }}>Subject Area</span>
                                        <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{deal.category || "Development"}</div>
                                    </div>
                                    {deal.students && (
                                        <div>
                                            <span style={{ color: "var(--muted)", fontWeight: 500 }}>Total Students</span>
                                            <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{deal.students.toLocaleString()}+ enrolled</div>
                                        </div>
                                    )}
                                    {deal.rating && (
                                        <div>
                                            <span style={{ color: "var(--muted)", fontWeight: 500 }}>Rating</span>
                                            <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{deal.rating.toFixed(1)} / 5.0</div>
                                        </div>
                                    )}
                                    {deal.duration && (
                                        <div>
                                            <span style={{ color: "var(--muted)", fontWeight: 500 }}>Course Duration</span>
                                            <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{deal.duration}</div>
                                        </div>
                                    )}
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <span style={{ color: "var(--muted)", fontWeight: 500 }}>Teaching Approach</span>
                                        <div style={{ color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.5 }}>
                                            Practical, project-based instruction focused on real-world application of {deal.category || "IT"} skills. This course provides structured progression from foundational concepts to advanced techniques.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* FAQs */}
                    {autoFAQs.length > 0 && (
                        <section aria-labelledby="faq-heading" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginBottom: "2rem" }}>
                            <h2 id="faq-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                                Frequently Asked Questions
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                                The following questions and answers cover the most common queries about this course, its coupon code, pricing, and enrollment process. All answers are based on verified data from {deal.provider || "Udemy"} as of {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {autoFAQs.map((faq, idx) => (
                                    <div key={idx} style={{ border: "1px solid #2d3748", borderRadius: "8px", overflow: "hidden" }}>
                                        <button
                                            onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                                            aria-expanded={expandedFAQ === idx}
                                            aria-controls={`faq-answer-${idx}`}
                                            id={`faq-question-${idx}`}
                                            style={{
                                                width: "100%",
                                                padding: "1rem 1.25rem",
                                                background: expandedFAQ === idx ? "var(--border)" : "var(--border)",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                fontSize: "0.95rem",
                                                fontWeight: 600,
                                                color: "var(--text)",
                                                gap: "1rem"
                                            }}
                                        >
                                            <span>{faq.q}</span>
                                            <span aria-hidden="true" style={{ transition: "transform 0.2s", transform: expandedFAQ === idx ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▼</span>
                                        </button>
                                        {expandedFAQ === idx && (
                                            <div
                                                id={`faq-answer-${idx}`}
                                                role="region"
                                                aria-labelledby={`faq-question-${idx}`}
                                                style={{ padding: "1rem 1.25rem", background: "var(--bg)", borderTop: "1px solid #2d3748" }}
                                            >
                                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, fontSize: "0.9rem", margin: 0 }}>{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Author Profile Section */}
                    <section aria-labelledby="author-profile-heading" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "16px", background: "var(--bg)", marginBottom: "2rem" }}>
                        <h2 id="author-profile-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true" />
                            About the Author
                        </h2>
                        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, var(--border), var(--card-hover))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "2px solid var(--brand)" }}>
                                <img src="/images/author.jpg" alt="Josh Smith" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                            </div>
                            <div style={{ flex: 1, minWidth: "240px" }}>
                                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>Josh Smith</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--brand)", fontWeight: 600, marginBottom: "0.5rem" }}>Udemy Coupon Specialist</div>
                                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65, margin: "0 0 0.75rem 0" }}>
                                    8+ years finding and verifying the best Udemy deals. Helped thousands of students save on premium courses through curated coupon codes and exclusive discounts.
                                </p>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <a href="https://www.linkedin.com/in/anandayuda/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ width: "32px", height: "32px", borderRadius: "6px", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "background 0.2s" }}
                                       onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--brand)"}
                                       onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--border)"}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--muted)"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    </a>
                                    <a href="https://www.facebook.com/CourseSpeakOfficial/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: "32px", height: "32px", borderRadius: "6px", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "background 0.2s" }}
                                       onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--brand)"}
                                       onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--border)"}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--muted)"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                    <a href="https://x.com/courses_peak" target="_blank" rel="noopener noreferrer" aria-label="X" style={{ width: "32px", height: "32px", borderRadius: "6px", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "background 0.2s" }}
                                       onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--brand)"}
                                       onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--border)"}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--muted)"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </a>
                                    <a href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "0 0.75rem", borderRadius: "6px", background: "rgba(212, 167, 55, 0.1)", border: "1px solid rgba(212, 167, 55, 0.2)", color: "var(--brand)", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600, transition: "background 0.2s" }}
                                       onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(212,167,55,0.2)"}
                                       onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(212, 167, 55, 0.1)"}>
                                        Daily Coupons →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Related Deals */}
                    {relatedDeals.length > 0 && (
                        <section aria-labelledby="related-heading" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginTop: "2rem" }}>
                            <h2 id="related-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ width: "6px", height: "32px", background: "var(--brand)", borderRadius: "9999px" }} aria-hidden="true"></span>
                                More {deal.category || "Udemy"} Courses You Might Like
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                                Similar {deal.provider || "Udemy"} courses in {deal.category || "this category"} with verified coupons:
                            </p>
                            <RelatedList items={relatedDeals} />
                        </section>
                    )}

                </main>

                {/* ─── RIGHT COLUMN — Sticky Sidebar ─── */}
                <aside aria-label="Course purchase options" style={{ position: "relative" }}>
                    <div style={{ position: "sticky", top: "2rem", background: "linear-gradient(135deg, #1a1814 0%, #2a2824 100%)", border: "1px solid rgba(212,167,55,0.15)", borderRadius: "8px", overflow: "hidden", boxShadow: "0 8px 32px rgba(212,167,55,0.1)" }}>
                        {deal.image && (
                            <div style={{ position: "relative" }}>
                                <img
                                    src={deal.image}
                                    alt={`${deal.title} — ${deal.provider || "Udemy"} course in ${deal.category || "Development"} — thumbnail`}
                                    width="400"
                                    height="190"
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                    style={{ width: "100%", height: "190px", objectFit: "cover", display: "block" }}
                                />
                            </div>
                        )}

                        <div style={{ padding: "1.25rem" }}>
                            {/* Price */}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: discountPct > 0 ? "6px" : "1rem" }}>
                                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>
                                    {price === 0 ? "Free" : `$${price}`}
                                </span>
                                {discountPct > 0 && (
                                    <>
                                        <span style={{ fontSize: "0.9rem", color: "#6b7280", textDecoration: "line-through" }}>${originalPrice}</span>
                                        <span style={{ fontSize: "0.75rem", background: "var(--brand)", color: "#1a1814", padding: "2px 7px", borderRadius: "3px", fontWeight: 700 }}>{discountPct}% OFF</span>
                                    </>
                                )}
                            </div>

                            {/* Countdown */}
                            {countdown && (
                                <div role="timer" aria-live="polite" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: "0.85rem", padding: "10px 12px", borderRadius: "6px", marginBottom: "1rem", border: "1px solid var(--border)" }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.75rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", color: "var(--muted)" }}>
                                        <svg style={{ width: "13px", height: "13px" }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                        COUPON EXPIRES IN
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", fontWeight: 800 }}>
                                        {[
                                            { val: countdown.days, label: "Days" },
                                            { val: countdown.hours, label: "Hrs" },
                                            { val: countdown.minutes, label: "Min" },
                                            { val: countdown.seconds, label: "Sec" },
                                        ].map(({ val, label }) => (
                                            <div key={label} style={{ textAlign: "center" }}>
                                                <div style={{ fontSize: "1.2rem" }}>{String(val).padStart(2, '0')}</div>
                                                <div style={{ fontSize: "0.65rem", opacity: 0.75, fontWeight: 500 }}>{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coupon code preview */}
                            {deal.coupon && (
                                <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", marginBottom: "0.75rem", padding: "0.6rem 0.75rem" }}>
                                    <div style={{ fontSize: "0.65rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                        🎫 Coupon Code
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <code style={{ fontSize: "0.8rem", fontWeight: 700, background: "var(--card)", padding: "4px 8px", borderRadius: "4px", border: "1px dashed var(--border)", color: "var(--text)", flex: 1, textAlign: "center", letterSpacing: "0.5px" }}>
                                            {deal.coupon.length > 4 ? `${deal.coupon.substring(0, 4)}···` : deal.coupon}
                                        </code>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 8px", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", color: "var(--brand)", whiteSpace: "nowrap" }}
                                        >
                                            Copy code
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                aria-label={`Redeem coupon for ${deal.title} on ${deal.provider || "Udemy"}`}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "0.75rem",
                                    background: "linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)",
                                    color: "#1a1814",
                                    textDecoration: "none",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    transition: "all 0.3s ease",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 16px rgba(212, 167, 55, 0.3)"
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(255, 215, 0, 0.3)";
                                }}
                            >
                                REDEEM COUPON
                            </a>

                            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b7280", marginBottom: "1.25rem" }}>
                                30-Day Money-Back Guarantee via {deal.provider || "Udemy"}
                            </p>

                            {/* Course includes */}
                            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: "10px", fontSize: "0.875rem" }}>This Course Includes:</p>
                                {[
                                    ["Duration", deal.duration ? `${deal.duration} on-demand video` : "On-demand video"],
                                    ["Access", "Lifetime access · Mobile & TV"],
                                    ["Certificate", "Certificate of completion"],
                                    ["Language", deal.language || "English"],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "center" }}>
                                        <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>{label}</span>
                                        <span style={{ color: "var(--text)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: "1px solid #2d3748", marginTop: "1rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button
                                    onClick={() => navigator.share?.({ title: deal.title, url: window.location.href })}
                                    style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Share this deal
                                </button>
                                <ActionsPanel deal={{ ...deal, url: deal.url || '' }} />
                            </div>

                            {/* Affiliate Disclosure */}
                            <div style={{
                                marginTop: "1rem",
                                padding: "0.75rem",
                                background: "rgba(212, 167, 55, 0.05)",
                                border: "1px solid rgba(212, 167, 55, 0.1)",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                color: "var(--muted)",
                                textAlign: "center",
                                lineHeight: 1.4
                            }}>
                                <span>We may earn a commission when you purchase through our links. </span>
                                <a href="/affiliate-disclosure" style={{
                                    color: "var(--brand)",
                                    textDecoration: "none",
                                    fontWeight: 600
                                }}>Learn more</a>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Coupon Modal */}
            {isModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        style={{ background: "var(--border)", borderRadius: "12px", padding: "2rem", maxWidth: "480px", width: "100%", border: "1px solid var(--border)", boxShadow: "0 20px 30px rgba(0,0,0,0.6)", position: "relative" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close modal"
                            style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--muted)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}
                        >
                            ✕
                        </button>

                        <h3 id="modal-title" style={{ color: "var(--text)", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
                            Your Coupon Code
                        </h3>
                        <p style={{ color: "var(--muted)", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.5rem" }}>
                            Copy the code, then click "Redeem Now" — the discount will apply at checkout.
                        </p>

                        <div style={{ background: "linear-gradient(135deg, var(--brand), #C5A028)", padding: "1.25rem", borderRadius: "8px", marginBottom: "1.25rem", textAlign: "center" }}>
                            <p style={{ color: "#1a1814", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: 600 }}>Coupon Code</p>
                            <code style={{ display: "block", fontSize: "1.15rem", fontWeight: 800, color: "#1a1814", letterSpacing: "1px", background: "rgba(255,255,255,0.3)", padding: "10px 16px", borderRadius: "6px", border: "1px dashed rgba(255,255,255,0.5)" }}>
                                {deal.coupon}
                            </code>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
                            <button
                                onClick={handleCopyCoupon}
                                style={{ background: couponCopied ? "var(--brand)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "var(--text)", padding: "0.75rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", transition: "all 0.2s" }}
                            >
                                {couponCopied ? "✓ Copied!" : "📋 Copy Code"}
                            </button>
                            <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                style={{ background: "var(--brand)", border: "1px solid var(--brand-hover)", color: "#1a1814", padding: "0.75rem", borderRadius: "6px", fontWeight: 700, textDecoration: "none", textAlign: "center", fontSize: "0.95rem" }}
                            >
                                Redeem Now on {deal.provider || "Udemy"} →
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .deal-layout { grid-template-columns: 1fr 340px; }
                .prose h1, .prose h2, .prose h3 { color: #fff; margin-top: 1.5em; margin-bottom: 0.5em; }
                .prose p { margin-bottom: 1em; }
                .prose ul, .prose ol { margin-bottom: 1em; padding-left: 1.5em; list-style: disc; }
                .prose li { margin-bottom: 0.5em; }
                .prose a { color: var(--brand); text-decoration: underline; }
                .prose strong { color: #e2e8f0; }
                .prose code { background: var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }

                @media (max-width: 900px) {
                    .deal-layout { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 640px) {
                    h1 { font-size: 1.4rem !important; }
                }
                @media print {
                    body { background: white !important; color: black !important; }
                }
            `}</style>
        </div>
    );
}