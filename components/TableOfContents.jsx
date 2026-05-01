"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";

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
  const [activeId, setActiveId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const observerRef = useRef(null);

  const headings = useMemo(() => parseHeadings(content), [content]);

  // Scroll spy
  useEffect(() => {
    if (!previewRef?.current || headings.length === 0) return;
    if (observerRef.current) observerRef.current.disconnect();

    const options = {
      root: previewRef.current,
      rootMargin: "-10% 0px -80% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    }, options);

    headings.forEach((h) => {
      const el = previewRef.current?.querySelector(`#${h.id}`);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings, previewRef]);

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

  const indentMap = { 1: 'pl-3', 2: 'pl-6', 3: 'pl-9' };

  return (
    <div
      className={`border-r border-border bg-background flex flex-col shrink-0 transition-[width] duration-200 overflow-hidden relative ${
        isOpen ? 'w-[220px]' : 'w-9'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
        {isOpen && (
          <span className="text-[10px] font-semibold text-muted font-sans tracking-wider uppercase">
            Contents
          </span>
        )}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className={`bg-transparent border-none text-muted cursor-pointer text-sm p-0.5 hover:text-foreground transition-colors duration-150 ${
            isOpen ? '' : 'mx-auto'
          }`}
          title={isOpen ? "Collapse TOC" : "Expand TOC"}
        >
          {isOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* TOC items */}
      {isOpen && (
        <div className="flex-1 overflow-auto py-2">
          {headings.map((h, i) => {
            const isActive = activeId === h.id;
            return (
              <button
                key={`${h.id}-${i}`}
                onClick={() => scrollToHeading(h.id)}
                title={h.text}
                className={`block w-full text-left border-none py-1.5 pr-3 cursor-pointer transition-all duration-150 truncate ${indentMap[h.level]} ${
                  h.level === 1 ? 'text-xs font-medium' : 'text-[11px] font-normal'
                } ${
                  isActive
                    ? 'bg-primary/10 border-l-2 border-l-primary text-primary'
                    : 'bg-transparent border-l-2 border-l-transparent text-muted hover:text-foreground hover:bg-badge'
                } font-sans leading-snug`}
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
