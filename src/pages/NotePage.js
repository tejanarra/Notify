import React, { useEffect, useState, useRef } from "react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef(null);

  const handleFullscreenChange = (fullscreenState) => {
    setIsFullscreen(fullscreenState);
  };

  useEffect(() => {
    const updateContentHeight = () => {
      if (!contentRef.current) return;
      const viewportHeight = window.innerHeight;
      const fixedElementsHeight = isFullscreen ? 0 : 56 + 64;
      const availableHeight = viewportHeight - fixedElementsHeight;
      contentRef.current.style.height = `${availableHeight}px`;
    };

    window.addEventListener("resize", updateContentHeight);
    window.addEventListener("orientationchange", updateContentHeight);
    window.visualViewport?.addEventListener("resize", updateContentHeight);
    window.visualViewport?.addEventListener("scroll", updateContentHeight);
    updateContentHeight();
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.documentElement.style.overscrollBehavior = "none";
    }
    return () => {
      window.removeEventListener("resize", updateContentHeight);
      window.removeEventListener("orientationchange", updateContentHeight);
      window.visualViewport?.removeEventListener("resize", updateContentHeight);
      window.visualViewport?.removeEventListener("scroll", updateContentHeight);
    };
  }, [isFullscreen]);

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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
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

  if (isFullscreen && activeTab === "editor") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
        <div className="flex-1 w-full h-full overflow-hidden">
          <NoteEditor
            noteId={noteId}
            onFullscreenChange={handleFullscreenChange}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>
    );
  }

  const renderMobileContent = () => {
    switch (activeTab) {
      case "editor":
        return (
          <div className="h-full overflow-hidden relative">
            <NoteEditor
              noteId={noteId}
              onFullscreenChange={handleFullscreenChange}
            />
          </div>
        );
      case "chat":
        return (
          <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-pink-500/20 overflow-hidden">
            <NoteChat noteId={noteId} />
          </div>
        );
      case "collaborators":
        return (
          <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-pink-500/20 overflow-hidden">
            <Collaborators noteId={noteId} isOwner={isOwner} />
          </div>
        );
      default:
        return (
          <div className="h-full overflow-hidden">
            <NoteEditor
              noteId={noteId}
              onFullscreenChange={handleFullscreenChange}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      {/* Header - fixed height */}
      <header className="flex-none bg-gray-900 border-b border-pink-500/20 z-10 shadow-sm h-14">
        <div className="px-4 h-full">
          <div className="flex justify-between items-center h-full">
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
                    <span className="ml-1.5 px-1.5 py-0.5 bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 text-pink-400 text-xs rounded-full font-medium border border-pink-500/30">
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
                    <span>{activeUserCount} Collaborators</span>
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

      <div ref={contentRef} className="flex-1 overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 h-full">
          <div className="lg:col-span-8 h-full">
            <div className="h-full rounded-xl overflow-hidden relative">
              <NoteEditor
                noteId={noteId}
                onFullscreenChange={handleFullscreenChange}
              />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            <div className="flex-1 flex flex-col bg-gray-900 rounded-lg border border-pink-500/20 shadow-lg shadow-pink-500/10 overflow-hidden">
              <Collaborators noteId={noteId} isOwner={isOwner} />
            </div>
            <div className="flex-1 flex flex-col bg-gray-900 rounded-lg border border-pink-500/20 shadow-lg shadow-pink-500/10 overflow-hidden">
              <NoteChat noteId={noteId} />
            </div>
          </div>
        </div>

        <div className="lg:hidden flex flex-col p-3 h-full">
          {renderMobileContent()}
        </div>
      </div>

      <div className="flex-none lg:hidden bg-gray-900 border-t border-pink-500/20 shadow-md z-10 h-16">
        <div className="flex justify-around items-center h-full">
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
