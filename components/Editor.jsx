"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useTheme } from "../app/layout";
import { useOthers, useRoom } from "../liveblocks.config";
import VersionPanel from "./VersionPanel";
import ShortcutsModal from "./ShortcutsModal";
import TableOfContents from "./TableOfContents";
import UnifiedHeader from "./editor/UnifiedHeader";
import { SplitPreview, FullPreview } from "./editor/MarkdownPreview";
import SlashCommandMenu from "./editor/SlashCommandMenu";
import StatusBar from "./editor/StatusBar";
import CollaboratorAvatars from "./editor/CollaboratorAvatars";
import ShareDocModal from "./dashboard/ShareDocModal";
import { EditorView, placeholder } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { yCollab } from "y-codemirror.next";

export default function Editor({
  docId,
  initialContent,
  title: initialTitle,
  currentUserId,
}) {
  const router = useRouter();
  const { dark } = useTheme();
  const room = useRoom();
  const others = useOthers();

  const editorContainerRef = useRef(null);
  const editorViewRef = useRef(null);
  const saveTimerRef = useRef(null);
  const titleTimerRef = useRef(null);
  const ydocRef = useRef(null);
  const previewPanelRef = useRef(null);
  const seededRef = useRef(false);

  const [content, setContent] = useState(initialContent || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [slashMenu, setSlashMenu] = useState(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [showShare, setShowShare] = useState(false);

  const saveContent = useMutation(api.documents.updateContent);
  const saveTitle = useMutation(api.documents.updateTitle);
  const saveVersion = useMutation(api.documents.saveVersion);
  const addCollab = useMutation(api.documents.addCollaborator);

  /* ── Debounced auto-save ── */
  const debouncedSave = useCallback(
    (value) => {
      clearTimeout(saveTimerRef.current);
      setSaving(true);
      saveTimerRef.current = setTimeout(async () => {
        const sizeKB = new Blob([value]).size / 1024;
        if (sizeKB > 900) {
          console.warn(`Content too large: ${Math.round(sizeKB)}KB`);
          setSaving(false);
          return;
        }
        await saveContent({ id: docId, content: value });
        setSaving(false);
      }, 1000);
    },
    [docId, saveContent],
  );

  /* ── Manual save + version ── */
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

  /* ── Formatting ── */
  const handleFormat = (syntax, block = false) => {
    const view = editorViewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const selected = view.state.doc.sliceString(from, to);
    const insert = block
      ? `${syntax}${selected}`
      : `${syntax}${selected}${syntax}`;
    view.dispatch({ changes: { from, to, insert } });
    view.focus();
  };

  /* ── Title save ── */
  const handleTitleChange = (value) => {
    setTitle(value);
    clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await saveTitle({ id: docId, title: value });
    }, 800);
  };



  /* ── Export ── */
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

  const handleShare = async (email, role) => {
    if (!email.trim()) return;
    await addCollab({
      docId,
      userId: email,
      email,
      name: email,
      role,
    });
  };

  /* ── Slash commands ── */
  const handleSlashCommand = (cmd) => {
    const view = editorViewRef.current;
    if (!view) return;
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    view.dispatch({
      changes: { from: line.from, to: line.to, insert: cmd.insert },
    });
    setSlashMenu(null);
  };

  /* ── Keyboard shortcuts ── */
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
        setSlashMenu(null);
        setShowExport(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── CodeMirror + Y.js ── */
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const provider = new LiveblocksYjsProvider(room, ydoc);
    const ytext = ydoc.getText("document-content");

    const tryInsert = () => {
      if (!seededRef.current && ytext.length === 0 && initialContent) {
        seededRef.current = true;
        ytext.insert(0, initialContent);
      }
    };
    tryInsert();
    provider.on("sync", tryInsert);

    /* Connection status tracking */
    const updateStatus = () => {
      const status = provider.synced ? "connected" : "reconnecting";
      setConnectionStatus(status);
    };
    provider.on("sync", updateStatus);
    provider.on("status", ({ status }) => {
      setConnectionStatus(status === "connected" ? "connected" : "reconnecting");
    });

    const { awareness } = provider;
    awareness.setLocalStateField("user", { name: "Me", color: "var(--primary-color)" });

    const lightTheme = EditorView.theme({
      "&": { background: "transparent", color: "var(--fg-color)", fontSize: "15px", fontFamily: "'Georgia', serif" },
      ".cm-content": { padding: "16px 0", caretColor: "var(--primary-color)" },
      ".cm-line": { padding: "0 0 3px 0", lineHeight: "1.8" },
      ".cm-cursor": { borderLeftColor: "var(--primary-color)" },
      ".cm-selectionBackground": { background: "color-mix(in srgb, var(--primary-color) 20%, transparent) !important" },
      ".cm-gutters": { display: "none" },
      ".cm-activeLineGutter": { display: "none" },
      ".cm-activeLine": { background: "transparent" },
      "&.cm-focused": { outline: "none" },
      ".cm-scroller": { overflow: "auto" },
      ".cm-strong": { fontWeight: "bold", color: "var(--fg-color)" },
      ".cm-em": { fontStyle: "italic" },
      ".cm-heading": { fontWeight: "bold", color: "var(--primary-color)" },
      ".cm-placeholder": { color: "var(--muted-color)", fontStyle: "italic", fontSize: "1.1rem", opacity: "0.7" }
    });

    const darkTheme = EditorView.theme(
      {
        "&": { backgroundColor: "transparent !important", color: "var(--fg-color)", fontSize: "15px", fontFamily: "'Georgia', serif" },
        ".cm-content": { padding: "0", caretColor: "var(--primary-color)" },
        ".cm-line": { padding: "0 0 2px 0", lineHeight: "1.8" },
        ".cm-cursor": { borderLeftColor: "var(--primary-color)" },
        ".cm-selectionBackground": { background: "color-mix(in srgb, var(--primary-color) 20%, transparent) !important" },
        ".cm-gutters": { display: "none" },
        ".cm-activeLineGutter": { display: "none" },
        ".cm-activeLine": { background: "transparent" },
        "&.cm-focused": { outline: "none" },
        ".cm-strong": { fontWeight: "bold", color: "var(--fg-color)" },
        ".cm-em": { fontStyle: "italic" },
        ".cm-heading": { fontWeight: "bold", color: "var(--primary-color)" },
        ".cm-placeholder": { color: "var(--muted-color)", fontStyle: "italic", fontSize: "1.1rem", opacity: "0.7" }
      },
      { dark: true },
    );

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        markdown(),
        placeholder("Start writing your document here..."),
        dark ? [oneDark, darkTheme] : lightTheme,
        yCollab(ytext, awareness),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString();
            setContent(value);
            debouncedSave(value);
          }
          const selection = update.state.selection.main;
          const line = update.state.doc.lineAt(selection.head);
          if (line.text.startsWith("/")) {
            const coords = update.view.coordsAtPos(selection.head);
            if (coords) {
              setSlashMenu({ top: coords.top, left: coords.left });
              setSlashFilter(line.text.slice(1));
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

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden text-foreground">
      <UnifiedHeader
        title={title}
        onTitleChange={handleTitleChange}
        onFormat={handleFormat}
        preview={preview}
        onTogglePreview={() => setPreview((v) => !v)}
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode(true)}
        showVersions={showVersions}
        onToggleVersions={() => setShowVersions((v) => !v)}
        showExport={showExport}
        onToggleExport={() => setShowExport((v) => !v)}
        onExportMD={handleExportMD}
        onExportPDF={handleExportPDF}
        onSave={handleManualSave}
        onShare={() => setShowShare(true)}
        saving={saving}
        collaborators={<CollaboratorAvatars others={others} />}
      />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of contents */}
        {preview && !focusMode && (
          <TableOfContents content={content} previewRef={previewPanelRef} />
        )}

        {/* CodeMirror */}
        <div
          ref={editorContainerRef}
          className={`flex-1 overflow-auto text-sm flex flex-col pt-32 pb-24 ${
            preview ? 'hidden' : ''
          } ${
            focusMode
              ? 'max-w-[740px] mx-auto w-full px-12 md:px-16'
              : 'max-w-5xl mx-auto w-full px-10 md:px-16'
          }`}
        />

        {/* Split preview */}
        {preview && !focusMode && (
          <SplitPreview ref={previewPanelRef} content={content} />
        )}

        {/* Full preview (focus mode) */}
        {preview && focusMode && <FullPreview content={content} />}

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

      {/* Focus mode exit */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="fixed top-5 right-5 bg-card border border-border rounded-lg px-3.5 py-1.5 text-muted text-xs font-sans cursor-pointer z-[200] shadow-md hover:text-foreground hover:border-muted transition-all duration-200"
        >
          Esc · Exit focus
        </button>
      )}

      {/* Slash command menu */}
      <SlashCommandMenu
        position={slashMenu}
        filter={slashFilter}
        onSelect={handleSlashCommand}
      />


      {/* Status bar */}
      {!focusMode && (
        <StatusBar
          wordCount={wordCount}
          onShowShortcuts={() => setShowShortcuts(true)}
          connectionStatus={connectionStatus}
        />
      )}

      {/* Shortcuts modal */}
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}

      {/* Share Modal */}
      <ShareDocModal
        open={showShare}
        onClose={() => setShowShare(false)}
        doc={{ _id: docId, title: title, collaborators: [] }}
        user={{ id: currentUserId, emailAddresses: [] }}
        onShare={handleShare}
      />

      {/* Invisible print container for PDF export */}
      <div className="hidden print:block">
        <FullPreview content={content} />
      </div>
    </div>
  );
}
