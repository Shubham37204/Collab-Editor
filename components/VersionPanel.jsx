"use client";
import { useTheme } from "../app/layout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function VersionPanel({
  docId,
  currentContent,
  onRestore,
  onClose,
}) {
  const { theme } = useTheme();
  const versions = useQuery(api.documents.getVersions, { docId });
  const [previewing, setPreviewing] = useState(null); // version being previewed

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

  return (
    <div
      style={{
        width: "260px",
        borderLeft: `1px solid ${theme.border}`,
        background: theme.card,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: theme.text,
            fontFamily: theme.sans,
          }}
        >
          Version history
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: theme.muted,
            fontSize: "16px",
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>

      {/* Version list */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Current version */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.accent + "11",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: theme.text,
                fontFamily: theme.sans,
                fontWeight: "500",
              }}
            >
              Current version
            </span>
            <span
              style={{
                fontSize: "10px",
                background: theme.accent + "22",
                color: theme.accent,
                padding: "1px 6px",
                borderRadius: "8px",
              }}
            >
              live
            </span>
          </div>
          <p
            style={{
              fontSize: "11px",
              color: theme.muted,
              margin: "3px 0 0",
              fontFamily: theme.sans,
            }}
          >
            {currentContent.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {/* Saved versions */}
        {!versions ? (
          <p
            style={{
              padding: "16px",
              fontSize: "12px",
              color: theme.muted,
              fontFamily: theme.sans,
            }}
          >
            Loading...
          </p>
        ) : versions.length === 0 ? (
          <p
            style={{
              padding: "16px",
              fontSize: "12px",
              color: theme.muted,
              fontFamily: theme.sans,
            }}
          >
            No saved versions yet. Save the document to create a version.
          </p>
        ) : (
          versions.map((v) => (
            <div
              key={v._id}
              onClick={() =>
                setPreviewing(previewing?._id === v._id ? null : v)
              }
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${theme.border}`,
                cursor: "pointer",
                background:
                  previewing?._id === v._id ? theme.badge : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: theme.text,
                    fontFamily: theme.sans,
                  }}
                >
                  {timeAgo(v._creationTime)}
                </span>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: theme.muted,
                  margin: "3px 0 0",
                  fontFamily: theme.sans,
                }}
              >
                by {v.savedByName}
              </p>

              {/* Restore button — only when selected */}
              {previewing?._id === v._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(v.content);
                    onClose();
                  }}
                  style={{
                    marginTop: "8px",
                    background: theme.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 12px",
                    fontSize: "11px",
                    fontFamily: theme.sans,
                    cursor: "pointer",
                    width: "100%",
                  }}
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
