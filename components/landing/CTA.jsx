"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="glass-panel rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        
        <p className="text-xs font-sans text-primary font-bold tracking-widest uppercase mb-6">
          READY TO START?
        </p>
        <h2 className="text-4xl md:text-6xl font-black text-foreground font-sans tracking-tight mb-8">
          Build your next big idea <br /> <span className="text-primary">together.</span>
        </h2>
        <p className="text-xl text-muted font-sans mb-12 max-w-2xl mx-auto font-medium">
          Join thousands of developers and creators who use CollabDocs to ship faster and better.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto bg-primary text-white border-none px-10 py-5 text-lg font-sans font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  Start collaborating →
                </button>
              </SignInButton>
            </>
          ) : (
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-primary text-white border-none px-10 py-5 text-lg font-sans font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Go to Dashboard →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
