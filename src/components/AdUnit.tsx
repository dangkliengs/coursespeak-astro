"use client";
import { useEffect, useRef } from "react";

type Variant = "display" | "multiplex" | "infeed" | "inarticle";

interface AdUnitProps {
  variant?: Variant;
  slot?: string;
  publisher?: string;
  className?: string;
  layoutKey?: string;
  lazy?: boolean;
  minHeight?: number;
}

const DEFAULT_CLIENT = "ca-pub-8220442576502761";
const DISPLAY_SLOT = "2951964915";
const MULTIPLEX_SLOT = "7774760180";
const INFEED_SLOT = "1297905186";
const INARTICLE_SLOT = "1600982501";
const DEFAULT_INFEED_LAYOUT_KEY = "-5p+ce-n-65+pn";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * React version of AdSlot.astro for client-rendered DealPage.
 * variant="display" | "multiplex" | "infeed" | "inarticle"
 * Reserves space (anti-CLS) + lazy-pushes via IntersectionObserver.
 * NOTE: the adsbygoogle.js library is loaded once in Layout.astro — do not
 * paste the <script async src=...> library tag per unit.
 */
export default function AdUnit({
  variant = "display",
  slot,
  publisher = DEFAULT_CLIENT,
  className = "",
  layoutKey = DEFAULT_INFEED_LAYOUT_KEY,
  lazy = true,
  minHeight,
}: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  const resolvedSlot =
    slot ??
    (variant === "multiplex"
      ? MULTIPLEX_SLOT
      : variant === "infeed"
        ? INFEED_SLOT
        : variant === "inarticle"
          ? INARTICLE_SLOT
          : DISPLAY_SLOT);

  const adFormat =
    variant === "multiplex"
      ? "autorelaxed"
      : variant === "display"
        ? "auto"
        : "fluid";

  const resolvedMinHeight =
    minHeight ?? (variant === "multiplex" ? 400 : variant === "infeed" ? 250 : 280);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || pushedRef.current) return;
    const ins = container.querySelector("ins.adsbygoogle");
    if (!ins) return;

    const push = () => {
      if (pushedRef.current) return;
      pushedRef.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* AdSense not loaded yet (adblock) — fail silently */
      }
    };

    if (!lazy || !("IntersectionObserver" in window)) {
      push();
      return;
    }

    try {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.2) {
        push();
        return;
      }
    } catch {
      /* ignore */
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            push();
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(container);
    return () => io.disconnect();
  }, [lazy, resolvedSlot, variant]);

  if (!resolvedSlot) return null;

  return (
    <div
      ref={containerRef}
      className={`ad-slot-react ad-slot-react-${variant} ${className}`}
      aria-label="Advertisement"
      style={{
        margin: "2rem auto",
        textAlign: "center",
        maxWidth: "100%",
        minHeight: resolvedMinHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(212, 167, 55, 0.03)",
        border: "1px dashed rgba(212, 167, 55, 0.15)",
        borderRadius: 12,
        padding: "12px 8px 8px",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: 6,
        }}
      >
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minHeight: variant === "multiplex" ? 350 : 250,
          textAlign: variant === "inarticle" ? "center" : undefined,
        }}
        data-ad-client={publisher}
        data-ad-slot={resolvedSlot}
        data-ad-format={adFormat}
        {...(variant === "inarticle" ? { "data-ad-layout": "in-article" } : {})}
        {...(variant === "infeed" && layoutKey
          ? { "data-ad-layout-key": layoutKey }
          : {})}
        {...(variant === "display"
          ? { "data-full-width-responsive": "true" }
          : {})}
      />
    </div>
  );
}
