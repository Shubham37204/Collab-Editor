"use client";
import { useRouter } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  const theme = {
    bg: dark ? "#0a0a0a" : "#fafaf8",
    text: dark ? "#f0ede8" : "#1a1816",
    muted: dark ? "#6b6560" : "#9b9189",
    card: dark ? "#141414" : "#ffffff",
    border: dark ? "#252525" : "#e8e4de",
    accent: dark ? "#c9a96e" : "#b8935a",
    accentHover: dark ? "#d4b882" : "#a07840",
    badge: dark ? "#1e1c1a" : "#f0ede8",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 48px",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: "700",
            fontSize: "18px",
            letterSpacing: "-0.3px",
            color: theme.text,
          }}
        >
          CollabDocs
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isSignedIn && (
            <span
              style={{
                fontSize: "13px",
                color: theme.muted,
                fontFamily: "sans-serif",
              }}
            >
              {user?.firstName}
            </span>
          )}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: theme.badge,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "12px",
              cursor: "pointer",
              color: theme.muted,
              fontFamily: "sans-serif",
              letterSpacing: "0.5px",
              transition: "all 0.2s ease",
            }}
          >
            {dark ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "120px 32px 80px",
          textAlign: "center",
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "inline-block",
            background: theme.badge,
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            padding: "5px 14px",
            fontSize: "11px",
            fontFamily: "sans-serif",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: theme.muted,
            marginBottom: "36px",
          }}
        >
          Real-time collaboration
        </div>

        <h1
          style={{
            fontSize: "clamp(52px, 8vw, 88px)",
            fontWeight: "400",
            lineHeight: "1.05",
            letterSpacing: "-3px",
            marginBottom: "28px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Write together,
          <br />
          <em style={{ fontStyle: "italic", color: theme.accent }}>
            think together.
          </em>
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: theme.muted,
            lineHeight: "1.7",
            marginBottom: "52px",
            maxWidth: "480px",
            margin: "0 auto 52px",
            fontFamily: "sans-serif",
            fontWeight: "400",
          }}
        >
          Collaborative markdown editing with live cursors and real-time sync.
          Built for teams who think in writing.
        </p>

        {/* CTA */}
        {!isSignedIn && (
          <SignInButton mode="modal">
            <button
              style={{
                background: theme.accent,
                color: "#fff",
                border: "none",
                padding: "16px 40px",
                fontSize: "15px",
                fontFamily: "sans-serif",
                fontWeight: "500",
                borderRadius: "6px",
                cursor: "pointer",
                letterSpacing: "0.2px",
                transition: "background 0.2s ease, transform 0.1s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.accentHover;
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme.accent;
                e.target.style.transform = "translateY(0)";
              }}
            >
              Start writing free →
            </button>
          </SignInButton>
        )}
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "0 32px",
          borderTop: `1px solid ${theme.border}`,
        }}
      />

      {/* Features */}
      <section
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "64px 32px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0",
        }}
      >
        {[
          {
            num: "01",
            title: "Real-time sync",
            desc: "Every keystroke propagated instantly across all collaborators.",
          },
          {
            num: "02",
            title: "Live cursors",
            desc: "See exactly where your teammates are writing in real time.",
          },
          {
            num: "03",
            title: "Secure auth",
            desc: "Enterprise-grade authentication powered by Clerk.",
          },
        ].map((f, i) => (
          <div
            key={f.num}
            style={{
              padding: "32px 28px",
              borderRight: i < 2 ? `1px solid ${theme.border}` : "none",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontFamily: "sans-serif",
                letterSpacing: "1px",
                color: theme.accent,
                display: "block",
                marginBottom: "16px",
              }}
            >
              {f.num}
            </span>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "600",
                fontFamily: "sans-serif",
                marginBottom: "8px",
                color: theme.text,
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: theme.muted,
                lineHeight: "1.65",
                fontFamily: "sans-serif",
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
