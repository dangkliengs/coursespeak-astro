"use client";

export default function NewsletterSignupCard() {
  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(140deg, rgba(11, 13, 18, 0.98) 0%, rgba(18, 24, 40, 0.98) 55%, rgba(42, 64, 110, 0.38) 100%)",
        borderColor: "rgba(91, 140, 255, 0.24)",
        boxShadow: "0 12px 28px rgba(8, 12, 26, 0.45)",
        display: "grid",
        gap: 12,
      }}
    >
      <div className="card-body" style={{ gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                background: "rgba(91, 140, 255, 0.18)",
                color: "var(--brand)",
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Stay in the loop
            </span>
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 20 }}>Get the freshest Udemy coupons</h3>
          <p className="muted" style={{ margin: 0 }}>
            Join 150,000+ learners receiving weekly Udemy free coupons, 100% off deals, and handpicked guides from Coursespeak.
          </p>
        </div>
        <form
          action="https://buttondown.com/api/emails/embed-subscribe/coursespeak"
          method="post"
          style={{ display: "grid", gap: 8 }}
        >
          <label htmlFor="newsletter-email" className="muted" style={{ fontSize: 12 }}>
            Enter your email to subscribe
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={{
                flex: 1,
                minWidth: 220,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(91, 140, 255, 0.32)",
                background: "rgba(11, 13, 18, 0.86)",
                color: "#eaf4ff",
              }}
              aria-label="Email address"
            />
            <button
              type="submit"
              className="btn"
              style={{
                background: "linear-gradient(135deg, #5b8cff 0%, #60efff 90%)",
                color: "#05060b",
                border: "none",
                minWidth: 140,
                boxShadow: "0 6px 16px rgba(91, 140, 255, 0.38)",
              }}
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
