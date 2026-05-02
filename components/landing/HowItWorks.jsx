"use client";

const STEPS = [
  {
    num: "01",
    title: "Create",
    desc: "Start a new document with one click. Choose from templates or start fresh.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Write",
    desc: "Experience smooth markdown editing with live preview and syntax highlighting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Collaborate",
    desc: "Share your link and work together in real-time with live cursors and sync.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground font-sans tracking-tight mb-4">
            How it <span className="text-primary">works.</span>
          </h2>
          <p className="text-lg text-muted font-sans max-w-2xl mx-auto font-medium">
            Three simple steps to seamless collaboration.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 z-0">
            <div className="w-full h-full border-t-2 border-dashed border-primary/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 relative z-10">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center text-4xl shadow-[0_8px_30px_rgba(249,115,22,0.3)] mb-8 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center font-black text-primary text-sm font-sans">
                    {step.num}
                  </div>
                </div>
                
                <h3 className="text-2xl font-sans font-black mb-4 text-foreground tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted leading-relaxed font-sans font-medium max-w-xs">
                  {step.desc}
                </p>

                {/* Arrow (Mobile/Tablet) */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden mt-12 text-primary/30">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Arrows (Desktop) */}
          <div className="hidden lg:block">
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 text-primary/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 text-primary/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
