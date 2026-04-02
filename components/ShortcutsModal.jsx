// ═══════════════════════════════════════════════════
// FEATURE: Keyboard shortcuts reference modal
// Triggered by pressing ? anywhere in the editor
// ═══════════════════════════════════════════════════

"use client";
import { useTheme } from "../app/layout";
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
  const { theme } = useTheme();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const Key = ({ children }) => (
    <kbd
      style={{
        background: theme.badge,
        border: `1px solid ${theme.border}`,
        borderRadius: "4px",
        padding: "2px 7px",
        fontSize: "11px",
        fontFamily: "monospace",
        color: theme.text,
        display: "inline-block",
      }}
    >
      {children}
    </kbd>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: "14px",
          padding: "32px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontFamily: theme.serif,
              fontSize: "18px",
              fontWeight: "400",
              margin: 0,
              color: theme.text,
            }}
          >
            Keyboard shortcuts
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: theme.muted,
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Shortcut categories */}
        {SHORTCUTS.map((group) => (
          <div key={group.category} style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "10px",
                fontFamily: theme.sans,
                color: theme.accent,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: "500",
                marginBottom: "10px",
              }}
            >
              {group.category}
            </p>
            {group.items.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontFamily: theme.sans,
                    color: theme.text,
                  }}
                >
                  {item.label}
                </span>
                <div
                  style={{ display: "flex", gap: "4px", alignItems: "center" }}
                >
                  {item.keys.map((k, i) => (
                    <span
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Key>{k}</Key>
                      {i < item.keys.length - 1 && (
                        <span style={{ fontSize: "10px", color: theme.muted }}>
                          +
                        </span>
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
