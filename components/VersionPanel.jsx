"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function VersionPanel({
  docId,
  currentContent,
  onRestore,
  onSaveNamedVersion,
  onClose,
}) {
  const versions = useQuery(api.documents.getVersions, { docId });
  const [previewing, setPreviewing] = useState(null);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [nowMs] = useState(() => Date.now());

  const timeAgo = (timestamp) => {
    const diff = nowMs - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const currentWordCount = currentContent.trim().split(/\s+/).filter(Boolean).length;

  const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;

  const handleNamedSave = async () => {
    setSaving(true);
    await onSaveNamedVersion?.(label.trim(), note.trim());
    setLabel("");
    setNote("");
    setSaving(false);
  };

  return (
    <div className="w-[260px] border-l border-border bg-card flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <span className="text-sm font-medium text-foreground font-sans">
          Version history
        </span>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-muted text-lg cursor-pointer p-0.5 hover:text-foreground transition-colors duration-150"
        >
          ×
        </button>
      </div>

      {/* Version list */}
      <div className="flex-1 overflow-auto">
        {/* Current version */}
        <div className="px-4 py-3 border-b border-border bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground font-sans font-medium">
              Current version
            </span>
            <span className="text-[10px] bg-primary/15 text-primary py-0.5 px-1.5 rounded-full">
              live
            </span>
          </div>
          <p className="text-xs text-muted mt-1 m-0 font-sans">
            {currentWordCount} words
          </p>
          <div className="mt-3 space-y-2">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Version name"
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary/60"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              className="w-full min-h-14 resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary/60"
            />
            <button
              onClick={handleNamedSave}
              disabled={saving}
              className="w-full bg-primary text-white border-none rounded-md py-1.5 text-xs font-sans cursor-pointer hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save named version"}
            </button>
          </div>
        </div>

        {/* Saved versions */}
        {!versions ? (
          <div className="p-4 space-y-2">
            <div className="skeleton h-8 rounded" />
            <div className="skeleton h-8 rounded" />
          </div>
        ) : versions.length === 0 ? (
          <p className="p-4 text-xs text-muted font-sans">
            No saved versions yet. Save the document to create a version.
          </p>
        ) : (
          versions.map((v) => (
            <div
              key={v._id}
              onClick={() =>
                setPreviewing(previewing?._id === v._id ? null : v)
              }
              className={`px-4 py-3 border-b border-border cursor-pointer transition-colors duration-150 hover:bg-badge ${
                previewing?._id === v._id ? 'bg-badge' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground font-sans font-medium">
                  {v.label || timeAgo(v._creationTime)}
                </span>
              </div>
              <p className="text-xs text-muted mt-1 m-0 font-sans">
                by {v.savedByName} - {v.wordCount ?? countWords(v.content)} words
              </p>
              {v.label && (
                <p className="text-[11px] text-muted mt-0.5 m-0 font-sans">
                  {timeAgo(v._creationTime)}
                </p>
              )}
              {v.note && (
                <p className="text-xs text-muted mt-2 mb-0 font-sans bg-background-secondary rounded-md p-2">
                  {v.note}
                </p>
              )}
              {previewing?._id === v._id && (
                <div className="mt-2 rounded-md border border-border bg-background-secondary p-2">
                  <p className="text-[11px] text-muted font-sans m-0">
                    Diff summary: {Math.abs(currentWordCount - (v.wordCount ?? countWords(v.content)))} word change
                  </p>
                </div>
              )}

              {/* Restore button */}
              {previewing?._id === v._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirmed = window.confirm("Restore this version? Current editor content will be replaced.");
                    if (!confirmed) return;
                    onRestore(v.content);
                    onClose();
                  }}
                  className="mt-2 w-full bg-primary text-white border-none rounded-md py-1.5 text-xs font-sans cursor-pointer hover:bg-primary-hover transition-colors duration-200"
                >
                  Restore this version
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
