"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div className="text-left">
          <h1 className="text-5xl md:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-6 font-sans text-foreground">
            One editor.<br />
            <span className="text-primary">Endless collaboration.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-lg font-sans font-medium">
            From writing code to drafting documentation — your all-in-one collaborative workspace. No switching tabs, no lost data.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto bg-primary text-white border-none px-8 py-4 text-base font-sans font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] transition-all duration-300 cursor-pointer">
                  Start collaborating →
                </button>
              </SignInButton>
            ) : (
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto bg-primary text-white border-none px-8 py-4 text-base font-sans font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/50 via-orange-300/50 to-green-200/50 dark:from-yellow-500/20 dark:via-orange-500/20 dark:to-green-500/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl z-20 shadow-orange-500/30">
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
  );
}
