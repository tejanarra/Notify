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
    
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const unread = Object.values(data).some(
          (msg) => msg.readBy && !msg.readBy[auth.currentUser?.uid]
        );
        setUnreadMessages(unread);
      }
    });

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

  const getTitleColor = () => {
    const colors = [
      "from-pink-500 to-fuchsia-600",
      "from-fuchsia-500 to-purple-600",
      "from-purple-500 to-indigo-600",
      "from-indigo-500 to-blue-600",
      "from-blue-500 to-cyan-600",
      "from-cyan-500 to-teal-600",
      "from-teal-500 to-green-600",
      "from-green-500 to-emerald-600"
    ];
    
    const titleChar = (note.title || "U").charAt(0).toLowerCase();
    const colorIndex = titleChar.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const getInitial = () => {
    return (note.title || "U").charAt(0).toUpperCase();
  };

  return (
    <Link
      to={`/notes/${note.id}`}
      className="block relative bg-gray-900 overflow-hidden rounded-2xl shadow-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex flex-col h-full">
        <div className="flex items-center p-6 relative">
          <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-lg bg-gradient-to-r ${getTitleColor()} shadow-md shadow-pink-500/40`}>
            {getInitial()}
          </div>
          
          <div className="ml-4 flex-1 truncate">
            <h3 className="font-bold text-lg text-white truncate">
              {note.title || "Untitled Note"}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
              <FaRegClock className="w-3 h-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>
          
          {unreadMessages && (
            <div className="absolute right-16 top-6 w-3 h-3 bg-pink-500 rounded-full ring-2 ring-gray-900 shadow-sm shadow-pink-500/50 animate-pulse"></div>
          )}
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Options"
            >
              <MdMoreHoriz className="w-5 h-5" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-xl shadow-lg z-10 border border-pink-500/30">
                <button
                  onClick={handleDeleteClick}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-pink-400 hover:bg-gray-700/80 transition-colors"
                >
                  <FaTrash className="w-4 h-4 mr-3" />
                  <span>Delete Note</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-auto px-6 py-4 border-t border-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-pink-500/20 text-pink-400">
              <MdEdit className="w-4 h-4" />
            </span>
            {note.owner === auth.currentUser?.uid ? (
              <span className="ml-2.5 text-sm font-medium text-gray-400">Personal</span>
            ) : (
              <div className="flex items-center ml-2.5">
                <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                  <FaUserAlt className="w-3 h-3 text-gray-400" />
                </span>
                <span className="text-sm font-medium text-gray-400 truncate max-w-[100px]">
                  {note.ownerEmail?.split('@')[0] || "Unknown"}
                </span>
              </div>
            )}
          </div>
          
          {unreadMessages && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full border border-pink-500/30">
              <FaBell className="w-3 h-3" />
              <span>New messages</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};