"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" />
              <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
              <path d="M3 7l9-4 9 4" />
              <path d="M10 12l4 4" />
              <path d="M14 12l-4 4" />
            </svg>
          </div>
          <span className="font-sans font-black text-xl tracking-tighter text-foreground">
            CollabDocs
          </span>
        </div>
        
        <div className="text-sm text-muted font-sans font-medium">
          © {new Date().getFullYear()} CollabDocs. Built with Next.js, Liveblocks & Convex.
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted hover:text-primary transition-colors font-sans font-medium no-underline">Twitter</a>
          <a href="#" className="text-sm text-muted hover:text-primary transition-colors font-sans font-medium no-underline">GitHub</a>
          <a href="#" className="text-sm text-muted hover:text-primary transition-colors font-sans font-medium no-underline">Discord</a>
        </div>
      </div>
    </footer>
  );
}
