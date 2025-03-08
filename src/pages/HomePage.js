import { useEffect, useState, useRef } from "react";
import { database, auth } from "../firebase";
import { ref, onValue, push, set, get } from "firebase/database";
import { Loader } from "../components/Loader";
import { NoteCard } from "../components/NoteCard";
import { CreateNoteForm } from "../components/CreateNoteForm";
import { EmptyState } from "../components/EmptyState";
import { AlertModal } from "../components/AlertModal.js";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const unsubscribeDb = useRef(null);

  useEffect(() => {
    const handleAuthChange = (user) => {
      setAuthChecked(true);
      if (!user) return handleUnauthenticated();
      setupNotesSubscription(user);
    };
    const setupNotesSubscription = (user) => {
      try {
        const notesRef = ref(database, "notes");
        unsubscribeDb.current = onValue(
          notesRef,
          (snapshot) => handleSnapshot(snapshot, user),
          handleError
        );
      } catch (error) {
        handleConnectionError(error);
      }
    };
    const handleSnapshot = (snapshot, user) => {
      if (!snapshot.exists()) return handleEmptyNotes();
      processNotesData(snapshot.val(), user);
    };
    const authUnsubscribe = auth.onAuthStateChanged(handleAuthChange);
    return () => {
      authUnsubscribe();
      if (unsubscribeDb.current) unsubscribeDb.current();
    };
  }, []);

  const handleEmptyNotes = () => {
    console.log("No notes found for this user.");
    setNotes([]);
    setLoading(false);
  };

  const handleUnauthenticated = () => {
    setNotes([]);
    setLoading(false);
  };

  const processNotesData = (data, user) => {
    const userNotes = Object.entries(data)
      .filter(
        ([_, note]) => note.owner === user.uid || note.members?.[user.uid]
      )
      .map(([id, note]) => ({
        id,
        ...note,
        createdAt: new Date(note.createdAt).toLocaleDateString(),
      }));
    setNotes(userNotes);
    setLoading(false);
  };

  const handleError = (error) => {
    console.error("Database error:", error);
    setError(
      error.code === "PERMISSION_DENIED"
        ? "You don't have permission to view notes"
        : "Failed to load notes"
    );
    setLoading(false);
  };

  const handleConnectionError = (error) => {
    console.error("Connection error:", error);
    setError("Database connection failed");
    setLoading(false);
  };

  const handleCreateNote = async (title) => {
    try {
      const user = auth.currentUser;
      const newNoteRef = push(ref(database, "notes"));

      await set(newNoteRef, {
        title,
        owner: user.uid,
        ownerEmail: user.email,
        createdAt: Date.now(),
        members: { [user.uid]: true },
        content: { text: "", drawing: [] },
      });
    } catch (err) {
      handleNoteCreationError(err);
    }
  };

  const handleNoteCreationError = (err) => {
    console.error("Note creation error:", err);
    setError(
      err.code === "PERMISSION_DENIED"
        ? "Note creation failed: Check permissions"
        : "Failed to create note. Please try again."
    );
  };

  const handleDeleteNote = (noteId) => {
    setNoteToDelete(noteId);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const user = auth.currentUser;
      const noteRef = ref(database, `notes/${noteToDelete}`);
      const noteSnapshot = await get(noteRef);

      if (!noteSnapshot.exists() || noteSnapshot.val().owner !== user.uid) {
        throw new Error("Only note owner can delete notes");
      }

      await set(noteRef, null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (!authChecked)
    return (
      <div className="text-center p-4 bg-black text-pink-400">
        Verifying authentication...
      </div>
    );
  if (loading) return <Loader />;

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 text-white min-h-screen p-6 relative">
      <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600">
              My Workspace
            </h1>
            <p className="text-gray-300 mt-2">
              Create and collaborate on visual notes and ideas
            </p>
          </div>

          <CreateNoteForm
            onCreate={handleCreateNote}
            error={error}
            setError={setError}
          />
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader />
          </div>
        ) : notes.length === 0 ? (
          <div className="mt-12">
            <EmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => handleDeleteNote(note.id)}
                className="bg-gray-900 border border-pink-500/20 hover:border-pink-500/40 shadow-lg rounded-xl overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20"
              />
            ))}
          </div>
        )}
      </div>

      <AlertModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDeleteNote}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="default"
      />
    </div>
  );
}
