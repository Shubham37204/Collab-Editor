"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useTheme } from "../app/layout";
import { useOthers, useRoom } from "../liveblocks.config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AIToolbar from "./AIToolbar";
import VersionPanel from "./VersionPanel";
import ShortcutsModal from "./ShortcutsModal";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { yCollab } from "y-codemirror.next";
import TopBar from "./TopBar";

const SLASH_COMMANDS = [
  { label: "Heading 1", icon: "H1", insert: "# " },
  { label: "Heading 2", icon: "H2", insert: "## " },
  { label: "Heading 3", icon: "H3", insert: "### " },
  { label: "Quote", icon: "❝", insert: "> " },
  { label: "Code block", icon: "</>", insert: "```\n\n```" },
  { label: "Bullet list", icon: "•", insert: "- " },
  { label: "Task list", icon: "☐", insert: "- [ ] " },
  { label: "Divider", icon: "—", insert: "\n---\n" },
];

export default function Editor({
  docId,
  initialContent,
  title: initialTitle,
  currentUserId,
}) {
  const router = useRouter();
  const { theme, dark, setDark } = useTheme();
  const room = useRoom();
  const others = useOthers();

  const editorContainerRef = useRef(null);
  const editorViewRef = useRef(null);
  const saveTimerRef = useRef(null);
  const titleTimerRef = useRef(null);
  const ydocRef = useRef(null);

  const [content, setContent] = useState(initialContent || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [aiToolbar, setAiToolbar] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [slashMenu, setSlashMenu] = useState(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);

  const saveContent = useMutation(api.documents.updateContent);
  const saveTitle = useMutation(api.documents.updateTitle);
  const saveVersion = useMutation(api.documents.saveVersion);

  const debouncedSave = useCallback(
    (value) => {
      clearTimeout(saveTimerRef.current);
      setSaving(true);
      saveTimerRef.current = setTimeout(async () => {
        await saveContent({ id: docId, content: value });
        setSaving(false);
      }, 1000);
    },
    [docId, saveContent],
  );

  // ── All handlers BEFORE useEffects ──────────────────
  const handleManualSave = async () => {
    setSaving(true);
    await Promise.all([
      saveContent({ id: docId, content }),
      saveTitle({ id: docId, title }),
      saveVersion({
        docId,
        content,
        title,
        savedBy: currentUserId || "unknown",
        savedByName: "Me",
      }),
    ]);
    setSaving(false);
  };

  const handleAIAction = async (action) => {
    const view = editorViewRef.current;
    if (!view || !selectedRange) return;
    const selectedText = view.state.doc.sliceString(
      selectedRange.from,
      selectedRange.to,
    );
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ text: selectedText, action }),
        headers: { "Content-Type": "application/json" },
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }
      view.dispatch({
        changes: {
          from: selectedRange.from,
          to: selectedRange.to,
          insert: result,
        },
      });
    } catch (err) {
      console.error(err);
    }
    setAiLoading(false);
    setAiToolbar(null);
  };

  const handleExportMD = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  const handleExportPDF = () => {
    window.print();
    setShowExport(false);
  };

  const handleSlashCommand = (cmd) => {
    const view = editorViewRef.current;
    if (!view) return;
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    view.dispatch({
      changes: { from: line.from, to: line.to, insert: cmd.insert },
    });
    setSlashMenu(null);
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await saveTitle({ id: docId, title: value });
    }, 800);
  };

  // ── Keyboard shortcuts ───────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
      if (mod && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setPreview((v) => !v);
      }
      if (mod && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setFocusMode((v) => !v);
      }
      if (
        e.key === "?" &&
        !mod &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        setShowShortcuts(true);
      }
      if (e.key === "Escape") {
        setFocusMode(false);
        setAiToolbar(null);
        setSlashMenu(null);
        setShowExport(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── CodeMirror + Y.js mount ──────────────────────────
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const provider = new LiveblocksYjsProvider(room, ydoc);
    const ytext = ydoc.getText("document-content");

    if (ytext.length === 0 && initialContent) ytext.insert(0, initialContent);

    const { awareness } = provider;
    awareness.setLocalStateField("user", { name: "Me", color: "#b8935a" });

    // Light theme for CodeMirror that matches our design
    const lightTheme = EditorView.theme({
      "&": {
        background: "transparent",
        color: "#1a1816",
        fontSize: "15px",
        fontFamily: "'Georgia', serif",
      },
      ".cm-content": { padding: "0", caretColor: "#b8935a" },
      ".cm-line": { padding: "0 0 2px 0", lineHeight: "1.8" },
      ".cm-cursor": { borderLeftColor: "#b8935a" },
      ".cm-selectionBackground": { background: "#b8935a22 !important" },
      ".cm-gutters": { display: "none" },
      ".cm-activeLineGutter": { display: "none" },
      ".cm-activeLine": { background: "transparent" },
      "&.cm-focused": { outline: "none" },
      ".cm-scroller": { overflow: "auto" },
    });

    const darkTheme = EditorView.theme(
      {
        "&": {
          background: "transparent",
          color: "#d4cfc9",
          fontSize: "15px",
          fontFamily: "'Georgia', serif",
        },
        ".cm-content": { padding: "0", caretColor: "#c9a96e" },
        ".cm-line": { padding: "0 0 2px 0", lineHeight: "1.8" },
        ".cm-cursor": { borderLeftColor: "#c9a96e" },
        ".cm-selectionBackground": { background: "#c9a96e22 !important" },
        ".cm-gutters": { display: "none" },
        ".cm-activeLineGutter": { display: "none" },
        ".cm-activeLine": { background: "transparent" },
        "&.cm-focused": { outline: "none" },
      },
      { dark: true },
    );

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        markdown(),
        dark ? [oneDark, darkTheme] : lightTheme,
        yCollab(ytext, awareness),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString();
            setContent(value);
            debouncedSave(value);
          }
          const selection = update.state.selection.main;
          if (selection.from !== selection.to) {
            const coords = update.view.coordsAtPos(selection.from);
            if (coords) {
              setSelectedRange({ from: selection.from, to: selection.to });
              setAiToolbar({ top: coords.top, left: coords.left });
            }
          } else {
            setAiToolbar(null);
          }
          const line = update.state.doc.lineAt(selection.head);
          const lineText = line.text;
          if (lineText.startsWith("/")) {
            const coords = update.view.coordsAtPos(selection.head);
            if (coords) {
              setSlashMenu({ top: coords.top, left: coords.left });
              setSlashFilter(lineText.slice(1));
            }
          } else {
            setSlashMenu(null);
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: editorContainerRef.current });
    editorViewRef.current = view;

    return () => {
      view.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [room, dark]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // ── Styles ───────────────────────────────────────────
  const s = {
    topbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: "52px",
      borderBottom: `1px solid ${theme.border}`,
      background: theme.bg,
      position: "sticky",
      top: 0,
      zIndex: 20,
    },
    toolbarBtn: (active) => ({
      background: active ? theme.badge : "transparent",
      border: `1px solid ${active ? theme.border : "transparent"}`,
      borderRadius: "6px",
      padding: "5px 12px",
      fontSize: "12px",
      color: active ? theme.text : theme.muted,
      cursor: "pointer",
      fontFamily: theme.sans,
      transition: "all 0.15s",
    }),
    iconBtn: {
      background: "transparent",
      border: "none",
      color: theme.muted,
      cursor: "pointer",
      padding: "6px",
      borderRadius: "6px",
      fontSize: "13px",
      fontFamily: theme.sans,
      display: "flex",
      alignItems: "center",
      gap: "4px",
      transition: "all 0.15s",
    },
    accentBtn: {
      background: theme.accent,
      color: "#fff",
      border: "none",
      padding: "6px 14px",
      borderRadius: "6px",
      fontFamily: theme.sans,
      fontSize: "12px",
      cursor: "pointer",
    },
  };

  const toolbarButtonStyle = (active = false) => ({
    background: active ? theme.accent + "22" : "transparent",
    border: `1px solid ${active ? theme.accent + "66" : theme.border}`,
    borderRadius: "5px",
    padding: "4px 10px",
    fontSize: "12px",
    fontFamily: theme.mono || "monospace",
    color: active ? theme.accent : theme.muted,
    cursor: "pointer",
    transition: "all 0.12s ease",
    whiteSpace: "nowrap",
  });

  const divider = (
    <div
      style={{
        width: "1px",
        height: "16px",
        background: theme.border,
        flexShrink: 0,
      }}
    />
  );

  return (
    <div
      style={{
        height: "100vh",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: theme.text,
      }}
    >
      {/* ── TOP NAV ─────────────────────────────── */}
      {!focusMode && (
        <TopBar
          showBack={true}
          rightContent={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Live collaborator avatars */}
              {others.length > 0 && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {others.slice(0, 4).map((other, i) => (
                    <div
                      key={i}
                      title={other.info?.name || "Collaborator"}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: (other.info?.color || "#888") + "33",
                        border: `2px solid ${other.info?.color || "#888"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: other.info?.color || theme.text,
                        marginLeft: i === 0 ? 0 : "-8px",
                        position: "relative",
                        zIndex: 4 - i,
                        cursor: "default",
                      }}
                    >
                      {(other.info?.name?.[0] || "?").toUpperCase()}
                    </div>
                  ))}
                  <span
                    style={{
                      fontSize: "11px",
                      color: theme.muted,
                      fontFamily: theme.sans,
                      marginLeft: "8px",
                    }}
                  >
                    {others.length} online
                  </span>
                </div>
              )}

              {/* Saving indicator */}
              <span
                style={{
                  fontSize: "12px",
                  color: saving ? theme.accent : theme.muted,
                  fontFamily: theme.sans,
                  minWidth: "56px",
                }}
              >
                {saving ? "● Saving" : "✓ Saved"}
              </span>
            </div>
          }
        />
      )}

      {/* ── SECONDARY TOOLBAR ───────────────────── */}
      {!focusMode && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 16px",
            borderBottom: `1px solid ${theme.border}`,
            background: dark ? "#111" : "#fefefe",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {/* Format buttons */}
          {[
            { label: "B", val: "**", block: false, title: "Bold" },
            { label: "I", val: "_", block: false, title: "Italic" },
            { label: "H1", val: "# ", block: true, title: "Heading 1" },
            { label: "H2", val: "## ", block: true, title: "Heading 2" },
            { label: "</>", val: "`", block: false, title: "Inline code" },
            { label: "{ }", val: "```\n", block: true, title: "Code block" },
          ].map((btn) => (
            <button
              key={btn.label}
              title={btn.title}
              onClick={() => handleFormat(btn.val, btn.block)}
              style={toolbarButtonStyle()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.badge;
                e.currentTarget.style.color = theme.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.muted;
              }}
            >
              {btn.label}
            </button>
          ))}

          {divider}

          {/* View buttons */}
          <button
            onClick={() => setPreview((v) => !v)}
            style={toolbarButtonStyle(preview)}
          >
            {preview ? "Hide Preview" : "Preview"}
          </button>

          <button
            onClick={() => setFocusMode(true)}
            style={toolbarButtonStyle(false)}
          >
            Focus
          </button>

          <button
            onClick={() => setShowVersions((v) => !v)}
            style={toolbarButtonStyle(showVersions)}
          >
            History
          </button>

          {divider}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Collaborators count (mobile fallback) */}
          {others.length > 0 && (
            <span
              style={{
                fontSize: "11px",
                color: theme.muted,
                fontFamily: theme.sans,
                background: theme.badge,
                padding: "3px 8px",
                borderRadius: "10px",
                border: `1px solid ${theme.border}`,
              }}
            >
              {others.length} collaborating
            </span>
          )}

          {/* Export dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowExport((v) => !v)}
              style={toolbarButtonStyle(showExport)}
            >
              Export ↓
            </button>
            {showExport && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  zIndex: 100,
                  minWidth: "160px",
                  boxShadow: dark
                    ? "0 8px 32px rgba(0,0,0,0.4)"
                    : "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                {[
                  { label: "⬇ Download .md", action: handleExportMD },
                  { label: "🖨 Export PDF", action: handleExportPDF },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setShowExport(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 16px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      color: theme.text,
                      fontFamily: theme.sans,
                      fontSize: "13px",
                      cursor: "pointer",
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = theme.badge)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleManualSave}
            disabled={saving}
            style={{
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              fontFamily: theme.sans,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
              fontWeight: "500",
            }}
          >
            {saving ? "Saving..." : "💾 Save"}
          </button>
        </div>
      )}

      {/* ── TITLE INPUT ─────────────────────────── */}
      {!focusMode && (
        <div
          style={{
            padding: "14px 24px 12px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.bg,
            flexShrink: 0,
          }}
        >
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled document"
            style={{
              fontSize: "22px",
              fontFamily: theme.serif,
              fontWeight: "400",
              background: "transparent",
              border: "none",
              outline: "none",
              color: theme.text,
              width: "100%",
              letterSpacing: "-0.3px",
            }}
          />
        </div>
      )}

      {/* ── EDITOR + PREVIEW + VERSION PANEL ────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* CodeMirror */}
        <div
          ref={editorContainerRef}
          style={{
            flex: 1,
            overflow: "auto",
            fontSize: "14px",
            display: preview ? "none" : "flex",
            flexDirection: "column",
            ...(focusMode && {
              maxWidth: "740px",
              margin: "0 auto",
              width: "100%",
              padding: "48px 0",
            }),
          }}
        />

        {/* Split preview panel */}
        {preview && !focusMode && (
          <div
            className="preview-content"
            style={{
              flex: 1,
              padding: "32px 48px",
              borderLeft: `1px solid ${theme.border}`,
              overflow: "auto",
              color: theme.text,
              background: dark ? "#0d0d0d" : "#fefefe",
              fontFamily: theme.serif,
              lineHeight: "1.85",
              fontSize: "15px",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {/* Full preview mode */}
        {preview && focusMode && (
          <div style={{ flex: 1, overflow: "auto", background: theme.bg }}>
            <div
              style={{
                maxWidth: "720px",
                margin: "0 auto",
                padding: "56px 32px",
                fontFamily: theme.serif,
                fontSize: "17px",
                lineHeight: "1.9",
                color: theme.text,
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Version history panel */}
        {showVersions && (
          <VersionPanel
            docId={docId}
            currentContent={content}
            onRestore={(restoredContent) => {
              setContent(restoredContent);
              const ydoc = ydocRef.current;
              if (ydoc) {
                ydoc.transact(() => {
                  const ytext = ydoc.getText("document-content");
                  ytext.delete(0, ytext.length);
                  ytext.insert(0, restoredContent);
                });
              }
              setShowVersions(false);
            }}
            onClose={() => setShowVersions(false)}
          />
        )}
      </div>

      {/* ── FOCUS MODE EXIT ──────────────────────── */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: dark ? "#1a1a1a" : "#ffffff",
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            padding: "7px 14px",
            color: theme.muted,
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: theme.sans,
            zIndex: 200,
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          Esc · Exit focus
        </button>
      )}

      {/* ── SLASH COMMAND MENU ───────────────────── */}
      {slashMenu && (
        <div
          style={{
            position: "fixed",
            top: slashMenu.top + 28,
            left: Math.min(slashMenu.left, window.innerWidth - 220),
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: 200,
            boxShadow: dark
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 8px 32px rgba(0,0,0,0.12)",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              padding: "6px 12px",
              fontSize: "10px",
              color: theme.muted,
              fontFamily: theme.sans,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            Insert block
          </div>
          {SLASH_COMMANDS.filter(
            (c) =>
              c.filter.includes(slashFilter.toLowerCase()) ||
              slashFilter === "",
          ).map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => handleSlashCommand(cmd)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "8px 14px",
                textAlign: "left",
                background: "none",
                border: "none",
                color: theme.text,
                fontFamily: theme.sans,
                fontSize: "13px",
                cursor: "pointer",
                borderBottom: `1px solid ${theme.border}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme.badge)
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  color: theme.accent,
                  fontSize: "12px",
                  minWidth: "28px",
                }}
              >
                {cmd.label.split(" ")[0]}
              </span>
              <span>{cmd.label.split(" ").slice(1).join(" ")}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── AI TOOLBAR ───────────────────────────── */}
      <AIToolbar
        position={aiToolbar}
        onAction={handleAIAction}
        loading={aiLoading}
        onClose={() => setAiToolbar(null)}
      />

      {/* ── STATUS BAR ───────────────────────────── */}
      {!focusMode && (
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            background: dark ? "#0a0a0a" : "#f8f6f2",
            padding: "4px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: theme.muted,
            fontFamily: theme.sans,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <span>{wordCount} words</span>
            <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
          </div>
          <span
            style={{ cursor: "pointer", letterSpacing: "0.2px" }}
            onClick={() => setShowShortcuts(true)}
            title="Keyboard shortcuts"
          >
            Press ? for shortcuts
          </span>
        </div>
      )}

      {/* ── SHORTCUTS MODAL ─────────────────────── */}
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}

function toolbarBtn(theme, active) {
  return {
    background: active ? theme.badge : "none",
    border: `1px solid ${active ? theme.border : "transparent"}`,
    borderRadius: "6px",
    padding: "5px 12px",
    fontSize: "12px",
    color: active ? theme.text : theme.muted,
    cursor: "pointer",
    fontFamily: "sans-serif",
    transition: "all 0.15s ease",
  };
}
