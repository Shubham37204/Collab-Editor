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

const TESTIMONIALS = [
  { name: "Sarah Jenkins", role: "Engineering Manager", quote: "The zero-latency sync is genuinely mind-blowing. It feels like we're finally using a modern editor." },
  { name: "David Chen", role: "Senior Developer", quote: "Being able to write Markdown collaboratively without switching context is exactly what our team needed." },
  { name: "Elena Rodriguez", role: "Product Lead", quote: "CollabDocs replaced three different tools for us. The UI is gorgeous and incredibly fast." },
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
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-primary/30 via-blue-500/20 to-transparent rounded-full blur-[100px] opacity-70 -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-green-500/20 to-transparent rounded-full blur-[100px] opacity-50 -z-10 pointer-events-none" />

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
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="text-left">
            <h1 className="text-5xl md:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-6 font-sans text-foreground">
              One editor.<br />
              <span className="text-[#f97316]">Endless collaboration.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-lg font-sans font-medium">
              From writing code to drafting documentation — your all-in-one collaborative workspace. No switching tabs, no lost data.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto bg-[#f97316] text-white border-none px-8 py-4 text-base font-sans font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-[#ea580c] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] transition-all duration-300 cursor-pointer">
                    Start for free →
                  </button>
                </SignInButton>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto bg-[#f97316] text-white border-none px-8 py-4 text-base font-sans font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-[#ea580c] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  Go to Dashboard →
                </button>
              )}
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-transparent border-2 border-border text-foreground px-8 py-3.5 text-base font-sans font-bold rounded-xl hover:border-muted transition-colors cursor-pointer"
              >
                See features
              </button>
            </div>
            
            {/* Avatars */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">A</div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">B</div>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">C</div>
                <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">D</div>
              </div>
              <span className="text-sm font-sans text-muted">Built for curious minds, developers & creators</span>
            </div>
          </div>

          {/* Right Column (Graphic) */}
          <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
            {/* Soft Gradient Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/50 via-orange-300/50 to-green-200/50 dark:from-yellow-500/20 dark:via-orange-500/20 dark:to-green-500/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl" />
            
            {/* Center Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#f97316] rounded-2xl flex items-center justify-center shadow-2xl z-20 shadow-orange-500/30">
              <span className="text-3xl text-white">✨</span>
            </div>
            
            {/* Floating Icons */}
            <div className="absolute top-1/4 left-1/4 w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center shadow-lg animate-bounce z-10" style={{ animationDuration: '3s' }}>
              <span className="text-xl text-red-500">🛡️</span>
            </div>
            <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shadow-lg animate-bounce z-10" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <span className="text-lg text-blue-500 font-bold font-mono">{'</>'}</span>
            </div>
            <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shadow-lg animate-bounce z-10" style={{ animationDuration: '3.5s', animationDelay: '2s' }}>
              <span className="text-lg text-cyan-500">🎵</span>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center shadow-lg animate-bounce z-10" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
              <span className="text-xl text-green-500">📷</span>
            </div>
            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shadow-lg animate-bounce z-10" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
              <span className="text-lg text-purple-500">⚔️</span>
            </div>
            <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center shadow-lg animate-bounce z-10" style={{ animationDuration: '3.5s', animationDelay: '2.5s' }}>
              <span className="text-base text-pink-500">✒️</span>
            </div>
          </div>
        </div>
      </section>



      {/* Bento Grid Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
          {/* Feature 1 - Large */}
          <div className="md:col-span-2 md:row-span-2 glass-panel rounded-3xl p-10 flex flex-col justify-end group hover:border-blue-500/40 transition-colors min-h-[400px] relative overflow-hidden">
            <div className="absolute top-8 right-8 w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
              <span className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">⚡</span>
            </div>
            <div>
              <h3 className="text-3xl font-sans font-bold mb-4 text-foreground tracking-tight">Real-time sync</h3>
              <p className="text-lg text-muted leading-relaxed font-sans max-w-sm">Every keystroke propagated instantly across all collaborators with zero latency via Yjs CRDTs.</p>
            </div>
          </div>
          {/* Feature 2 - Top Right */}
          <div className="md:col-span-2 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-end group hover:border-orange-500/40 transition-colors min-h-[200px] relative overflow-hidden">
            <div className="absolute top-6 right-6 w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
              <span className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">✨</span>
            </div>
            <div>
              <h3 className="text-2xl font-sans font-bold mb-2 text-foreground tracking-tight">Live cursors</h3>
              <p className="text-sm text-muted leading-relaxed font-sans max-w-xs">See exactly where your teammates are writing in real time, making pair writing seamless.</p>
            </div>
          </div>
          {/* Feature 3 - Bottom Right */}
          <div className="md:col-span-2 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-end group hover:border-green-500/40 transition-colors min-h-[200px] relative overflow-hidden">
            <div className="absolute top-6 right-6 w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
              <span className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">📝</span>
            </div>
            <div>
              <h3 className="text-2xl font-sans font-bold mb-2 text-foreground tracking-tight">Markdown support</h3>
              <p className="text-sm text-muted leading-relaxed font-sans max-w-xs">Write seamlessly with familiar markdown syntax and see the results instantly.</p>
            </div>
          </div>
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

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-16 tracking-tight">
          Loved by engineering teams.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass-panel rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <p className="text-muted font-sans leading-relaxed mb-8">"{t.quote}"</p>
              <div>
                <p className="font-sans font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted font-sans uppercase tracking-wider mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Engineering */}
      <section className="max-w-6xl mx-auto px-6 py-24 mb-10">
        <div className="glass-panel rounded-3xl p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <p className="text-xs font-sans text-primary tracking-widest uppercase font-bold mb-4">
              Developer First
            </p>
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 tracking-tight">
              Built on a modern stack.
            </h2>
            <p className="text-lg text-muted font-sans max-w-2xl mx-auto mb-16">
              CollabDocs leverages state-of-the-art technologies to ensure zero-latency collaboration and complete data integrity.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Next.js 14", desc: "App Router & Server Components" },
                { name: "Yjs CRDT", desc: "Zero-conflict resolution" },
                { name: "Liveblocks", desc: "WebSocket infrastructure" },
                { name: "Convex", desc: "Real-time database" },
              ].map((tech) => (
                <div key={tech.name} className="glow-border bg-card/40 backdrop-blur-sm border border-border/50 p-6 rounded-2xl hover:bg-card/80 transition-colors text-left">
                  <h4 className="font-sans font-bold text-lg text-foreground mb-2">{tech.name}</h4>
                  <p className="text-sm text-muted font-sans">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sign-in Banner Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 mb-10">

        {/* Get In Touch */}
        <div className="text-center mt-20 mb-10">
          <p className="text-xs font-sans text-[#ea580c] font-bold tracking-widest uppercase mb-4">
            GET IN TOUCH
          </p>
          <h3 className="text-3xl font-black text-foreground font-sans tracking-tight mb-3">
            Have questions or ideas?
          </h3>
          <p className="text-muted font-sans mb-8">
            Open source project — contributions and feedback always welcome.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://github.com/shubham37204/collab-editor" 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#0f172a] text-white border-none px-6 py-3 text-sm font-sans font-bold rounded-xl hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2 no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              View on GitHub
            </a>
            <a 
              href="mailto:contact@collabdocs.com"
              className="w-full sm:w-auto bg-transparent border border-border text-foreground px-6 py-3 text-sm font-sans font-bold rounded-xl hover:border-muted transition-colors cursor-pointer flex items-center justify-center gap-2 no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Send an email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-border/40 text-sm text-muted font-sans">
        © {new Date().getFullYear()} CollabDocs. Built with Next.js, Liveblocks & Convex.
      </footer>
    </main>
  );
}
