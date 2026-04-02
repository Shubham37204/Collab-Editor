"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useTheme } from "../app/layout";
import { useOthers, useRoom } from "../liveblocks.config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TopBar from "./TopBar";
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

const SLASH_COMMANDS = [
  { label: "# Heading 1", filter: "h1", insert: "# " },
  { label: "## Heading 2", filter: "h2", insert: "## " },
  { label: "### Heading 3", filter: "h3", insert: "### " },
  { label: "> Quote", filter: "quote", insert: "> " },
  { label: "``` Code", filter: "code", insert: "```\n\n```" },
  { label: "- Bullet list", filter: "list", insert: "- " },
  { label: "**Bold**", filter: "bold", insert: "****" },
  { label: "_Italic_", filter: "italic", insert: "__" },
];

export default function Editor({
  docId,
  initialContent,
  title: initialTitle,
  currentUserId,
}) {
  const router = useRouter();
  const { theme, dark } = useTheme();
  const room = useRoom();
  const others = useOthers();
  const [showShortcuts, setShowShortcuts] = useState(false);
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
    [docId],
  );

  useEffect(() => {
    if (!editorContainerRef.current) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new LiveblocksYjsProvider(room, ydoc);
    const ytext = ydoc.getText("document-content");

    if (ytext.length === 0 && initialContent) {
      ytext.insert(0, initialContent);
    }

    const { awareness } = provider;
    awareness.setLocalStateField("user", { name: "Me", color: "#b8935a" });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        markdown(),
        dark ? oneDark : EditorView.baseTheme({}),
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

    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [room, dark]);

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

      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        // Only trigger if not typing in an input
        if (
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          setShowShortcuts(true);
        }
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

  const handleExportMD = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => window.print();

  const handleSlashCommand = (cmd) => {
    const view = editorViewRef.current;
    const line = view.state.doc.lineAt(view.state.selection.main.head);

    view.dispatch({
      changes: {
        from: line.from,
        to: line.to,
        insert: cmd.insert,
      },
    });

    setSlashMenu(null);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      style={{
        height: "100vh",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      {!focusMode && (
        <TopBar
          showBack={true}
          saving={saving}
          title={title}
          onTitleChange={setTitle}
        />
      )}

      {/* Secondary Toolbar */}
      {!focusMode && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 24px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.bg,
          }}
        >
          {/* Preview toggle */}
          <button
            onClick={() => setPreview((v) => !v)}
            style={toolbarBtn(theme, preview)}
          >
            {preview ? "Hide Preview" : "Preview"}
          </button>

          {/* Focus mode */}
          <button
            onClick={() => setFocusMode(true)}
            style={toolbarBtn(theme, false)}
          >
            Focus
          </button>

          {/* Version history */}
          <button
            onClick={() => setShowVersions((v) => !v)}
            style={toolbarBtn(theme, showVersions)}
          >
            History
          </button>

          <div style={{ flex: 1 }} />

          {/* Collaborators */}
          {others.length > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: theme.muted,
                fontFamily: "sans-serif",
              }}
            >
              {others.length} collaborator{others.length > 1 ? "s" : ""} online
            </span>
          )}

          {/* Export dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowExport((v) => !v)}
              style={toolbarBtn(theme, showExport)}
            >
              Export ↓
            </button>

            {showExport && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  zIndex: 100,
                  minWidth: "160px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                {[
                  { label: "⬇ Export .md", action: handleExportMD },
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
                      fontFamily: "sans-serif",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = theme.badge)
                    }
                    onMouseLeave={(e) => (e.target.style.background = "none")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor + Preview */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* CodeMirror Editor */}
        <div
          ref={editorContainerRef}
          style={{
            flex: 1,
            overflow: "auto",
            ...(focusMode && {
              maxWidth: "720px",
              margin: "0 auto",
              padding: "48px 0",
            }),
          }}
        />

        {/* Preview Panel */}
        {preview && (
          <div
            className="preview-content"
            style={{
              flex: 1,
              padding: "32px 40px",
              borderLeft: `1px solid ${theme.border}`,
              overflow: "auto",
              color: theme.text,
              background: theme.bg,
              fontFamily: "Georgia, serif",
              lineHeight: "1.8",
              fontSize: "15px",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {/* Version Panel */}
        {showVersions && (
          <VersionPanel
            docId={docId}
            onRestore={(restoredContent) => {
              setContent(restoredContent);
              const ydoc = ydocRef.current;
              ydoc.transact(() => {
                const ytext = ydoc.getText("document-content");
                ytext.delete(0, ytext.length);
                ytext.insert(0, restoredContent);
              });
              setShowVersions(false);
            }}
          />
        )}
      </div>

      {/* Focus mode exit button */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            padding: "6px 12px",
            color: theme.muted,
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "sans-serif",
            zIndex: 200,
          }}
        >
          Esc · Exit focus
        </button>
      )}

      {/* Slash Command Menu */}
      {slashMenu && (
        <div
          style={{
            position: "fixed",
            top: slashMenu.top + 24,
            left: slashMenu.left,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            minWidth: "200px",
          }}
        >
          {SLASH_COMMANDS.filter(
            (c) =>
              c.filter.includes(slashFilter.toLowerCase()) ||
              slashFilter === "",
          ).map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => handleSlashCommand(cmd)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 14px",
                textAlign: "left",
                background: "none",
                border: "none",
                color: theme.text,
                fontFamily: "monospace",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.background = theme.badge)}
              onMouseLeave={(e) => (e.target.style.background = "none")}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      )}

      {/* AI Toolbar */}
      <AIToolbar
        position={aiToolbar}
        onAction={handleAIAction}
        loading={aiLoading}
      />

      {/* Status Bar */}
      {!focusMode && (
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            background: theme.bg,
            padding: "5px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: theme.muted,
            fontFamily: "sans-serif",
          }}
        >
          <span>
            {wordCount} words · {saving ? "Saving..." : "Saved"}
          </span>
          <span>Ctrl+S Save · Ctrl+Shift+P Preview · Ctrl+Shift+F Focus</span>
        </div>
      )}
      <span
        style={{
          marginLeft: "auto",
          fontSize: "11px",
          color: theme.muted,
          fontFamily: theme.sans,
          cursor: "pointer",
        }}
        onClick={() => setShowShortcuts(true)}
      >
        Press ? for shortcuts
      </span>
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}

// Helper for toolbar buttons
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
