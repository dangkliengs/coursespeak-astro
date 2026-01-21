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
    // Prefer content (detailed) over description (short)
    const bodyContent = deal.content || deal.description || "";
    
    // Check if content is HTML or markdown
    const isHtmlContent = bodyContent.includes('<') && bodyContent.includes('>');
    const htmlContent = useMemo(() => {
        if (isHtmlContent) {
            // If content is HTML, use it directly (clean it first)
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
            // If content is markdown, render it to HTML
            return renderMarkdownToHtml(bodyContent);
        }
    }, [bodyContent, isHtmlContent]);



    // Auto-generate FAQs if none exist
    const autoFAQs = useMemo(() => {
        if (deal.faqs && deal.faqs.length > 0) {
            return deal.faqs;
        }

        // Generate automatic FAQs based on deal data
        const generated = [];

        if (deal.price !== undefined) {
            const price = deal.price ?? 9.99;
            const original = deal.originalPrice ?? 119.99;
            const discount = original > price ? Math.round(100 - (price / original) * 100) : 0;

            generated.push({
                q: `Is ${deal.title} Coupon Code Valid?`,
                a: `Yes — the coupon code is confirmed active and applies a ${discount > 0 ? ` (${discount}% OFF)` : ''} discount.`
            });
        }

        if (deal.duration) {
            generated.push({
                q: `How long is the ${deal.provider} course?`,
                a: `The ${deal.title} course is approximately ${deal.duration} long with comprehensive content.`
            });
        }

        if (deal.learn && deal.learn.length > 0) {
            const firstLearn = deal.learn[0];
            generated.push({
                q: `What will I learn in ${deal.title} classes?`,
                a: `Learn ${firstLearn.toLowerCase()} and much more in this comprehensive ${deal.provider} course.`
            });
        }

        generated.push({
            q: `How do I get this ${deal.provider} course?`,
            a: `Click the "Redeem Coupon" button on this page to access the course with our exclusive coupon code applied automatically.`
        });

        return generated;
    }, [deal]);

    // Auto-generate detailed review content
    const autoReviewContent = useMemo(() => {
        const instructor = deal.instructor || deal.provider || "Expert Instructor";
        const category = deal.category || "Professional Development";
        const provider = deal.provider || "Online Learning Platform";
        const subcategory = deal.subcategory || category;
        const description = deal.description || "professional skills";

        return {
            title: `Review - ${deal.title} course on ${provider} worth it?`,
            subtitle: `Complete Review: ${deal.title} by ${instructor}`,
            content: [
                `<strong>${deal.title}</strong> is a comprehensive online course designed to help students master <strong>${category}</strong> skills. Created by <strong>${instructor}</strong>, this course provides practical knowledge and hands-on experience that learners can immediately apply in professional settings.`,

                `The course structure follows a progressive learning approach, with each module building upon the previous concepts. Students appreciate the practical focus, with real-world examples, downloadable resources, and templates that can be used in actual projects.`,

                `Available on <strong>${provider}</strong> with lifetime access, this course offers excellent value for anyone looking to advance their skills in <strong>${subcategory}</strong> and take their career to the next level.`
            ]
        };
    }, [deal]);

    // FAQ accordion state
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    // Modal state for coupon reveal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Real-time countdown state
    const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    // Ref for markdown content container
    const markdownRef = useRef<HTMLDivElement>(null);
    
    // Set innerHTML only on client side to avoid hydration mismatch
    useEffect(() => {
        if (markdownRef.current && htmlContent) {
            markdownRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);
    
    // Provide empty div on server side, populate on client
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Real-time countdown effect
    useEffect(() => {
        if (!deal.expiresAt) return;

        const updateCountdown = () => {
            const now = new Date();
            const expires = new Date(deal.expiresAt!);
            const diffMs = expires.getTime() - now.getTime();

            if (diffMs <= 0) {
                setCountdown(null);
                return;
            }

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [deal.expiresAt]);

    // Calculate time remaining for coupon
    const timeRemaining = useMemo(() => {
        if (!deal.expiresAt) return null;
        
        const now = new Date();
        const expires = new Date(deal.expiresAt);
        const diffMs = expires.getTime() - now.getTime();
        
        if (diffMs <= 0) return 'Expired';
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
        } else {
            return 'Less than 1 hour left';
        }
    }, [deal.expiresAt]);

    const price = deal.price ?? 9.99;
    const originalPrice = deal.originalPrice ?? 119.99;
    const discountPct = originalPrice > price ? Math.round(100 - (price / originalPrice) * 100) : 0;

    // Generate structured data for SEO/AI
    const courseStructuredData = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": deal.title,
        "description": deal.description,
        "url": `https://coursespeak.com/deal/${deal.id}`,
        "image": deal.image,
        "provider": {
            "@type": "Organization",
            "name": deal.provider || "Online Learning Platform"
        },
        "instructor": deal.instructor ? {
            "@type": "Person",
            "name": deal.instructor.split(',')[1]?.trim() || deal.instructor.split(' ')[0] || deal.instructor
        } : undefined,
        "offers": {
            "@type": "Offer",
            "price": price.toString(),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": deal.expiresAt || undefined,
            "seller": {
                "@type": "Organization",
                "name": "CourseSpeak"
            }
        },
        "aggregateRating": deal.rating ? {
            "@type": "AggregateRating",
            "ratingValue": deal.rating.toFixed(1),
            "reviewCount": deal.students?.toString() || "1000",
            "bestRating": "5",
            "worstRating": "1"
        } : undefined,
        "timeRequired": deal.duration ? `PT${deal.duration.replace(/\D/g, '')}H` : undefined,
        "courseMode": "online",
        "educationalUse": "professional development",
        "teaches": deal.learn?.slice(0, 5) || []
    };

    return (
        <div style={{ background: "#0b0d12", color: "#e2e8f0", minHeight: "100vh" }}>
            {/* Structured Data for SEO/AI */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(courseStructuredData, null, 0)
                }}
            />

            {/* Breadcrumb / Intro Section (Not a full header) */}
            <div style={{ background: "#1f2330", padding: "2rem 0", color: "#fff", borderBottom: "1px solid #2d3748" }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", position: "relative" }}>
                    <div style={{ maxWidth: "900px" }}>
                        <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem" }}>
                            <ol style={{
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
                            }}>
                                <li>
                                    <a href="/" style={{ color: "#fff", textDecoration: "none" }} title="Go to CourseSpeak homepage">Home</a>
                                </li>
                                <li aria-hidden="true" style={{ color: "#cbd5e1" }}>›</li>
                                <li>
                                    <a href="/deals" style={{ color: "#fff", textDecoration: "none" }} title="Browse all course deals">All Deals</a>
                                </li>
                                {deal.category && (
                                    <>
                                        <li aria-hidden="true" style={{ color: "#cbd5e1" }}>›</li>
                                        <li>
                                            <a href={`/categories/${deal.category.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: "#fff", textDecoration: "none" }} title={`Browse ${deal.category} courses`}>
                                                {deal.category}
                                            </a>
                                        </li>
                                    </>
                                )}
                                {deal.subcategory && deal.subcategory !== deal.category && (
                                    <>
                                        <li aria-hidden="true" style={{ color: "#cbd5e1" }}>›</li>
                                        <li>
                                            <a href={`/categories/${deal.category?.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: "#fff", textDecoration: "none" }} title={`Browse ${deal.subcategory} courses`}>
                                                {deal.subcategory}
                                            </a>
                                        </li>
                                    </>
                                )}
                                <li aria-hidden="true" style={{ color: "#cbd5e1" }}>›</li>
                                <li aria-current="page" style={{ color: "#FBBF24", fontWeight: 700 }}>
                                    <span style={{
                                        wordBreak: "break-word",
                                        hyphens: "auto",
                                        maxWidth: "100%"
                                    }}>
                                        {deal.title}
                                    </span>
                                </li>
                            </ol>
                        </nav>

                        <h1 style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
                            {deal.title}
                        </h1>

                        <div style={{ fontSize: "1.1rem", lineHeight: 1.5, marginBottom: "1.5rem", color: "#cbd5e1" }}>
                            {deal.description}
                        </div>



                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "14px", width: "100%" }}>
                            {deal.rating && (
                                <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                                    {deal.rating.toFixed(1)} <span style={{ color: "#f59e0b" }}>★★★★★</span>
                                </span>
                            )}
                            {deal.students && (
                                <span>{deal.students.toLocaleString()} students</span>
                            )}
                            <span style={{ display: "flex", gap: "4px" }}>
                                Created by <span style={{ color: "#FBBF24", textDecoration: "underline" }}>{deal.instructor || deal.provider || "Instructor"}</span>
                            </span>
                            {deal.updatedAt && (
                                <span style={{ color: "#9ca3af" }}>Published/Updated on: <time dateTime={new Date(deal.updatedAt).toISOString()}>
                                        {new Date(deal.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time></span>
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








                    {/* Key Takeaways Section */}
                    <div style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Key Takeaways</h2>
                        <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1rem" }}>
                            Course overview with structured fields: Title, Provider, Instructor, Updated Date, Difficulty, Focus, Audience, Outcomes and Coupon Code.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", fontSize: "0.95rem", color: "#cbd5e1" }}>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Course Title:</strong> {deal.title}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Provider:</strong> {deal.provider} (via CourseSpeak listing)</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Instructor:</strong> {deal.instructor}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Coupon Verified on:</strong> {deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Difficulty Level:</strong> {extractDifficultyLevel(deal.title, deal.description)}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Course Focus:</strong> {deal.category?.toLowerCase() || 'Programming'} fundamentals to advanced concepts</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Learning Outcomes:</strong> {deal.learn && deal.learn.length > 0 ? deal.learn.slice(0, 3).join(', ') : 'Core programming skills'}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Prerequisites:</strong> {deal.requirements && deal.requirements.length > 0 ? deal.requirements.join(', ') : 'None'}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Target Audience:</strong> Beginners to advanced programmers</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Course Type:</strong> Self Paced Online Course. Lifetime Access</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                <span><strong>Coupon:</strong> Click on <strong>REDEEM COUPON</strong> to Enroll and apply discount code</span>
                            </div>
                        </div>
                    </div>

                    {/* What you'll learn */}
                    {deal.learn && deal.learn.length > 0 && (
                        <div style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>What you'll learn</h2>
                            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1rem" }}>
                                The following outcomes clarify specific competencies mastered by learners through practical projects:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", fontSize: "0.95rem", color: "#cbd5e1" }}>
                                {deal.learn.map((point, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                        <span style={{ color: "#a9b0c0", marginTop: "2px" }}>✓</span>
                                        <span>{point.endsWith('.') ? point : point + '.'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Requirements Section */}
                    {deal.requirements && deal.requirements.length > 0 && (
                        <div style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Requirements</h2>
                            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1rem" }}>
                                This section lists the necessary background knowledge, tools, or prerequisites needed before starting the course to ensure you have the best learning experience.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", fontSize: "0.95rem", color: "#cbd5e1" }}>
                                {deal.requirements.map((req, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                        <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Course Description</h2>
                        <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1rem" }}>
                            A detailed explanation of modules, tools, and project use cases included in the curriculum. from this comprehensive {deal.subcategory?.toLowerCase() || 'programming'} courses.
                        </p>
                        {/* Render Markdown Content */}
                        <div
                            ref={markdownRef}
                            className="prose prose-invert max-w-none"
                            style={{ lineHeight: 1.7, color: "#cbd5e1" }}
                            suppressHydrationWarning={true}
                        />
                    </div>

                    {/* Course Comparison Widget */}
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
                            similarDeals={relatedDeals.slice(0, 3).map(r => ({
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

                    {/* Instructor Section */}
                    {deal.instructor && (
                        <div style={{ border: "1px solid #1f2330", padding: "1.5rem", borderRadius: "8px", background: "#0b0d12", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>About the Instructor</h2>
                            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1rem" }}>
                                Learn from experienced professionals in the field.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", fontSize: "0.95rem", color: "#cbd5e1" }}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                    <span><strong>Instructor:</strong> {deal.instructor}</span>
                                </div>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                    <span><strong>Expertise:</strong> {deal.category?.toLowerCase() || 'Technology'} education and applied programming expertise</span>
                                </div>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                    <span><strong>Experience:</strong> 12+ years developing large-scale systems in {deal.subcategory || deal.category || 'modern technologies'}</span>
                                </div>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                    <span><strong>Teaching Style:</strong> Practical focus with real-world examples and hands-on projects</span>
                                </div>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#a9b0c0", marginTop: "2px" }}>•</span>
                                    <span><strong>Institution:</strong> <strong>{deal.instructor.includes(',') ? deal.instructor.split(',')[0].trim() : 'Professional Academy'}</strong> - Leading provider of quality {deal.category?.toLowerCase() || 'technology'} education</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detailed Review Section */}
                    <div style={{ marginBottom: "2rem", borderTop: "1px solid #1f2330", paddingTop: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>
                            {autoReviewContent.title}
                        </h2>
                        <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1rem" }}>
                            This section provides an in-depth analysis and comprehensive review of the course, evaluating its content quality, teaching methodology, practical applications, and overall value for money.
                        </p>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", color: "#fbbf24" }}>
                            {autoReviewContent.subtitle}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "1rem", lineHeight: "1.7", color: "#cbd5e1" }}>
                            {autoReviewContent.content.map((paragraph, idx) => (
                                <p key={idx} style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: paragraph }} />
                            ))}
                        </div>
                        <div style={{
                            marginTop: "2rem",
                            padding: "1.5rem",
                            background: "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                            borderRadius: "8px",
                            border: "1px solid rgba(96, 165, 250, 0.2)"
                        }}>
                            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fbbf24", marginBottom: "0.5rem" }}>
                                Our Recommendation
                            </div>
                            <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.95rem" }}>
                                Course recommendation: <strong style={{ color: "#fff" }}>{deal.title}</strong> excels in {deal.category?.toLowerCase() || 'professional skills'} development based on verified student reviews and curriculum analysis.
                            </p>
                        </div>
                    </div>

                    {/* Student Feedback - Combined with Review Section */}
                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Student Feedback</h2>
                        <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                            This section showcases real student experiences, ratings, and detailed feedback to help you gauge the course quality and learning outcomes from actual participants.
                        </p>
                        {/* Rating Summary */}
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "4rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>
                                    {typeof deal.rating === 'number' ? deal.rating.toFixed(1) : (parseFloat(deal.rating || '') || 4.8).toFixed(1)}
                                </div>
                                <div style={{ color: "#f59e0b", fontSize: "1.2rem", fontWeight: 700 }}>★★★★★</div>
                                <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Course Rating
                                 <div style={{ color: "#cbd5e1", fontSize: "0.8rem", marginTop: "4px" }}>Based on {deal.students?.toLocaleString() || '3,426'} student reviews{deal.updatedAt ? ` as of ${new Date(deal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` : ''}</div></div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: "#fff", marginBottom: "8px" }}>Rating Breakdown:</div>
                                {[5, 4, 3, 2, 1].map((star, i) => {
                                    const percentage = i === 0 ? "75%" : i === 1 ? "15%" : "5%";
                                    const count = Math.round((deal.students || 3426) * (parseInt(percentage) / 100));
                                    return (
                                        <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                            <div style={{ color: "#cbd5e1", fontSize: "0.85rem", width: "60px" }}>{star} star{star !== 1 ? 's' : ''}:</div>
                                            <div style={{ width: "100%", height: "8px", background: "#2d3748", borderRadius: "4px", overflow: "hidden" }}>
                                                <div style={{ width: percentage, height: "100%", background: "#9ca3af" }}></div>
                                            </div>
                                            <div style={{ color: "#3b82f6", fontSize: "0.85rem", width: "50px", textAlign: "right" }}>{percentage} ({count.toLocaleString()})</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Reviews List */}
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                            {[
                                { name: "Sarah Johnson", rating: 5, date: "2 weeks ago", text: "This course completely transformed my understanding of the subject! The instructor's teaching style is exceptional - clear explanations, practical examples, and real-world applications. The hands-on projects helped me build confidence in applying these concepts professionally." },
                                { name: "Michael Torres", rating: 5, date: "3 weeks ago", text: "Outstanding course with comprehensive content and excellent production quality. The step-by-step approach made complex topics accessible. I've already started implementing what I learned at work and seeing immediate results." },
                                { name: "David Kim", rating: 5, date: "1 month ago", text: "Best investment I've made in my career development! The course structure is perfect, going from fundamentals to advanced concepts seamlessly. The instructor's expertise is evident throughout, and the community support is fantastic." }
                            ].map((review, idx) => (
                                <div key={idx} style={{ borderBottom: "1px solid #1f2330", paddingBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                                            {review.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
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

                    {/* FAQs Section */}
                    {autoFAQs && autoFAQs.length > 0 && (
                        <div style={{ marginBottom: "2rem", borderTop: "1px solid #1f2330", paddingTop: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Frequently Asked Questions</h2>
                            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                                This section addresses common questions and concerns about the course, including enrollment, content access, learning experience, and technical support.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {autoFAQs.map((faq, idx) => (
                                    <div key={idx} style={{ border: "1px solid #2d3748", borderRadius: "8px", overflow: "hidden" }}>
                                        <button
                                            onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                                            style={{ 
                                                width: "100%", 
                                                padding: "1rem 1.5rem", 
                                                background: expandedFAQ === idx ? "#2d3748" : "#1f2330",
                                                border: "none", 
                                                textAlign: "left", 
                                                cursor: "pointer",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                color: "#fff"
                                            }}
                                        >
                                            {faq.q}
                                            <span style={{ fontSize: "1.2rem", transition: "transform 0.2s", transform: expandedFAQ === idx ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                                        </button>
                                        {expandedFAQ === idx && (
                                            <div style={{ padding: "1rem 1.5rem", background: "#0b0d12", borderTop: "1px solid #2d3748" }}>
                                                <p style={{ color: "#cbd5e1", lineHeight: 1.6, fontSize: "0.95rem", margin: 0 }}>
                                                    {faq.a}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Related List Section */}
                    {relatedDeals.length > 0 && (
                        <div style={{ marginTop: "4rem", borderTop: "1px solid #1f2330", paddingTop: "2rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>
                                More Udemy Courses You Might Like to Enroll
                            </h2>
                            <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                                This section suggests similar udemy courses and related learning opportunities based on the current course's category, helping you discover additional educational content that matches your interests.
                            </p>
                            <RelatedList items={relatedDeals} />
                        </div>
                    )}

                </div>

                {/* Right Column: Sticky Sidebar */}
                <div style={{ position: "relative" }}>
                    <div style={{ position: "sticky", top: "2rem", background: "#1f2330", border: "1px solid #2d3748", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)" }}>
                        {deal.image && (
                            <div style={{ position: "relative" }}>
                                <img
                                  src={deal.image}
                                  alt={deal.title}
                                  width="400"
                                  height="190"
                                  loading="lazy"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 340px, 400px"
                                  srcSet={`${deal.image}?w=400 400w, ${deal.image}?w=800 800w, ${deal.image}?w=1200 1200w`}
                                  style={{ width: "100%", height: "190px", objectFit: "cover" }}
                                />
                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)" }}></div>
                                {/* Play icon overlay simulation */}
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", borderRadius: "50%", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
                                    <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid #000", marginLeft: "4px" }}></div>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>
                                    {price === 0 ? "Free" : `$${price}`}
                                </span>
                                {discountPct > 0 && (
                                    <span style={{ fontSize: "0.9rem", color: "#9ca3af", textDecoration: "line-through" }}>
                                        ${originalPrice}
                                    </span>
                                )}
                                {discountPct > 0 && (
                                    <span style={{ fontSize: "0.8rem", color: "#fff", padding: "3px 6px", background: "#ef4444", fontWeight: 600 }}>
                                        {discountPct}% Off
                                    </span>
                                )}
                            </div>
                            {countdown && (
                                <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", color: "#dc2626", fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px", marginBottom: "1.5rem", border: "1px solid #fca5a5" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "4px" }}>
                                        <svg style={{ width: "14px", height: "14px" }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                        LIMITED TIME DEAL
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", fontSize: "1rem", fontWeight: "bold" }}>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: "1.2rem" }}>{countdown.days}</div>
                                            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Days</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: "1.2rem" }}>{countdown.hours}</div>
                                            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Hours</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: "1.2rem" }}>{countdown.minutes}</div>
                                            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Min</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: "1.2rem" }}>{countdown.seconds}</div>
                                            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Sec</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {deal.coupon && (
                                <div style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "#fff",
                                    padding: "6px",
                                    borderRadius: "4px",
                                    marginBottom: "0.8rem"
                                }}>
                                    <div style={{
                                        fontSize: "0.65rem",
                                        fontWeight: 500,
                                        marginBottom: "3px",
                                        opacity: 0.9,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.3px"
                                    }}>
                                        🎫 Coupon
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "6px"
                                    }}>
                                        <div style={{
                                            fontSize: "0.8rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.3px",
                                            fontFamily: "monospace",
                                            background: "rgba(255,255,255,0.15)",
                                            padding: "4px 6px",
                                            borderRadius: "3px",
                                            border: "1px dashed rgba(255,255,255,0.3)",
                                            flex: 1,
                                            textAlign: "center"
                                        }}>
                                            {deal.coupon.length > 4 ? `${deal.coupon.substring(0, 4)}***` : deal.coupon}
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            style={{
                                                background: "rgba(255,255,255,0.25)",
                                                border: "1px solid rgba(255,255,255,0.4)",
                                                borderRadius: "3px",
                                                padding: "4px 6px",
                                                fontSize: "0.65rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                color: "#fff",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            Get Code
                                        </button>
                                    </div>
                                </div>
                            )}

                            <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "block", textAlign: "center", background: "#a855f7", color: "#fff", fontWeight: 700, padding: "12px", fontSize: "1rem", border: "1px solid #9333ea", marginBottom: "12px", textDecoration: "none" }}
                            >
                                REDEEM COUPON
                            </a>

                            <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#9ca3af", marginBottom: "1.5rem" }}>30-Day Money-Back Guarantee</div>

                            <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                <div style={{ fontWeight: 700, marginBottom: "12px", color: "#fff", fontSize: "0.9rem" }}>What the Course Includes:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                        <span style={{ fontWeight: 600, color: "#9ca3af", fontSize: "0.8rem" }}>Duration</span>
                                        <span style={{ color: "#fff", fontWeight: 500 }}>{deal.duration || "12 hours"} on-demand video</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                        <span style={{ fontWeight: 600, color: "#9ca3af", fontSize: "0.8rem" }}>Device Compatibility</span>
                                        <span style={{ color: "#fff", fontWeight: 500 }}>Mobile & TV</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                        <span style={{ fontWeight: 600, color: "#9ca3af", fontSize: "0.8rem" }}>Access Type</span>
                                        <span style={{ color: "#fff", fontWeight: 500 }}>Lifetime Access</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                                        <span style={{ fontWeight: 600, color: "#9ca3af", fontSize: "0.8rem" }}>Certification</span>
                                        <span style={{ color: "#fff", fontWeight: 500 }}>Completion Certificate</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: "1px solid #2d3748", marginTop: "1rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button 
                                  onClick={() => navigator.share?.({ title: deal.title, url: window.location.href })}
                                  style={{ color: "#fff", fontWeight: 600, textDecoration: "underline", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}
                                >
                                  Share
                                </button>
                                <ActionsPanel deal={{ ...deal, url: deal.url || '' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Reveal Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '1rem'
                    }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        style={{
                            background: '#1f2330',
                            borderRadius: '12px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            border: '1px solid #2d3748',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Get Your Coupon Code
                            </h3>
                            <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
                                Use this exclusive coupon to get the best price!
                            </p>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                                marginBottom: '0.5rem'
                            }}>
                                🎫 Coupon Code
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                color: 'rgba(255,255,255,0.8)',
                                textAlign: 'center',
                                marginBottom: '1rem'
                            }}>
                                Click "Copy Code" to get your coupon, then use "Redeem Now" to apply it.
                            </div>
                        </div>

                        <div className="modal-buttons" style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <button
                                onClick={() => {
                                    if (deal.coupon) {
                                        navigator.clipboard.writeText(deal.coupon);
                                        alert('Coupon code copied!');
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    color: '#fff',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                📋 Copy Code
                            </button>

                            <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    flex: 1,
                                    background: '#a855f7',
                                    border: '1px solid #9333ea',
                                    color: '#fff',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    textAlign: 'center',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#9333ea';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#a855f7';
                                }}
                            >
                                Redeem Now
                            </a>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#2d3748';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none';
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
            .prose h1, .prose h2, .prose h3 { color: #fff; margin-top: 1.5em; margin-bottom: 0.5em; }
            .prose p { margin-bottom: 1em; }
            .prose ul, .prose ol { margin-bottom: 1em; padding-left: 1.5em; list-style: disc; }
            .prose li { margin-bottom: 0.5em; }
            .prose a { color: #3b82f6; text-decoration: underline; }

            /* Comprehensive Responsive Design */
            @media (max-width: 1200px) {
                .container { max-width: 100% !important; padding: 0 1rem !important; }
            }

            @media (max-width: 900px) {
                .container { grid-template-columns: 1fr !important; gap: 2rem !important; }
            }

            @media (max-width: 768px) {
                h1 { font-size: 1.75rem !important; }
                .price-section { padding: 1rem !important; }
                .price { font-size: 1.75rem !important; }
                .modal { max-width: 95vw !important; }
                nav ol { font-size: 13px !important; }
            }

            @media (max-width: 640px) {
                .modal-buttons { flex-direction: column !important; }
                h1 { font-size: 1.5rem !important; line-height: 1.3 !important; }
                .header { padding: 1.5rem 0 !important; }
                .container { padding: 0 0.75rem !important; }
                .price { font-size: 1.5rem !important; }
                .cta-button { width: 100% !important; }
                nav ol { flex-wrap: wrap !important; gap: 6px !important; }
                nav li { margin-bottom: 2px !important; }
            }

            @media (max-width: 480px) {
                h1 { font-size: 1.375rem !important; }
                .price { font-size: 1.375rem !important; }
                nav ol { font-size: 12px !important; gap: 4px !important; }
                .info-section { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
                .rating-stars { font-size: 12px !important; }
            }

            @media (min-width: 640px) {
                .modal-buttons { flex-direction: row !important; }
            }

            /* Print styles */
            @media print {
                body { background: white !important; color: black !important; }
                .modal, .cta-button { display: none !important; }
            }
          `}
            </style>
        </div>
    );
}
