import { useEffect, useState, useRef } from "react";
import { database, auth } from "../firebase";
import { ref, onValue, push, set, get } from "firebase/database";
import { Loader } from "../components/Loader";
import { NoteCard } from "../components/NoteCard";
import { CreateNoteForm } from "../components/CreateNoteForm";
import { EmptyState } from "../components/EmptyState";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const unsubscribeDb = useRef(null);

  useEffect(() => {
    const authUnsubscribe = auth.onAuthStateChanged(handleAuthChange);
    return () => {
      authUnsubscribe();
      if (unsubscribeDb.current) unsubscribeDb.current();
    };
  }, []);

  // Add missing handleEmptyNotes function
  const handleEmptyNotes = () => {
    console.log("No notes found for this user.");
    setNotes([]);
    setLoading(false);
  };

  const handleAuthChange = (user) => {
    setAuthChecked(true);
    if (!user) return handleUnauthenticated();
    setupNotesSubscription(user);
  };

  const handleUnauthenticated = () => {
    setNotes([]);
    setLoading(false);
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

  const processNotesData = (data, user) => {
    const userNotes = Object.entries(data)
      .filter(([_, note]) => note.owner === user.uid || note.members?.[user.uid])
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

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const user = auth.currentUser;
      const noteRef = ref(database, `notes/${noteId}`);
      const noteSnapshot = await get(noteRef);

      if (!noteSnapshot.exists() || noteSnapshot.val().owner !== user.uid) {
        throw new Error("Only note owner can delete notes");
      }

      await set(noteRef, null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message);
    }
  };

  if (!authChecked) return <div className="text-center p-4">Verifying authentication...</div>;
  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <CreateNoteForm 
        onCreate={handleCreateNote} 
        error={error}
        setError={setError}
      />

      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}