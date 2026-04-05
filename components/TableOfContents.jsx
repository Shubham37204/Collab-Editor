"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "../app/layout";
import { useMemo } from "react";

// Parse headings from markdown content
function parseHeadings(content) {
  const lines = content.split("\n");
  const headings = [];

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      headings.push({ level, text, id, lineIndex: index });
    }
  });

  return headings;
}

export default function TableOfContents({ content, previewRef }) {
  const { theme } = useTheme();
  const [activeId, setActiveId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const observerRef = useRef(null);

  // Re-parse headings when content changes
  const headings = useMemo(() => parseHeadings(content), [content]);

  // Scroll spy — watches which heading is in view
  useEffect(() => {
    if (!previewRef?.current || headings.length === 0) return;

    // Disconnect old observer
    if (observerRef.current) observerRef.current.disconnect();

    const options = {
      root: previewRef.current,
      rootMargin: "-10% 0px -80% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options);

    // Observe all heading elements in preview
    headings.forEach((h) => {
      const el = previewRef.current?.querySelector(`#${h.id}`);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings, previewRef]);

  // Scroll to heading on click
  const scrollToHeading = useCallback(
    (id) => {
      if (!previewRef?.current) return;
      const el = previewRef.current.querySelector(`#${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
      }
    },
    [previewRef],
  );

  if (headings.length === 0) return null;

  const indentMap = { 1: 0, 2: 12, 3: 22 };

  return (
    <div
      style={{
        width: isOpen ? "220px" : "36px",
        borderRight: `1px solid ${theme.border}`,
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px 8px",
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      >
        {isOpen && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: theme.muted,
              fontFamily: "sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Contents
          </span>
        )}
        <button
          onClick={() => setIsOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            color: theme.muted,
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 4px",
            marginLeft: isOpen ? 0 : "auto",
            marginRight: isOpen ? 0 : "auto",
          }}
          title={isOpen ? "Collapse TOC" : "Expand TOC"}
        >
          {isOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* TOC items */}
      {isOpen && (
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "8px 0",
          }}
        >
          {headings.map((h, i) => {
            const isActive = activeId === h.id;
            return (
              <button
                key={`${h.id}-${i}`}
                onClick={() => scrollToHeading(h.id)}
                title={h.text}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? theme.accent + "18" : "none",
                  border: "none",
                  borderLeft: `2px solid ${isActive ? theme.accent : "transparent"}`,
                  padding: `5px 12px 5px ${12 + indentMap[h.level]}px`,
                  fontSize: h.level === 1 ? "12px" : "11px",
                  fontFamily: "sans-serif",
                  fontWeight: h.level === 1 ? "500" : "400",
                  color: isActive ? theme.accent : theme.muted,
                  cursor: "pointer",
                  transition: "all 0.12s ease",
                  lineHeight: "1.4",
                  // Truncate long headings
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = theme.text;
                    e.currentTarget.style.background = theme.badge;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = theme.muted;
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                {h.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
