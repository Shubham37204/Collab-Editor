"use client";
import { useEffect } from "react";

const SHORTCUTS = [
  {
    category: "Document",
    items: [
      { keys: ["Ctrl", "S"], label: "Save document" },
      { keys: ["Ctrl", "Shift", "P"], label: "Toggle preview" },
      { keys: ["Ctrl", "Shift", "F"], label: "Toggle focus mode" },
    ],
  },
  {
    category: "Formatting",
    items: [
      { keys: ["Ctrl", "B"], label: "Bold" },
      { keys: ["Ctrl", "I"], label: "Italic" },
      { keys: ["/"], label: "Slash commands" },
    ],
  },
  {
    category: "AI",
    items: [{ keys: ["Select text"], label: "Show AI toolbar" }],
  },
  {
    category: "Navigation",
    items: [
      { keys: ["Esc"], label: "Close panels / exit focus" },
      { keys: ["?"], label: "Show this help" },
    ],
  },
];

export default function ShortcutsModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-auto animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-lg font-normal m-0 text-foreground">
            Keyboard shortcuts
          </h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-muted text-lg cursor-pointer hover:text-foreground transition-colors duration-150"
          >
            ×
          </button>
        </div>

        {/* Categories */}
        {SHORTCUTS.map((group) => (
          <div key={group.category} className="mb-6">
            <p className="text-[10px] font-sans text-primary tracking-wider uppercase font-medium mb-2.5">
              {group.category}
            </p>
            {group.items.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-1.5 border-b border-border"
              >
                <span className="text-sm font-sans text-foreground">
                  {item.label}
                </span>
                <div className="flex gap-1 items-center">
                  {item.keys.map((k, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <kbd className="bg-badge border border-border rounded px-1.5 py-0.5 text-xs font-mono text-foreground">
                        {k}
                      </kbd>
                      {i < item.keys.length - 1 && (
                        <span className="text-[10px] text-muted">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
