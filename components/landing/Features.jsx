"use client";

const FEATURES = [
  {
    title: "Real-time sync",
    desc: "Every keystroke propagated instantly across all collaborators with zero latency via Yjs CRDTs.",
    icon: "⚡",
    color: "from-blue-500/20 to-transparent",
  },
  {
    title: "Live cursors",
    desc: "See exactly where your teammates are writing in real time, making pair writing seamless.",
    icon: "✨",
    color: "from-orange-500/20 to-transparent",
  },
  {
    title: "Markdown support",
    desc: "Write seamlessly with familiar markdown syntax and see the results instantly.",
    icon: "📝",
    color: "from-green-500/20 to-transparent",
  },
  {
    title: "Instant sharing",
    desc: "Invite collaborators with a single link. No complex permissions or setup required.",
    icon: "🔗",
    color: "from-purple-500/20 to-transparent",
  },
  {
    title: "Multi-device sync",
    desc: "Access your documents from any device. Your work is always where you need it.",
    icon: "📱",
    color: "from-pink-500/20 to-transparent",
  },
  {
    title: "Rich text support",
    desc: "Format your content with ease using our intuitive rich text editing capabilities.",
    icon: "🎨",
    color: "from-cyan-500/20 to-transparent",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-foreground font-sans tracking-tight mb-4">
          Everything you need to <span className="text-primary">create together.</span>
        </h2>
        <p className="text-lg text-muted font-sans max-w-2xl mx-auto font-medium">
          Powerful features designed to make collaboration feel natural and fast.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, i) => (
          <div 
            key={i}
            className="glass-panel rounded-3xl p-8 flex flex-col group hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 relative z-10 group-hover:scale-110 transition-transform">
              <span className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                {feature.icon}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-sans font-bold mb-3 text-foreground tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed font-sans font-medium">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
