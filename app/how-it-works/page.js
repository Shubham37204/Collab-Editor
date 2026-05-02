"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/landing/Navbar";
import HowItWorks from "../../components/landing/HowItWorks";
import Footer from "../../components/landing/Footer";
import CTA from "../../components/landing/CTA";
import ScrollToTop from "../../components/landing/ScrollToTop";

export default function HowItWorksPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-primary/30 via-orange-500/10 to-transparent rounded-full blur-[100px] opacity-70 -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[100px] opacity-50 -z-10 pointer-events-none" />

      <Navbar scrolled={scrolled} />
      
      <div className="pt-20">
        <HowItWorks />
      </div>

      {/* Additional Detail Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground font-sans tracking-tight mb-6">
              Why collaboration <span className="text-primary">matters.</span>
            </h2>
            <p className="text-lg text-muted font-sans font-medium leading-relaxed mb-6">
              In today's fast-paced world, speed is everything. CollabDocs eliminates the friction of traditional document editing, allowing you to focus on what matters most: your content.
            </p>
            <ul className="space-y-4">
              {[
                "Instant feedback loops",
                "Reduced context switching",
                "Single source of truth",
                "Seamless team alignment",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-sans font-bold">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-[2rem] aspect-video flex items-center justify-center text-6xl">
            🤝
          </div>
        </div>
      </section>

      <CTA />
      
      <Footer />
      <ScrollToTop />
    </main>
  );
}
