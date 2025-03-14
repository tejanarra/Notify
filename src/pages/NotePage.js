import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, set, onDisconnect } from "firebase/database";
import { database, auth } from "../firebase";
import NoteEditor from "../components/NoteEditor";
import Collaborators from "../components/Collaborators/Collaborators";
import NoteChat from "../components/NoteChat/NoteChat";
import {
  FiArrowLeft,
  FiSave,
  FiUsers,
  FiClock,
  FiEdit3,
  FiMessageSquare,
} from "react-icons/fi";

export default function NotePage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState({});
  const [lastEdited, setLastEdited] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");

  useEffect(() => {
    if (!auth.currentUser) return;

    const presenceRef = ref(
      database,
      `notes/${noteId}/presence/${auth.currentUser.uid}`
    );
    set(presenceRef, true);
    onDisconnect(presenceRef).remove();

    return () => set(presenceRef, null);
  }, [noteId]);

  useEffect(() => {
    setLoading(true);

    const noteRef = ref(database, `notes/${noteId}`);
    const unsubscribe = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      if (
        !data ||
        !auth.currentUser ||
        !data.members ||
        !data.members[auth.currentUser.uid]
      ) {
        navigate("/notes", { replace: true });
        return;
      }

      setNote(data);
      setIsOwner(data?.owner === auth.currentUser?.uid);
      setLastEdited(data?.lastEdited || Date.now());
      setLoading(false);
    });

    const presenceRef = ref(database, `notes/${noteId}/presence`);
    const presenceUnsubscribe = onValue(presenceRef, (snapshot) => {
      setActiveUsers(snapshot.val() || {});
    });

    return () => {
      unsubscribe();
      presenceUnsubscribe();
    };
  }, [noteId, navigate]);

  const formatLastEdited = () => {
    if (!lastEdited) return "";

    const date = new Date(lastEdited);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  const activeUserCount = Object.keys(activeUsers).length;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading Note
          </h2>
          <p className="text-pink-300">Getting everything ready...</p>
        </div>
      </div>
    );
  }

  const renderMobileContent = () => {
    switch (activeTab) {
      case "editor":
        return (
          <div className="h-full pb-10 rounded-xl overflow-hidden">
            <NoteEditor noteId={noteId} />
          </div>
        );
      case "chat":
        return (
          <div className="h-full pb-10 flex flex-col bg-gray-900 rounded-lg border border-pink-500/20 overflow-hidden">
            <NoteChat noteId={noteId} />
          </div>
        );
      case "collaborators":
        return (
          <div className="h-full pb-10 flex flex-col bg-gray-900 rounded-lg border border-pink-500/20 overflow-hidden">
            <div className="flex-1 overflow-auto p-2">
              <Collaborators noteId={noteId} isOwner={isOwner} />
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full rounded-xl">
            <NoteEditor noteId={noteId} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-gray-900 border-b border-pink-500/20 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/notes")}
                className="p-1.5 rounded-full hover:bg-gray-800 text-white"
                aria-label="Back to notes"
              >
                <FiArrowLeft size={18} />
              </button>

              <div className="max-w-[60vw]">
                <h1 className="text-lg font-bold text-white truncate">
                  {note.title}
                  {isOwner && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 text-pink-400 text-[11px] rounded-full font-medium border border-pink-500/30">
                      Owner
                    </span>
                  )}
                </h1>

                <div className="flex items-center text-xs text-gray-400 space-x-2.5 mt-0.5">
                  <div className="flex items-center">
                    <FiClock className="mr-1" size={12} />
                    <span>{formatLastEdited()}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-1" size={12} />
                    <span>{activeUserCount} online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center">
              <div className="px-2.5 py-1 bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 text-pink-400 rounded-full text-sm flex items-center border border-pink-500/30">
                <FiSave className="mr-1" size={12} />
                <span>Saved</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-3 lg:p-4">
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 h-[calc(100vh-74px)]">
          <div className="lg:col-span-8 h-full">
            <div className="h-full rounded-xl">
              <NoteEditor noteId={noteId} />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex flex-col h-[45%] min-h-[300px] bg-gray-900 rounded-lg border border-pink-500/20 shadow-lg shadow-pink-500/10">
              <Collaborators noteId={noteId} isOwner={isOwner} />
            </div>
            <div className="flex flex-col h-[55%] min-h-[340px] bg-gray-900 rounded-lg border border-pink-500/20 shadow-lg shadow-pink-500/10">
              <NoteChat noteId={noteId} />
            </div>
          </div>
        </div>

        <div className="lg:hidden h-[calc(100vh-120px)] overflow-hidden">
          {renderMobileContent()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-gray-900 border-t border-pink-500/20 shadow-md z-10">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex flex-col items-center justify-center w-1/3 h-full ${
              activeTab === "editor"
                ? "text-white bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600"
                : "text-gray-400"
            }`}
          >
            <FiEdit3 size={20} />
            <span className="text-xs mt-1">Editor</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center justify-center w-1/3 h-full ${
              activeTab === "chat"
                ? "text-white bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600"
                : "text-gray-400"
            }`}
          >
            <FiMessageSquare size={20} />
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("collaborators")}
            className={`flex flex-col items-center justify-center w-1/3 h-full ${
              activeTab === "collaborators"
                ? "text-white bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600"
                : "text-gray-400"
            }`}
          >
            <FiUsers size={20} />
            <span className="text-xs mt-1">Collaborators</span>
          </button>
        </div>
      </div>
    </div>
  );
}
