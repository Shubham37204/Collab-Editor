"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const labels = {
  created: "Created",
  shared: "Shared",
  role_changed: "Role changed",
  collaborator_removed: "Removed",
  access_changed: "Access",
  version_saved: "Version",
  comment_added: "Comment",
  comment_resolved: "Resolved",
  comment_reopened: "Reopened",
};

export default function ActivityPanel({ docId, onClose }) {
  const activity = useQuery(api.documents.getActivity, { docId });

  const timeLabel = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <aside className="w-[300px] border-l border-border bg-card flex flex-col shrink-0 h-full">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground font-sans m-0">Activity</h3>
          <p className="text-xs text-muted font-sans m-0">Recent document events</p>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-muted text-lg cursor-pointer p-0.5 hover:text-foreground"
        >
          x
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {!activity ? (
          <div className="p-4 space-y-2">
            <div className="skeleton h-12 rounded" />
            <div className="skeleton h-12 rounded" />
          </div>
        ) : activity.length === 0 ? (
          <p className="p-4 text-xs text-muted font-sans">No activity yet.</p>
        ) : (
          activity.map((event) => (
            <div key={event._id} className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-primary bg-primary/10 rounded-full px-2 py-0.5 font-sans font-bold">
                  {labels[event.type] || event.type}
                </span>
                <span className="text-[11px] text-muted font-sans">{timeLabel(event.createdAt)}</span>
              </div>
              <p className="text-sm text-foreground font-sans mt-2 mb-0">{event.message}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
