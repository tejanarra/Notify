import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, set, onDisconnect } from "firebase/database";
import { database, auth } from "../firebase";
import NoteEditor from "../components/NoteEditor";
import Collaborators from "../components/Collaborators";
import NoteChat from "../components/NoteChat";
import { Loader } from "../components/Loader";

export default function NotePage() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Track user presence
  useEffect(() => {
    if (!auth.currentUser) return;

    const presenceRef = ref(
      database,
      `notes/${noteId}/presence/${auth.currentUser.uid}`
    );
    set(presenceRef, true);
    onDisconnect(presenceRef).remove();

    return () => {
      set(presenceRef, null); // Clean up presence when the user leaves or the component is unmounted
    };
  }, [noteId]);

  // Load note data
  useEffect(() => {
    const noteRef = ref(database, `notes/${noteId}`);
    onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      setNote(data);

      // Check if the current user is the owner (admin)
      if (data?.owner === auth.currentUser?.uid) {
        setIsOwner(true);
      } else {
        setIsOwner(false); // User is not the owner
      }
    });
  }, [noteId]);

  if (!note) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
        {isOwner && (
          <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
            Owner
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NoteEditor noteId={noteId} />
        </div>

        <div className="space-y-6">
          <NoteChat noteId={noteId} />
          <Collaborators noteId={noteId} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
