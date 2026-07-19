"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import CreateDocModal from "../../components/dashboard/CreateDocModal";
import ShareDocModal from "../../components/dashboard/ShareDocModal";
import EmptyState from "../../components/dashboard/EmptyState";
import DocCard from "../../components/DocCard";


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
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [recentCutoff] = useState(() => Date.now() - 1000 * 60 * 60 * 24 * 7);
  const [showShare, setShowShare] = useState(false);
  const [shareDocId, setShareDocId] = useState(null);

  const docs = useQuery(api.documents.getMyDocs, { 
    ownerId: user?.id ?? "",
    email: user?.emailAddresses[0]?.emailAddress ?? ""
  });
  const createDoc = useMutation(api.documents.createDoc);
  const deleteDoc = useMutation(api.documents.deleteDoc);
  const toggleStar = useMutation(api.documents.toggleStar);
  const addCollab = useMutation(api.documents.addCollaborator);
  const updateCollabRole = useMutation(api.documents.updateCollaboratorRole);
  const removeCollab = useMutation(api.documents.removeCollaborator);
  const togglePublicAccess = useMutation(api.documents.togglePublicAccess);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);


  const handleCreateDoc = async (title, templateContent) => {
    setCreating(true);
    setError("");
    try {
      const docTitle = title.trim() || "Untitled Document";
      const docId = await createDoc({
        title: docTitle,
        ownerId: user.id,
        ownerName: user.fullName || user.firstName || "Unknown",
        content: templateContent || "",
      });
      setShowModal(false);
      router.push(`/editor/${docId}`);
    } catch (err) {
      setError(err.message || "Unable to create document");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (docId) => {
    setError("");
    try {
      await deleteDoc({ id: docId, userId: user.id });
    } catch (err) {
      setError(err.message || "Unable to delete document");
    }
  };
  const handleToggleStar = async (docId) => {
    setError("");
    try {
      await toggleStar({
        id: docId,
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress ?? "",
      });
    } catch (err) {
      setError(err.message || "Unable to update starred state");
    }
  };

  const handleShare = async (email, role) => {
    if (!email.trim()) return;
    await addCollab({
      docId: shareDocId,
      userId: email,
      email,
      name: email,
      role,
      actorId: user.id,
      actorName: user.fullName || user.firstName || "Unknown",
    });
  };

  const handleUpdateRole = async (email, role) => {
    await updateCollabRole({
      docId: shareDocId,
      email,
      role,
      actorId: user.id,
      actorName: user.fullName || user.firstName || "Unknown",
    });
  };

  const handleRemoveCollaborator = async (email) => {
    await removeCollab({
      docId: shareDocId,
      email,
      actorId: user.id,
      actorName: user.fullName || user.firstName || "Unknown",
    });
  };

  const handleTogglePublic = async (isPublic) => {
    await togglePublicAccess({
      docId: shareDocId,
      isPublic,
      actorId: user.id,
      actorName: user.fullName || user.firstName || "Unknown",
    });
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredDocs =
    docs
      ?.filter((d) => {
        const isOwned = d.ownerId === user?.id;
        const isShared = !isOwned;
        const updatedAt = d.updatedAt || d._creationTime;
        const isRecent = updatedAt >= recentCutoff;
        if (filter === "owned" && !isOwned) return false;
        if (filter === "shared" && !isShared) return false;
        if (filter === "starred" && !d.starred) return false;
        if (filter === "recent" && !isRecent) return false;
        if (!normalizedSearch) return true;
        return [
          d.title,
          d.content,
          d.ownerName,
          ...(d.collaborators || []).map((c) => `${c.name} ${c.email}`),
        ].some((value) => value?.toLowerCase().includes(normalizedSearch));
      })
      .sort((a, b) => {
        if (a.starred !== b.starred) return b.starred ? 1 : -1;
        return (b.updatedAt || b._creationTime) - (a.updatedAt || a._creationTime);
      }) ?? [];

  const shareDoc = docs?.find((d) => d._id === shareDocId);


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
        filter={filter}
        onFilterChange={setFilter}
      />


      <main className="flex-1 max-w-6xl mx-auto px-8 pt-16 pb-14 relative z-10 w-full">
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

        {error && (
          <div className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger font-sans">
            {error}
          </div>
        )}


        {docs === undefined ? (
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
        onUpdateRole={handleUpdateRole}
        onRemoveCollaborator={handleRemoveCollaborator}
        onTogglePublic={handleTogglePublic}
      />

      <footer className="text-center py-8 border-t border-border/40 text-sm text-muted font-sans mt-auto">
        © {new Date().getFullYear()} CollabDocs. Dashboard • Built with Next.js, Liveblocks & Convex.
      </footer>
    </div>
  );
}
