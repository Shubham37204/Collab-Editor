"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import SocialProof from "../components/landing/SocialProof";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import ScrollToTop from "../components/landing/ScrollToTop";

export default function HomePage() {
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
      
      <Hero />
      
      <SocialProof />
      
      <Features />
      
      <HowItWorks />
      
      <FAQ />
      
      <CTA />
      
      <Footer />
      <ScrollToTop />
    </main>
  );
}
