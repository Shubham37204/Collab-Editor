"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function VersionPanel({
  docId,
  currentContent,
  onRestore,
  onClose,
}) {
  const versions = useQuery(api.documents.getVersions, { docId });
  const [previewing, setPreviewing] = useState(null);

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
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
                <span className="text-xs text-foreground font-sans">
                  {timeAgo(v._creationTime)}
                </span>
              </div>
              <p className="text-xs text-muted mt-1 m-0 font-sans">
                by {v.savedByName}
              </p>

              {/* Restore button */}
              {previewing?._id === v._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
