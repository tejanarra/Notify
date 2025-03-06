import { Link } from "react-router-dom";
import { FaUserAlt, FaRegClock, FaTrash, FaBell } from "react-icons/fa";
import { MdEdit, MdMoreHoriz } from "react-icons/md";
import { auth } from "../firebase";
import { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export const NoteCard = ({ note, onDelete }) => {
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const chatRef = ref(database, `notes/${note.id}/chat`);
    
    // Listen to chat updates and check for unread messages
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const unread = Object.values(data).some(
          (msg) => msg.readBy && !msg.readBy[auth.currentUser?.uid]
        );
        setUnreadMessages(unread);
      }
    });

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [note.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(note.id);
    setMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  // Generate a consistent color based on the note title
  const getTitleColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-green-500",
      "bg-amber-500"
    ];
    
    // Use the first character of the title to pick a color
    const titleChar = (note.title || "U").charAt(0).toLowerCase();
    const colorIndex = titleChar.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  // Get first letter of title for the icon
  const getInitial = () => {
    return (note.title || "U").charAt(0).toUpperCase();
  };

  return (
    <Link
      to={`/notes/${note.id}`}
      className="block relative bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Header with title initial and unread indicator */}
        <div className="flex items-center p-4 relative">
          <div className={`w-10 h-10 rounded-lg text-white flex items-center justify-center font-bold text-lg ${getTitleColor()}`}>
            {getInitial()}
          </div>
          
          <div className="ml-3 flex-1 truncate">
            <h3 className="font-semibold text-gray-800 truncate">
              {note.title || "Untitled Note"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaRegClock className="w-3 h-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>
          
          {unreadMessages && (
            <div className="absolute right-12 top-4 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></div>
          )}
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Options"
            >
              <MdMoreHoriz className="w-5 h-5" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 py-1 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                <button
                  onClick={handleDeleteClick}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaTrash className="w-3.5 h-3.5 mr-2" />
                  <span>Delete Note</span>
                </button>
              </div>
            )}
          </div>
        </div>
      
        
        {/* Footer with metadata */}
        <div className="mt-auto px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-xs">
              <MdEdit className="w-3.5 h-3.5" />
            </span>
            {note.owner === auth.currentUser?.uid ? (
              <span className="ml-2 text-xs font-medium text-gray-600">Personal</span>
            ) : (
              <div className="flex items-center ml-1.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-1.5">
                  <FaUserAlt className="w-2.5 h-2.5 text-gray-600" />
                </span>
                <span className="text-xs font-medium text-gray-600 truncate max-w-[80px]">
                  {note.ownerEmail?.split('@')[0] || "Unknown"}
                </span>
              </div>
            )}
          </div>
          
          {unreadMessages && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">
              <FaBell className="w-3 h-3" />
              <span>New</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};