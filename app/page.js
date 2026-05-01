"use client";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useTheme } from "./layout";



const FEATURES = [
  {
    num: "01",
    title: "Real-time sync",
    desc: "Every keystroke propagated instantly across all collaborators with zero latency via Yjs CRDTs.",
    icon: "⚡",
    iconBg: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    num: "02",
    title: "Live cursors",
    desc: "See exactly where your teammates are writing in real time, making pair writing seamless.",
    icon: "✨",
    iconBg: "bg-orange-500/10",
    hoverBorder: "hover:border-orange-500/40",
  },
  {
    num: "03",
    title: "Markdown support",
    desc: "Write seamlessly with familiar markdown syntax and see the results instantly in the split preview.",
    icon: "📝",
    iconBg: "bg-green-500/10",
    hoverBorder: "hover:border-green-500/40",
  },
];

const STEPS = [
  { step: "1", title: "Create", desc: "Start a new document or pick a template", color: "text-blue-500 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500" },
  { step: "2", title: "Write", desc: "Rich markdown editing with live preview", color: "text-orange-500 bg-orange-500/10 border-orange-500/20 group-hover:bg-orange-500" },
  { step: "3", title: "Collaborate", desc: "Share and edit together in real time", color: "text-green-500 bg-green-500/10 border-green-500/20 group-hover:bg-green-500" },
];

export default function HomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { dark, setDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-yellow-400/10 rounded-full blur-3xl opacity-60 -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

      {/* Header */}
      <header className={`flex justify-between items-center px-8 md:px-12 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-border/60 glass' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-foreground">
            CollabDocs
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDark(!dark)}
            className="bg-badge border border-border rounded-full px-4 py-1.5 text-xs font-sans text-muted hover:text-foreground hover:border-muted transition-all duration-200 cursor-pointer"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="bg-primary text-white border-none px-5 py-2 text-sm font-sans font-medium rounded-lg cursor-pointer hover:bg-primary-hover transition-colors duration-200">
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-badge border border-border rounded-full px-4 py-1.5 text-xs font-sans tracking-widest uppercase text-muted mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Real-time collaboration
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8 font-sans">
          Write together, <br />
          <em className="italic text-primary">think together.</em>
        </h1>

        <p className="text-lg md:text-xl text-muted leading-relaxed mb-12 max-w-2xl mx-auto font-sans font-light">
          Collaborative markdown editing with live cursors, AI-powered writing, and real-time sync.
          Built for teams who think in writing.
        </p>

        {!isSignedIn && (
          <SignInButton mode="modal">
            <button className="bg-primary text-white border-none px-8 py-4 text-base font-sans font-medium rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 active:translate-y-0 cursor-pointer">
              Start writing for free →
            </button>
          </SignInButton>
        )}
      </section>



      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.num}
              className={`bg-card border border-border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group shadow-sm hover:shadow-md ${f.hoverBorder}`}
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{f.icon}</span>
              </div>
              <h3 className="text-xl font-sans font-bold mb-3 text-foreground tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed font-sans">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-xs font-sans text-primary tracking-widest uppercase font-medium text-center mb-3">
          How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-14 tracking-tight">
          Simple. Powerful. Collaborative.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="text-center group">
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-4 font-sans font-bold text-lg group-hover:text-white transition-all duration-300 ${s.color}`}>
                {s.step}
              </div>
              <h4 className="font-sans font-semibold text-foreground text-lg mb-2">{s.title}</h4>
              <p className="text-sm text-muted font-sans">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Engineering */}
      <section className="max-w-5xl mx-auto px-6 py-20 mb-10 bg-badge/30 rounded-3xl border border-border/50">
        <div className="text-center mb-12">
          <p className="text-xs font-sans text-primary tracking-widest uppercase font-bold mb-3">
            Developer First
          </p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4 tracking-tight">
            Built on a modern stack.
          </h2>
          <p className="text-muted font-sans max-w-xl mx-auto">
            CollabDocs leverages state-of-the-art technologies to ensure zero-latency collaboration and complete data integrity.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { name: "Next.js 14", desc: "App Router & Server Components" },
            { name: "Yjs CRDT", desc: "Zero-conflict resolution" },
            { name: "Liveblocks", desc: "WebSocket infrastructure" },
            { name: "Convex", desc: "Real-time database" },
          ].map((tech) => (
            <div key={tech.name} className="p-4 bg-background border border-border hover:border-blue-500/30 transition-colors rounded-xl shadow-sm">
              <h4 className="font-sans font-bold text-foreground mb-1">{tech.name}</h4>
              <p className="text-xs text-muted font-sans">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-border/40 text-sm text-muted font-sans">
        © {new Date().getFullYear()} CollabDocs. Built with Next.js, Liveblocks & Convex.
      </footer>
    </main>
  );
}
