// NotePage.jsx
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

  useEffect(() => {
    if (!auth.currentUser) return;

    const presenceRef = ref(database, `notes/${noteId}/presence/${auth.currentUser.uid}`);
    set(presenceRef, true);
    onDisconnect(presenceRef).remove();

    return () => set(presenceRef, null);
  }, [noteId]);

  useEffect(() => {
    const noteRef = ref(database, `notes/${noteId}`);
    const unsubscribe = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      setNote(data);
      setIsOwner(data?.owner === auth.currentUser?.uid);
    });
    return () => unsubscribe();
  }, [noteId]);

  if (!note) return <Loader />;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="p-4 bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
            {isOwner && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Owner
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Editor Area */}
        <div className="lg:col-span-8 h-[calc(100vh-160px)]">
          <NoteEditor noteId={noteId} />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-[calc(100vh-160px)]">
          <Collaborators noteId={noteId} isOwner={isOwner} />
          <NoteChat noteId={noteId} />
        </div>
      </div>
    </div>
  );
}