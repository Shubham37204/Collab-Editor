"use client";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { useTheme } from "../../app/layout";

export default function Navbar({ scrolled }) {
  const { dark, setDark } = useTheme();
  const { isSignedIn } = useUser();

  return (
    <header className={`flex justify-between items-center px-8 md:px-12 py-4 relative z-50 transition-all duration-300 ${
      !scrolled ? 'border-b-2 border-primary/40 glass' : 'bg-transparent'
    }`}>
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" />
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
            <path d="M3 7l9-4 9 4" />
            <path d="M10 12l4 4" />
            <path d="M14 12l-4 4" />
          </svg>
        </div>
        <span className="font-sans font-black text-2xl tracking-tighter text-foreground">
          CollabDocs
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-2 bg-badge border border-border rounded-xl px-4 py-2 text-sm font-sans font-bold text-muted hover:text-foreground hover:border-primary/50 transition-all duration-200 cursor-pointer group"
        >
          {dark ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 group-hover:rotate-45 transition-transform duration-500">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 group-hover:-rotate-12 transition-transform duration-500">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="bg-primary text-white border-none px-5 py-2 text-sm font-sans font-medium rounded-lg cursor-pointer hover:bg-primary-hover transition-colors duration-200">
              Get Started
            </button>
          </SignInButton>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </header>
  );
}
