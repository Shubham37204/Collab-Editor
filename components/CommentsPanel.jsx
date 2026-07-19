"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const mentionRegex = /@([^\s@]+@[^\s@]+\.[^\s@]+)/g;

export default function CommentsPanel({
  docId,
  user,
  selectedText,
  onClose,
}) {
  const comments = useQuery(api.documents.getComments, { docId });
  const addComment = useMutation(api.documents.addComment);
  const resolveComment = useMutation(api.documents.resolveComment);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const mentions = useMemo(() => {
    return [...body.matchAll(mentionRegex)].map((match) => match[1].toLowerCase());
  }, [body]);

  const handleAdd = async () => {
    if (!body.trim()) return;
    setSaving(true);
    setError("");
    try {
      await addComment({
        docId,
        body,
        selectedText: selectedText || undefined,
        authorId: user?.id || "unknown",
        authorName: user?.fullName || user?.firstName || "Unknown",
        mentions,
      });
      setBody("");
    } catch (err) {
      setError(err.message || "Unable to add comment");
    } finally {
      setSaving(false);
    }
  };

  const timeLabel = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <aside className="relative z-[210] w-[320px] border-l border-border bg-card flex flex-col shrink-0 h-full">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground font-sans m-0">Comments</h3>
          <p className="text-xs text-muted font-sans m-0">Use @email to mention a collaborator</p>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-muted text-lg cursor-pointer p-0.5 hover:text-foreground"
        >
          x
        </button>
      </div>

      <div className="p-4 border-b border-border">
        {selectedText && (
          <div className="mb-3 rounded-lg border border-border bg-background-secondary p-2 text-xs text-muted font-sans max-h-20 overflow-hidden">
            {selectedText}
          </div>
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="w-full min-h-24 resize-none rounded-lg border border-border bg-background text-foreground font-sans text-sm p-3 outline-none focus:border-primary/60"
        />
        {mentions.length > 0 && (
          <p className="text-[11px] text-primary font-sans mt-2 mb-0">
            Mentions: {mentions.join(", ")}
          </p>
        )}
        {error && <p className="text-xs text-danger font-sans mt-2 mb-0">{error}</p>}
        <button
          onClick={handleAdd}
          disabled={saving || !body.trim()}
          className="mt-3 w-full bg-primary text-white border-none rounded-lg py-2 text-sm font-sans cursor-pointer hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add comment"}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {!comments ? (
          <div className="p-4 space-y-2">
            <div className="skeleton h-16 rounded" />
            <div className="skeleton h-16 rounded" />
          </div>
        ) : comments.length === 0 ? (
          <p className="p-4 text-xs text-muted font-sans">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`px-4 py-3 border-b border-border ${comment.resolved ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-foreground font-sans m-0">{comment.authorName}</p>
                  <p className="text-[11px] text-muted font-sans mt-0.5 mb-0">{timeLabel(comment.createdAt)}</p>
                </div>
                <button
                  onClick={() =>
                    resolveComment({
                      id: comment._id,
                      docId,
                      resolved: !comment.resolved,
                      actorId: user?.id || "unknown",
                      actorName: user?.fullName || user?.firstName || "Unknown",
                    })
                  }
                  className="bg-badge border border-border rounded-full px-2 py-0.5 text-[10px] text-muted cursor-pointer hover:text-foreground"
                >
                  {comment.resolved ? "Reopen" : "Resolve"}
                </button>
              </div>
              {comment.selectedText && (
                <p className="text-[11px] text-muted bg-background-secondary rounded-md p-2 my-2 font-sans">
                  {comment.selectedText}
                </p>
              )}
              <p className="text-sm text-foreground font-sans mt-2 mb-0 whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
