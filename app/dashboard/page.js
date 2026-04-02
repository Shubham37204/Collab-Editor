"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleCreateDoc = async () => {
    console.log("Creating doc...");
  };

  if (!isLoaded) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">CollabDocs</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Hello, {user?.firstName}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">My Documents</h2>
          <button
            onClick={handleCreateDoc}
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg"
          >
            + New Document
          </button>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">📄</div>
            <p>No documents yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 cursor-pointer transition-colors"
                onClick={() => router.push(`/editor/${doc._id}`)}
              >
                <h3 className="font-medium">{doc.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}