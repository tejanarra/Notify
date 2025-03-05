// components/NoteCard.jsx
import { Link } from "react-router-dom";
import { FaRegFileAlt, FaUser, FaRegClock, FaTrash } from "react-icons/fa";
import { MdDraw } from "react-icons/md";
import { auth } from "../firebase";

export const NoteCard = ({ note, onDelete }) => (
  <Link
    to={`/notes/${note.id}`}
    className="group relative block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-100"
  >
    <button
      onClick={(e) => {
        e.preventDefault();
        onDelete(note.id);
      }}
      className="absolute top-4 right-4 p-2 hover:bg-red-50 rounded-full transition-colors"
    >
      <FaTrash className="w-5 h-5 text-red-400 hover:text-red-600" />
    </button>

    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FaRegFileAlt className="flex-shrink-0 text-blue-500 text-xl" />
        <h3 className="text-xl font-semibold text-gray-900 truncate">
          {note.title || "Untitled Note"}
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <FaRegClock className="flex-shrink-0 mr-2 w-4 h-4" />
          <span>Created {note.createdAt}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <FaUser className="flex-shrink-0 mr-2 w-4 h-4" />
          <span>
            {note.owner === auth.currentUser?.uid
              ? "Your note"
              : `Shared by ${note.ownerEmail || "Unknown User"}`}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
          <MdDraw className="text-sm" />
          <span>Drawings</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">
          <FaRegFileAlt className="text-sm" />
          <span>Notes</span>
        </div>
      </div>
    </div>
  </Link>
);
