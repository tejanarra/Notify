import { Link } from "react-router-dom";
import { FaRegFileAlt, FaUser, FaRegClock, FaTrash } from "react-icons/fa";
import { MdDraw } from "react-icons/md";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export const NoteCard = ({ note, onDelete }) => {
  const [unreadMessages, setUnreadMessages] = useState(false);

  useEffect(() => {
    const chatRef = ref(database, `notes/${note.id}/chat`);
    
    // Listen to chat updates and check for unread messages
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const unread = Object.values(data).some(
          (msg) => msg.readBy && !msg.readBy[auth.currentUser?.uid]
        );
        setUnreadMessages(unread); // Update unread message status
      }
    });
  }, [note.id]);

  return (
    <Link
      to={`/notes/${note.id}`}
      className="group relative block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500"
    >
      {/* Display notification if there are unread messages */}
      {unreadMessages && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
          New Messages
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete(note.id);
        }}
        className="absolute top-4 right-4 p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
      >
        <FaTrash className="w-5 h-5 text-red-400 hover:text-red-600" />
      </button>

      <div className="space-y-6">
        {/* Title and Icon */}
        <div className="flex items-center gap-3">
          <FaRegFileAlt className="text-blue-500 text-2xl" />
          <h3 className="text-2xl font-semibold text-gray-900 truncate">
            {note.title || "Untitled Note"}
          </h3>
        </div>

        {/* Metadata Section */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaRegClock className="w-4 h-4 text-gray-500" />
            <span>Created {note.createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaUser className="w-4 h-4 text-gray-500" />
            <span>
              {note.owner === auth.currentUser?.uid
                ? "Your note"
                : `Shared by ${note.ownerEmail || "Unknown User"}`}
            </span>
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
            <MdDraw className="w-4 h-4" />
            <span>Drawings</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">
            <FaRegFileAlt className="w-4 h-4" />
            <span>Notes</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
