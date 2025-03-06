import React, { useEffect, useState, useRef } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { database, auth } from "../firebase";
import { 
  FiUsers, 
  FiX, 
  FiUserPlus, 
  FiCheck, 
  FiUserCheck, 
  FiUserX,
  FiAlertCircle,
  FiMail
} from "react-icons/fi";
import { 
  IoExpand, 
  IoContract, 
  IoPersonAdd, 
  IoPersonRemove,
  IoCheckmarkCircle
} from "react-icons/io5";

export default function Collaborators({ noteId, isOwner }) {
  const [members, setMembers] = useState([]);
  const [presence, setPresence] = useState({});
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const membersRef = ref(database, `notes/${noteId}/members`);
    const presenceRef = ref(database, `notes/${noteId}/presence`);

    const unsubscribeMembers = onValue(membersRef, async (snapshot) => {
      try {
        const membersData = snapshot.val() || {};
        const userIds = Object.keys(membersData);
        const userPromises = userIds.map(async (userId) => {
          const userSnapshot = await get(ref(database, `users/${userId}`));
          return { userId, email: userSnapshot.val()?.email };
        });
        const users = await Promise.all(userPromises);
        setMembers(users.filter((user) => user.email));
        setLoading(false);
      } catch (err) {
        setError("Failed to load members");
        setLoading(false);
      }
    });

    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });

    return () => {
      unsubscribeMembers();
      unsubscribePresence();
    };
  }, [noteId]);

  const handleAddMember = async () => {
    if (!newEmail.trim()) return;
    
    setIsAdding(true);
    try {
      const usersSnapshot = await get(ref(database, "users"));
      const allUsers = usersSnapshot.val() || {};
      const userId = Object.keys(allUsers).find(
        (uid) => allUsers[uid].email?.toLowerCase() === newEmail.toLowerCase()
      );
      
      if (!userId) throw new Error("User not found");
      if (!isOwner) throw new Error("Only owners can add members");

      await set(ref(database, `notes/${noteId}/members/${userId}`), true);
      setNewEmail("");
      setError("");
      setSuccessMessage(`Added ${newEmail} successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId, email) => {
    if (!isOwner) return;
    try {
      await set(ref(database, `notes/${noteId}/members/${userId}`), null);
      setSuccessMessage(`Removed ${email} successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const sortedMembers = members.sort((a, b) => {
    // Current user always first
    if (a.userId === auth.currentUser?.uid) return -1;
    if (b.userId === auth.currentUser?.uid) return 1;
    
    // Then sort by online status
    const aOnline = !!presence[a.userId];
    const bOnline = !!presence[b.userId];
    return bOnline - aOnline || a.email.localeCompare(b.email);
  });

  const getUserInitials = (email) => {
    if (!email) return "?";
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="border rounded-2xl shadow-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
            <div className="h-5 bg-white/20 rounded w-36 animate-pulse"></div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col ${
        fullScreen 
          ? "fixed inset-0 z-50 bg-white" 
          : "border rounded-2xl shadow-lg w-full overflow-hidden"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiUsers className="text-white text-xl" />
          <h3 className="font-bold text-lg text-white">Collaborators</h3>
          <div className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5 ml-1">
            {members.length}
          </div>
        </div>
        <button
          onClick={() => setFullScreen(!fullScreen)}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {fullScreen ? <IoContract size={20} /> : <IoExpand size={20} />}
        </button>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4"
        style={{
          height: fullScreen ? "calc(100vh - 132px)" : "250px",
        }}
      >
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-fadeIn">
            <FiAlertCircle className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError("")} 
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <FiX size={18} />
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-100 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-fadeIn">
            <IoCheckmarkCircle className="text-green-500 flex-shrink-0" />
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage("")} 
              className="ml-auto text-green-400 hover:text-green-600"
            >
              <FiX size={18} />
            </button>
          </div>
        )}
        
        {isOwner && (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Add collaborator by email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
                />
              </div>
              <button
                onClick={handleAddMember}
                disabled={!newEmail.trim() || isAdding}
                className={`p-3 rounded-full shadow-sm flex items-center justify-center min-w-[44px] ${
                  newEmail.trim() && !isAdding
                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition-colors duration-200`}
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <IoPersonAdd size={20} />
                )}
              </button>
            </div>
          </div>
        )}
        
        {sortedMembers.length > 0 ? (
          <div className="space-y-3">
            {sortedMembers.map(({ userId, email }) => {
              const isCurrentUser = userId === auth.currentUser?.uid;
              const isOnline = !!presence[userId];
              const initials = getUserInitials(email);
              
              return (
                <div
                  key={userId}
                  className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${
                    isCurrentUser
                      ? "bg-indigo-50 border border-indigo-100"
                      : isOnline 
                        ? "bg-green-50 border border-green-100" 
                        : "bg-white border border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      isCurrentUser
                        ? "bg-indigo-500"
                        : isOnline
                          ? "bg-green-500"
                          : "bg-gray-400"
                    }`}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium flex items-center gap-1">
                        {email}
                        {isCurrentUser && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className={`text-xs font-medium flex items-center gap-1 ${
                        isOnline ? "text-green-600" : "text-gray-500"
                      }`}>
                        {isOnline ? (
                          <>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Online now
                          </>
                        ) : (
                          "Offline"
                        )}
                      </div>
                    </div>
                  </div>
                  {isOwner && !isCurrentUser && (
                    <button
                      onClick={() => handleRemoveMember(userId, email)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label={`Remove ${email}`}
                      title={`Remove ${email}`}
                    >
                      <IoPersonRemove size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <FiUsers className="text-indigo-500 text-2xl" />
            </div>
            <h4 className="font-medium text-gray-700 mb-1">No collaborators yet</h4>
            <p className="text-sm">
              {isOwner 
                ? "Add people to collaborate on this note in real-time" 
                : "You're the only person with access to this note"}
            </p>
            {isOwner && (
              <button 
                onClick={() => inputRef.current?.focus()} 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <IoPersonAdd size={16} />
                Add collaborator
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}