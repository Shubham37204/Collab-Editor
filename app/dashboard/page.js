"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import CreateDocModal from "../../components/dashboard/CreateDocModal";
import ShareDocModal from "../../components/dashboard/ShareDocModal";
import EmptyState from "../../components/dashboard/EmptyState";
import DocCard from "../../components/DocCard";

/* ── Skeleton loader ── */
function DocCardSkeleton() {
  return (
    <div className="glass-panel flex flex-col justify-between p-6 rounded-2xl min-h-[160px]">
      <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
      <div className="mt-8 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [shareDocId, setShareDocId] = useState(null);

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

  /* ── Handlers ── */
  const handleCreateDoc = async (title, templateContent) => {
    setCreating(true);
    const docTitle = title.trim() || "Untitled Document";
    const docId = await createDoc({
      title: docTitle,
      ownerId: user.id,
      ownerName: user.fullName,
      content: templateContent || "",
    });
    setShowModal(false);
    setCreating(false);
    router.push(`/editor/${docId}`);
  };

  const handleDelete = async (docId) => await deleteDoc({ id: docId });
  const handleToggleStar = async (docId) => await toggleStar({ id: docId });

  const handleShare = async (email, role) => {
    if (!email.trim()) return;
    await addCollab({
      docId: shareDocId,
      userId: email,
      email,
      name: email,
      role,
    });
  };

  const handleMarkAllRead = () => {
    if (user?.id) markAllRead({ userId: user.id });
  };

  /* ── Derived data ── */
  const filteredDocs =
    docs
      ?.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0)) ?? [];

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const shareDoc = docs?.find((d) => d._id === shareDocId);

  /* ── Loading state ── */
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted font-sans mt-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <DashboardHeader
        user={user}
        search={search}
        onSearchChange={setSearch}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto px-8 py-14 relative z-10 w-full">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
        {/* Title row */}
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-sans text-3xl font-semibold tracking-tight m-0 text-foreground">My Documents</h2>
          {docs && docs.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white border-none py-2 px-5 rounded-lg font-sans text-sm font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              + New document
            </button>
          )}
        </div>

        {/* Document list */}
        {docs === undefined ? (
          /* Skeleton loading */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {[...Array(6)].map((_, i) => (
              <DocCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredDocs.length === 0 && search ? (
          <div className="text-center mt-16 animate-fade-in">
            <p className="text-muted font-sans text-sm">
              No documents matching <strong className="text-foreground">{search}</strong>
            </p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <EmptyState onCreateNew={() => setShowModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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

      {/* Modals */}
      <CreateDocModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateDoc}
        creating={creating}
      />

      <ShareDocModal
        open={showShare}
        onClose={() => setShowShare(false)}
        doc={shareDoc}
        user={user}
        onShare={handleShare}
      />

      <footer className="text-center py-8 border-t border-border/40 text-sm text-muted font-sans mt-auto">
        © {new Date().getFullYear()} CollabDocs. Dashboard • Built with Next.js, Liveblocks & Convex.
      </footer>
    </div>
  );
}
