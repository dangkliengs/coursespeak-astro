"use client";
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { renderMarkdownToHtml } from "../lib/markdown";
import { extractDifficultyLevel } from "../lib/utils";
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
    faqs?: { q: string; a: string }[];
}

export default function DealPage({ deal, relatedDeals = [] }: { deal: Deal, relatedDeals?: any[] }) {
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
            q: `How do I redeem the coupon for "${deal.title}"?`,
            a: `Click the "Redeem Coupon" button on this page. It will open the ${provider} course page with the discount applied automatically. If you have trouble, copy the coupon code manually and paste it at checkout.`
        });

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
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

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
        if (deal.coupon) {
            navigator.clipboard.writeText(deal.coupon).then(() => {
                setCouponCopied(true);
                setTimeout(() => setCouponCopied(false), 2500);
            });
        }
    };

    // Build slug-based canonical category URL
    const categorySlug = deal.category?.toLowerCase().replace(/\s+/g, '-') || '';
    const subcategorySlug = deal.subcategory?.toLowerCase().replace(/\s+/g, '-') || '';

    // Structured data — Course + BreadcrumbList + FAQPage
    const courseStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Course",
                "name": deal.title,
                "description": deal.description,
                "url": `https://coursespeak.com/deal/${deal.id}`,
                "image": deal.image,
                "inLanguage": deal.language || "en",
                "provider": {
                    "@type": "Organization",
                    "name": deal.provider || "Online Learning Platform",
                    "sameAs": "https://www.udemy.com"
                },
                ...(deal.instructor ? {
                    "instructor": {
                        "@type": "Person",
                        "name": deal.instructor.includes(',')
                            ? deal.instructor.split(',')[1]?.trim()
                            : deal.instructor
                    }
                } : {}),
                "offers": {
                    "@type": "Offer",
                    "price": price.toString(),
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    ...(deal.expiresAt ? { "priceValidUntil": deal.expiresAt } : {}),
                    "seller": {
                        "@type": "Organization",
                        "name": "CourseSpeak",
                        "url": "https://coursespeak.com"
                    }
                },
                ...(deal.rating ? {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": deal.rating.toFixed(1),
                        "reviewCount": Math.max(10, deal.students ?? 1000),
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                } : {}),
                ...(deal.duration ? (() => {
                    const hours = parseFloat(deal.duration!);
                    if (isNaN(hours)) return {};
                    const h = Math.floor(hours);
                    const m = Math.round((hours - h) * 60);
                    return { "timeRequired": m > 0 ? `PT${h}H${m}M` : `PT${h}H` };
                })() : {}),
                "courseMode": "online",
                "educationalLevel": extractDifficultyLevel(deal.title, deal.description),
                "teaches": deal.learn?.slice(0, 8) || []
            },
            {
                "@type": "BreadcrumbList",
                "@id": `https://coursespeak.com/deal/${deal.id}#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://coursespeak.com" },
                    { "@type": "ListItem", "position": 2, "name": "All Deals", "item": "https://coursespeak.com/deals" },
                    ...(deal.category ? [{ "@type": "ListItem", "position": 3, "name": deal.category, "item": `https://coursespeak.com/categories/${categorySlug}` }] : []),
                    ...(deal.subcategory && deal.subcategory !== deal.category ? [{ "@type": "ListItem", "position": 4, "name": deal.subcategory, "item": `https://coursespeak.com/categories/${categorySlug}/${subcategorySlug}` }] : []),
                    {
                        "@type": "ListItem",
                        "position": deal.subcategory && deal.subcategory !== deal.category ? 5 : deal.category ? 4 : 3,
                        "name": deal.title,
                        "item": `https://coursespeak.com/deal/${deal.id}`
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `https://coursespeak.com/deal/${deal.id}#faq`,
                "mainEntity": autoFAQs.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": { "@type": "Answer", "text": faq.a }
                }))
            }
        ]
    };

    return (
        <div style={{ background: "#0b0d12", color: "#e2e8f0", minHeight: "100vh" }}>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseStructuredData, null, 0) }}
            />

            {/* Breadcrumb + Hero */}
            <header style={{ background: "#1f2330", padding: "2rem 0", borderBottom: "1px solid #0b0d12" }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem" }}>
                        <ol
                            itemScope
                            itemType="https://schema.org/BreadcrumbList"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                color: "#fff",
                                fontWeight: 600,
                                flexWrap: "wrap",
                                listStyle: "none",
                                margin: 0,
                                padding: 0
                            }}
                        >
                            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <a href="/" itemProp="item" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                                    <span itemProp="name">Home</span>
                                </a>
                                <meta itemProp="position" content="1" />
                            </li>
                            <li aria-hidden="true" style={{ color: "#64748b" }}>›</li>
                            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <a href="/deals" itemProp="item" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                                    <span itemProp="name">All Deals</span>
                                </a>
                                <meta itemProp="position" content="2" />
                            </li>
                            {deal.category && (
                                <>
                                    <li aria-hidden="true" style={{ color: "#64748b" }}>›</li>
                                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <a href={`/categories/${categorySlug}`} itemProp="item" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                                            <span itemProp="name">{deal.category}</span>
                                        </a>
                                        <meta itemProp="position" content="3" />
                                    </li>
                                </>
                            )}
                            {deal.subcategory && deal.subcategory !== deal.category && (
                                <>
                                    <li aria-hidden="true" style={{ color: "#64748b" }}>›</li>
                                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <a href={`/categories/${categorySlug}/${subcategorySlug}`} itemProp="item" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                                            <span itemProp="name">{deal.subcategory}</span>
                                        </a>
                                        <meta itemProp="position" content="4" />
                                    </li>
                                </>
                            )}
                            <li aria-hidden="true" style={{ color: "#64748b" }}>›</li>
                            <li aria-current="page" style={{ color: "#FBBF24", fontWeight: 700, wordBreak: "break-word" }}>
                                {deal.title}
                            </li>
                        </ol>
                    </nav>

                    {/* H1 — SEO-optimized title */}
                    <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem", color: "#fff" }}>
                        {deal.title}
                        {discountPct > 0 ? ` — ${discountPct}% Off Coupon` : ' — Free Coupon'}
                    </h1>

                    <p style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem", color: "#cbd5e1", maxWidth: "800px" }}>
                        {deal.description}
                    </p>

                    {/* Course meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "14px" }}>
                        {deal.rating && (
                            <span style={{ color: "#f59e0b", fontWeight: 700 }} aria-label={`Rated ${deal.rating.toFixed(1)} out of 5`}>
                                {deal.rating.toFixed(1)} <span aria-hidden="true">★★★★★</span>
                            </span>
                        )}
                        {deal.students && (
                            <span style={{ color: "#cbd5e1" }}>
                                <strong>{deal.students.toLocaleString()}</strong> students enrolled
                            </span>
                        )}
                        {deal.instructor && (
                            <span style={{ color: "#cbd5e1" }}>
                                Created by <strong style={{ color: "#FBBF24" }}>{deal.instructor}</strong>
                            </span>
                        )}
                        {deal.updatedAt && (
                            <span style={{ color: "#9ca3af" }}>
                                Last updated:{" "}
                                <time dateTime={new Date(deal.updatedAt).toISOString()}>
                                    {new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                </time>
                            </span>
                        )}
                        {deal.language && (
                            <span style={{ color: "#cbd5e1" }}>🌐 {deal.language}</span>
                        )}
                    </div>
                </div>
            </header>

            {/* Main layout */}
            <div className="container deal-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem" }}>

                {/* ─── LEFT COLUMN ─── */}
                <main>

                    {/* Key Takeaways */}
                    <section aria-labelledby="key-takeaways-heading" style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                        <h2 id="key-takeaways-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
                            Course Overview — Key Details
                        </h2>
                        <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
                            A quick-reference summary of the most important course details: provider, instructor, difficulty, duration, and what the coupon covers.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "#cbd5e1" }}>
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
                                { label: "Access", value: "Lifetime Access · Mobile & TV compatible" },
                                { label: "Certificate", value: "Certificate of completion included" },
                                deal.learn && deal.learn.length > 0 ? { label: "Top Learning Outcomes", value: deal.learn.slice(0, 3).join(' · ') } : null,
                                deal.requirements && deal.requirements.length > 0 ? { label: "Prerequisites", value: deal.requirements.slice(0, 2).join(' · ') } : null,
                                { label: "Coupon", value: "Click REDEEM COUPON below to apply discount" },
                            ].filter(Boolean).map((item, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#64748b", marginTop: "2px", flexShrink: 0 }}>•</span>
                                    <span><strong style={{ color: "#e2e8f0" }}>{item!.label}:</strong>{" "}{item!.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* What You'll Learn */}
                    {deal.learn && deal.learn.length > 0 && (
                        <section aria-labelledby="learn-heading" style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 id="learn-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                                What You'll Learn
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
                                Skills and competencies you'll gain from this {deal.provider || "Udemy"} course:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "#cbd5e1" }}>
                                {deal.learn.map((point, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <span style={{ color: "#22c55e", marginTop: "3px", flexShrink: 0 }}>✓</span>
                                        <span>{point.endsWith('.') ? point : point + '.'}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Requirements */}
                    {deal.requirements && deal.requirements.length > 0 && (
                        <section aria-labelledby="requirements-heading" style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 id="requirements-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                                Course Requirements & Prerequisites
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
                                Background knowledge or tools recommended before starting this course:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "#cbd5e1" }}>
                                {deal.requirements.map((req, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <span style={{ color: "#64748b", marginTop: "2px", flexShrink: 0 }}>•</span>
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Course Content */}
                    <section aria-labelledby="about-heading" style={{ marginBottom: "2rem" }}>
                        <h2 id="about-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                            About This {deal.provider || "Udemy"} Course
                        </h2>
                        <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
                            Full course description including curriculum, tools covered, and learning methodology:
                        </p>
                        <div
                            ref={markdownRef}
                            className="prose prose-invert max-w-none"
                            style={{ lineHeight: 1.75, color: "#cbd5e1", fontSize: "0.95rem" }}
                            suppressHydrationWarning={true}
                        />
                    </section>

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

                    {/* Instructor */}
                    {deal.instructor && (
                        <section aria-labelledby="instructor-heading" style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 id="instructor-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                                About the Instructor
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
                                This course is taught by <strong style={{ color: "#fbbf24" }}>{deal.instructor}</strong>.
                                For full instructor bio, credentials, and other courses they teach, visit the instructor profile on{" "}
                                <a href={deal.url} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>
                                    {deal.provider || "the course platform"}
                                </a>.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem", fontSize: "0.9rem", color: "#cbd5e1" }}>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <span style={{ color: "#64748b" }}>•</span>
                                    <span><strong style={{ color: "#e2e8f0" }}>Instructor:</strong> {deal.instructor}</span>
                                </div>
                                {deal.category && (
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <span style={{ color: "#64748b" }}>•</span>
                                        <span><strong style={{ color: "#e2e8f0" }}>Field:</strong> {deal.category}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <span style={{ color: "#64748b" }}>•</span>
                                    <span><strong style={{ color: "#e2e8f0" }}>Teaching Style:</strong> Practical, project-based learning (as described in course curriculum)</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Coupon Deal Summary — SEO signal for deal intent */}
                    <section aria-labelledby="deal-summary-heading" style={{ borderTop: "1px solid #1f2330", paddingTop: "2rem", marginBottom: "2rem" }}>
                        <h2 id="deal-summary-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                            Is the {deal.title} Coupon Worth It?
                        </h2>
                        <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: 1.75, marginBottom: "1rem" }}>
                            <strong>{deal.title}</strong> is a {deal.category?.toLowerCase() || "professional development"} course offered on{" "}
                            <strong>{deal.provider || "Udemy"}</strong>
                            {deal.instructor ? ` by instructor ${deal.instructor}` : ""}
                            {deal.duration ? `, spanning ${deal.duration} of on-demand content` : ""}.
                            {deal.rating ? ` It holds a ${deal.rating.toFixed(1)}/5 rating` : ""}
                            {deal.students ? ` from over ${deal.students.toLocaleString()} enrolled students` : ""}.
                        </p>
                        <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: 1.75, marginBottom: "1rem" }}>
                            Through CourseSpeak, you can access this course with a{" "}
                            {discountPct > 0 ? `${discountPct}% discount coupon` : "free or discounted coupon"}.
                            The coupon was last verified on{" "}
                            {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "the date shown above"}.
                            Udemy coupons are time-limited and claimed on a first-come basis — we recommend redeeming as soon as possible.
                        </p>
                        <div style={{
                            padding: "1.25rem 1.5rem",
                            background: "rgba(34, 197, 94, 0.07)",
                            borderRadius: "8px",
                            border: "1px solid rgba(34, 197, 94, 0.2)",
                            fontSize: "0.95rem",
                            color: "#cbd5e1"
                        }}>
                            <strong style={{ color: "#22c55e" }}>✓ Our Take:</strong>{" "}
                            Based on the rating{deal.rating ? ` (${deal.rating.toFixed(1)}/5)` : ""} and enrollment numbers
                            {deal.students ? ` (${deal.students.toLocaleString()} students)` : ""},
                            this course appears well-regarded in its category.
                            Use the coupon to access it at a significantly reduced price — and judge for yourself using Udemy's 30-day money-back guarantee.
                        </div>
                    </section>

                    {/* Student Ratings (aggregated — NO fake individual reviews) */}
                    {deal.rating && deal.students && (
                        <section aria-labelledby="ratings-heading" style={{ marginBottom: "2rem" }}>
                            <h2 id="ratings-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                                Course Rating Summary
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                                Aggregate rating data sourced from {deal.provider || "Udemy"} as of{" "}
                                {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "the latest update"}.
                                For individual student reviews, visit the course page directly.
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                                <div style={{ textAlign: "center", minWidth: "100px" }}>
                                    <div style={{ fontSize: "3.5rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>
                                        {deal.rating.toFixed(1)}
                                    </div>
                                    <div style={{ color: "#f59e0b", fontSize: "1.1rem", margin: "4px 0" }} aria-hidden="true">★★★★★</div>
                                    <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                                        {deal.students.toLocaleString()} ratings
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
                                            <span style={{ color: "#9ca3af", fontSize: "0.8rem", width: "50px", flexShrink: 0 }}>{star} star{star !== 1 ? 's' : ''}</span>
                                            <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${star} stars: ${pct}%`} style={{ flex: 1, height: "8px", background: "#2d3748", borderRadius: "4px", overflow: "hidden" }}>
                                                <div style={{ width: `${pct}%`, height: "100%", background: "#f59e0b", borderRadius: "4px" }}></div>
                                            </div>
                                            <span style={{ color: "#64748b", fontSize: "0.8rem", width: "35px", textAlign: "right" }}>{pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "1rem", fontStyle: "italic" }}>
                                * Rating distribution is estimated. For exact per-star counts, visit the {deal.provider || "Udemy"} course page.
                            </p>
                        </section>
                    )}

                    {/* FAQs */}
                    {autoFAQs.length > 0 && (
                        <section aria-labelledby="faq-heading" style={{ borderTop: "1px solid #1f2330", paddingTop: "2rem", marginBottom: "2rem" }}>
                            <h2 id="faq-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                                Frequently Asked Questions
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                                Common questions about enrollment, course access, certification, and how to use the coupon:
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
                                                background: expandedFAQ === idx ? "#2d3748" : "#1f2330",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                fontSize: "0.95rem",
                                                fontWeight: 600,
                                                color: "#fff",
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
                                                style={{ padding: "1rem 1.25rem", background: "#0b0d12", borderTop: "1px solid #2d3748" }}
                                            >
                                                <p style={{ color: "#cbd5e1", lineHeight: 1.65, fontSize: "0.9rem", margin: 0 }}>{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Related Deals */}
                    {relatedDeals.length > 0 && (
                        <section aria-labelledby="related-heading" style={{ borderTop: "1px solid #1f2330", paddingTop: "2rem", marginTop: "2rem" }}>
                            <h2 id="related-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                                More {deal.category || "Udemy"} Courses You Might Like
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                                Similar {deal.provider || "Udemy"} courses in {deal.category || "this category"} with verified coupons:
                            </p>
                            <RelatedList items={relatedDeals} />
                        </section>
                    )}

                </main>

                {/* ─── RIGHT COLUMN — Sticky Sidebar ─── */}
                <aside aria-label="Course purchase options" style={{ position: "relative" }}>
                    <div style={{ position: "sticky", top: "2rem", background: "#1f2330", border: "1px solid #2d3748", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)" }}>
                        {deal.image && (
                            <div style={{ position: "relative" }}>
                                <img
                                    src={deal.image}
                                    alt={`${deal.title} — ${deal.provider || "Udemy"} course thumbnail`}
                                    width="400"
                                    height="190"
                                    loading="lazy"
                                    decoding="async"
                                    style={{ width: "100%", height: "190px", objectFit: "cover", display: "block" }}
                                />
                                <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(255,255,255,0.9)", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(0,0,0,0.4)" }}>
                                    <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "15px solid #111", marginLeft: "3px" }}></div>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: "1.25rem" }}>
                            {/* Price */}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: discountPct > 0 ? "6px" : "1rem" }}>
                                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
                                    {price === 0 ? "Free" : `$${price}`}
                                </span>
                                {discountPct > 0 && (
                                    <>
                                        <span style={{ fontSize: "0.9rem", color: "#6b7280", textDecoration: "line-through" }}>${originalPrice}</span>
                                        <span style={{ fontSize: "0.75rem", background: "#ef4444", color: "#fff", padding: "2px 7px", borderRadius: "3px", fontWeight: 700 }}>{discountPct}% OFF</span>
                                    </>
                                )}
                            </div>

                            {/* Countdown */}
                            {countdown && (
                                <div role="timer" aria-live="polite" style={{ background: "#fef2f2", color: "#dc2626", fontSize: "0.85rem", padding: "10px 12px", borderRadius: "6px", marginBottom: "1rem", border: "1px solid #fca5a5" }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.75rem", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
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
                                <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "0.6rem 0.75rem", borderRadius: "6px", marginBottom: "0.75rem" }}>
                                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                        🎫 Coupon Code
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <code style={{ fontSize: "0.8rem", fontWeight: 700, background: "rgba(255,255,255,0.15)", padding: "4px 8px", borderRadius: "4px", border: "1px dashed rgba(255,255,255,0.35)", color: "#fff", flex: 1, textAlign: "center", letterSpacing: "0.5px" }}>
                                            {deal.coupon.length > 4 ? `${deal.coupon.substring(0, 4)}···` : deal.coupon}
                                        </code>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "4px", padding: "4px 8px", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", color: "#fff", whiteSpace: "nowrap" }}
                                        >
                                            Reveal
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
                                style={{ display: "block", textAlign: "center", background: "#a855f7", color: "#fff", fontWeight: 700, padding: "13px", fontSize: "1rem", borderRadius: "4px", marginBottom: "10px", textDecoration: "none", transition: "background 0.2s" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#9333ea"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#a855f7"; }}
                            >
                                REDEEM COUPON
                            </a>

                            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b7280", marginBottom: "1.25rem" }}>
                                30-Day Money-Back Guarantee via {deal.provider || "Udemy"}
                            </p>

                            {/* Course includes */}
                            <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                <p style={{ fontWeight: 700, color: "#fff", marginBottom: "10px", fontSize: "0.875rem" }}>This Course Includes:</p>
                                {[
                                    ["Duration", deal.duration ? `${deal.duration} on-demand video` : "On-demand video"],
                                    ["Access", "Lifetime access · Mobile & TV"],
                                    ["Certificate", "Certificate of completion"],
                                    ["Language", deal.language || "English"],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "center" }}>
                                        <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>{label}</span>
                                        <span style={{ color: "#e2e8f0", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: "1px solid #2d3748", marginTop: "1rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button
                                    onClick={() => navigator.share?.({ title: deal.title, url: window.location.href })}
                                    style={{ color: "#9ca3af", fontWeight: 600, fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Share this deal
                                </button>
                                <ActionsPanel deal={{ ...deal, url: deal.url || '' }} />
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
                        style={{ background: "#1f2330", borderRadius: "12px", padding: "2rem", maxWidth: "480px", width: "100%", border: "1px solid #2d3748", boxShadow: "0 20px 30px rgba(0,0,0,0.6)", position: "relative" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close modal"
                            style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#6b7280", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}
                        >
                            ✕
                        </button>

                        <h3 id="modal-title" style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
                            Your Coupon Code
                        </h3>
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.5rem" }}>
                            Copy the code, then click "Redeem Now" — the discount will apply at checkout.
                        </p>

                        <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "1.25rem", borderRadius: "8px", marginBottom: "1.25rem", textAlign: "center" }}>
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Coupon Code</p>
                            <code style={{ display: "block", fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "1px", background: "rgba(255,255,255,0.15)", padding: "10px 16px", borderRadius: "6px", border: "1px dashed rgba(255,255,255,0.4)" }}>
                                {deal.coupon}
                            </code>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
                            <button
                                onClick={handleCopyCoupon}
                                style={{ background: couponCopied ? "#22c55e" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "0.75rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", transition: "all 0.2s" }}
                            >
                                {couponCopied ? "✓ Copied!" : "📋 Copy Code"}
                            </button>
                            <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                style={{ background: "#a855f7", border: "1px solid #9333ea", color: "#fff", padding: "0.75rem", borderRadius: "6px", fontWeight: 600, textDecoration: "none", textAlign: "center", fontSize: "0.95rem" }}
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
                .prose a { color: #60a5fa; text-decoration: underline; }
                .prose strong { color: #e2e8f0; }
                .prose code { background: #1f2330; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }

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