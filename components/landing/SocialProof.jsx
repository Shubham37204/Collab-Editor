"use client";

export default function SocialProof() {
  return (
    <section className="py-12 border-y border-border/40 bg-background/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-sans font-bold text-muted uppercase tracking-[0.2em] mb-8">
          Loved by developers worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Using text-based logos/placeholders for speed and reliability */}
          <div className="text-xl font-black font-sans tracking-tighter">GITHUB</div>
          <div className="text-xl font-black font-sans tracking-tighter">VERCEL</div>
          <div className="text-xl font-black font-sans tracking-tighter">CONVEX</div>
          <div className="text-xl font-black font-sans tracking-tighter">LIVEBLOCKS</div>
          <div className="text-xl font-black font-sans tracking-tighter">CLERK</div>
        </div>
      </div>
    </section>
  );
}
