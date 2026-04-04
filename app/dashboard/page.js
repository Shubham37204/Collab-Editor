"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../layout";
import DocCard from "../../components/DocCard";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { theme, dark, setDark } = useTheme();
  const notifRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareDocId, setShareDocId] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("editor");

  const docs = useQuery(api.documents.getMyDocs, { ownerId: user?.id ?? "" });
  const notifications = useQuery(api.notifications.getMyNotifications, {
    userId: user?.id ?? "",
  });
  const createDoc = useMutation(api.documents.createDoc);
  const deleteDoc = useMutation(api.documents.deleteDoc);
  const toggleStar = useMutation(api.documents.toggleStar);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const addCollab = useMutation(api.documents.addCollaborator);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreateDoc = async () => {
    setCreating(true);
    const title = newTitle.trim() || "Untitled Document";
    const docId = await createDoc({
      title,
      ownerId: user.id,
      ownerName: user.fullName,
    });
    setShowModal(false);
    setNewTitle("");
    setCreating(false);
    router.push(`/editor/${docId}`);
  };

  const handleDelete = async (docId) => await deleteDoc({ id: docId });
  const handleToggleStar = async (docId) => await toggleStar({ id: docId });

  const handleShare = async () => {
    if (!shareEmail.trim()) return;
    await addCollab({
      docId: shareDocId,
      userId: shareEmail,
      email: shareEmail,
      name: shareEmail,
      role: shareRole,
    });
    setShareEmail("");
  };

  const handleBellClick = () => {
    setShowNotifs((v) => !v);
    if (!showNotifs && user?.id) markAllRead({ userId: user.id });
  };

  const filteredDocs =
    docs
      ?.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0)) ?? [];

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const shareDoc = docs?.find((d) => d._id === shareDocId);

  if (!isLoaded)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.bg,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: theme.muted,
            fontFamily: theme.sans,
          }}
        >
          Loading...
        </span>
      </div>
    );

  const ghostBtn = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: theme.muted,
    fontFamily: theme.sans,
    fontSize: "13px",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "color 0.15s",
  };

  const inputStyle = {
    background: theme.badge,
    border: `1px solid ${theme.border}`,
    color: theme.text,
    fontFamily: theme.sans,
    fontSize: "13px",
    outline: "none",
    borderRadius: "20px",
    padding: "7px 16px",
  };

  const modalInput = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    background: theme.bg,
    color: theme.text,
    fontFamily: theme.sans,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.15s",
  };

  const accentBtn = {
    background: theme.accent,
    color: "#fff",
    border: "none",
    padding: "9px 20px",
    borderRadius: "6px",
    fontFamily: theme.sans,
    fontSize: "13px",
    cursor: "pointer",
    transition: "opacity 0.15s",
  };
  
  const cancelBtn = {
    background: theme.badge,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    padding: "9px 20px",
    borderRadius: "6px",
    fontFamily: theme.sans,
    fontSize: "13px",
    cursor: "pointer",
  };

  return (
    <div
      style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}
    >
      {/* ══════════════════════════════════════════════
          [FEATURE 1] Sticky navbar
      ══════════════════════════════════════════════ */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 48px",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bg,
          position: "sticky",
          top: 0,
          zIndex: 20,
          transition: "background 0.3s",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <rect
              x="4"
              y="2"
              width="16"
              height="20"
              rx="3"
              fill={theme.accent + "33"}
              stroke={theme.accent}
              strokeWidth="1.5"
            />
            <path
              d="M8 8h8M8 12h8M8 16h5"
              stroke={theme.accent}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="21" cy="21" r="5" fill={theme.accent} />
            <path
              d="M19.5 21.5l1 1 2-2"
              stroke="#fff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: theme.serif,
              fontWeight: "700",
              fontSize: "17px",
              color: theme.text,
            }}
          >
            CollabDocs
          </span>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* [FEATURE 3] Search */}
          <input
            style={{ ...inputStyle, width: "210px" }}
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* [FEATURE 2] Notification bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={handleBellClick}
              style={{
                ...ghostBtn,
                position: "relative",
                padding: "6px 8px",
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                background: showNotifs ? theme.badge : "transparent",
              }}
            >
              <span style={{ fontSize: "16px" }}>🔔</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    background: "#e85555",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: "700",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifs && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "44px",
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "10px",
                  width: "300px",
                  maxHeight: "360px",
                  overflow: "auto",
                  zIndex: 100,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: `1px solid ${theme.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: theme.accent,
                        fontFamily: theme.sans,
                      }}
                    >
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {!notifications || notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      color: theme.muted,
                      fontSize: "13px",
                      fontFamily: theme.sans,
                    }}
                  >
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        router.push(`/editor/${n.docId}`);
                        setShowNotifs(false);
                      }}
                      style={{
                        padding: "12px 16px",
                        background: n.read
                          ? "transparent"
                          : theme.accent + "11",
                        borderBottom: `1px solid ${theme.border}`,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: theme.text,
                          fontFamily: theme.sans,
                        }}
                      >
                        {n.message}
                      </p>
                      <p
                        style={{
                          margin: "3px 0 0",
                          fontSize: "11px",
                          color: theme.muted,
                          fontFamily: theme.sans,
                        }}
                      >
                        {n.docTitle}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              ...ghostBtn,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "6px 14px",
            }}
          >
            {dark ? "☀ Light" : "☾ Dark"}
          </button>        

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "13px",
                color: theme.muted,
                fontFamily: theme.sans,
              }}
            >
              {user?.firstName}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          Main content
      ══════════════════════════════════════════════ */}
      <main
        style={{ maxWidth: "860px", margin: "0 auto", padding: "56px 32px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: theme.serif,
              fontSize: "32px",
              fontWeight: "400",
              margin: 0,
            }}
          >
            My Documents
          </h2>
          {docs && docs.length > 0 && (
            <button onClick={() => setShowModal(true)} style={accentBtn}>
              + New document
            </button>
          )}
        </div>

        {/* Doc list */}
        {docs === undefined ? (
          <p
            style={{
              color: theme.muted,
              fontFamily: theme.sans,
              fontSize: "14px",
            }}
          >
            Loading documents...
          </p>
        ) : filteredDocs.length === 0 && search ? (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <p
              style={{
                color: theme.muted,
                fontFamily: theme.sans,
                fontSize: "14px",
              }}
            >
              No documents matching <strong>{search}</strong>
            </p>
          </div>
        ) : filteredDocs.length === 0 ? (
          /* [FEATURE 8] Empty state */
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 28 28"
              fill="none"
              style={{ margin: "0 auto 20px", display: "block", opacity: 0.3 }}
            >
              <rect
                x="4"
                y="2"
                width="16"
                height="20"
                rx="3"
                stroke={theme.text}
                strokeWidth="1.5"
              />
              <path
                d="M8 8h8M8 12h8M8 16h5"
                stroke={theme.text}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <h3
              style={{
                fontFamily: theme.serif,
                fontSize: "22px",
                fontWeight: "400",
                marginBottom: "8px",
                color: theme.text,
              }}
            >
              No documents yet.
            </h3>
            <p
              style={{
                color: theme.muted,
                fontSize: "14px",
                fontFamily: theme.sans,
                marginBottom: "24px",
              }}
            >
              Create your first document to get started.
            </p>
            <button onClick={() => setShowModal(true)} style={accentBtn}>
              + New document
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "4px" }}>
            {filteredDocs.map((doc) => (
              <DocCard
                key={doc._id}
                doc={doc}
                onClick={() => router.push(`/editor/${doc._id}`)}
                onDelete={handleDelete}
                onStar={() => handleToggleStar(doc._id)}
                onShare={() => {
                  setShareDocId(doc._id);
                  setShowShare(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════
          [FEATURE 4] Create document modal
      ══════════════════════════════════════════════ */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setNewTitle("");
            }
          }}
        >
          <div
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "14px",
              padding: "32px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h3
              style={{
                fontFamily: theme.serif,
                fontSize: "20px",
                fontWeight: "400",
                marginBottom: "20px",
                color: theme.text,
              }}
            >
              New document
            </h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateDoc()}
              placeholder="Document title..."
              style={modalInput}
              autoFocus
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTitle("");
                }}
                style={cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDoc}
                disabled={creating}
                style={{
                  ...accentBtn,
                  opacity: creating ? 0.65 : 1,
                  cursor: creating ? "not-allowed" : "pointer",
                }}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          [FEATURE 5] Share modal
      ══════════════════════════════════════════════ */}
      {showShare && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowShare(false);
          }}
        >
          <div
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "14px",
              padding: "32px",
              width: "100%",
              maxWidth: "460px",
            }}
          >
            {/* Header + close */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "6px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: theme.serif,
                    fontSize: "18px",
                    fontWeight: "400",
                    margin: 0,
                    color: theme.text,
                  }}
                >
                  Manage who can view this document
                </h3>
                <p
                  style={{
                    fontFamily: theme.sans,
                    fontSize: "12px",
                    color: theme.muted,
                    margin: "4px 0 0",
                  }}
                >
                  Invite collaborators by email
                </p>
              </div>
              <button
                onClick={() => setShowShare(false)}
                style={{ ...ghostBtn, fontSize: "18px", padding: "2px 8px" }}
              >
                ×
              </button>
            </div>

            {/* Invite row */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <input
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShare()}
                placeholder="Enter email address"
                style={{ ...modalInput, flex: 1 }}
              />
              {/* Role selector */}
              <select
                value={shareRole}
                onChange={(e) => setShareRole(e.target.value)}
                style={{
                  background: theme.badge,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontFamily: theme.sans,
                  fontSize: "12px",
                  borderRadius: "6px",
                  padding: "0 10px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="editor">can edit</option>
                <option value="viewer">can view</option>
              </select>
              <button
                onClick={handleShare}
                style={{
                  ...accentBtn,
                  padding: "9px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                Invite
              </button>
            </div>

            {/* Collaborator list */}
            <div
              style={{
                borderTop: `1px solid ${theme.border}`,
                paddingTop: "16px",
              }}
            >
              {/* Owner row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: theme.accent + "33",
                      border: `1px solid ${theme.accent}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      color: theme.accent,
                    }}
                  >
                    {user?.firstName?.[0]}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontFamily: theme.sans,
                        color: theme.text,
                      }}
                    >
                      {user?.fullName}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontFamily: theme.sans,
                        color: theme.muted,
                      }}
                    >
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: theme.muted,
                    fontFamily: theme.sans,
                  }}
                >
                  Owner
                </span>
              </div>

              {/* Other collaborators */}
              {shareDoc?.collaborators?.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: theme.badge,
                        border: `1px solid ${theme.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        color: theme.muted,
                      }}
                    >
                      {c.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontFamily: theme.sans,
                          color: theme.text,
                        }}
                      >
                        {c.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          fontFamily: theme.sans,
                          color: theme.muted,
                        }}
                      >
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: theme.accent + "22",
                      color: theme.accent,
                      fontFamily: theme.sans,
                    }}
                  >
                    {c.role === "editor" ? "can edit" : "can view"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
