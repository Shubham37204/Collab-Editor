"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Is CollabDocs really free?",
    a: "Yes! The core features of CollabDocs are completely free for individual creators and small teams. We believe in open collaboration.",
  },
  {
    q: "How secure is my data?",
    a: "Your documents are stored securely using Convex and Liveblocks. We use industry-standard encryption and never share your data with third parties.",
  },
  {
    q: "Can I use it offline?",
    a: "Currently, CollabDocs requires an internet connection for real-time sync. However, your changes are cached locally and synced as soon as you're back online.",
  },
  {
    q: "Do I need an account to view a document?",
    a: "Yes! To ensure security and track collaboration, you'll need a free account to view or share documents. This helps us keep your data safe and private.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-foreground font-sans tracking-tight mb-4">
          Frequently Asked <span className="text-primary">Questions.</span>
        </h2>
        <p className="text-lg text-muted font-sans font-medium">
          Everything you need to know about CollabDocs.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div 
            key={i} 
            className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
              openIndex === i ? 'border-primary/40' : 'hover:border-primary/20'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-8 py-6 flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-lg font-sans font-bold text-foreground">
                {faq.q}
              </span>
              <div className={`w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center transition-transform duration-300 ${
                openIndex === i ? 'rotate-180 bg-primary/10' : ''
              }`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </button>
            
            <div className={`px-8 transition-all duration-300 ease-in-out ${
              openIndex === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <p className="text-muted font-sans font-medium leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
