// Collaborators.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { FiUser, FiX, FiPlus } from "react-icons/fi";
import { database, auth } from "../firebase";

export default function Collaborators({ noteId, isOwner }) {
  const [members, setMembers] = useState([]);
  const [presence, setPresence] = useState({});
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const membersRef = ref(database, `notes/${noteId}/members`);
    const presenceRef = ref(database, `notes/${noteId}/presence`);

    const unsubscribeMembers = onValue(membersRef, async (snapshot) => {
      try {
        const membersData = snapshot.val() || {};
        const userIds = Object.keys(membersData);
        const users = await Promise.all(
          userIds.map(async (userId) => {
            const userSnapshot = await get(ref(database, `users/${userId}`));
            return { userId, email: userSnapshot.val()?.email };
          })
        );
        setMembers(users.filter(user => user.email));
      } catch (err) {
        setError("Failed to load members");
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
    // Keep existing add member logic
  };

  const handleRemoveMember = async (userId) => {
    // Keep existing remove member logic
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Collaborators</h3>
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {isOwner && (
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add collaborator by email"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
            />
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FiPlus size={18} />
            </button>
          </div>
        )}

        <div className="space-y-2">
          {members.map(({ userId, email }) => (
            <div
              key={userId}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiUser className="text-blue-600" />
                  </div>
                  {presence[userId] && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{email}</p>
                  <p className="text-sm text-gray-500">
                    {presence[userId] ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              {isOwner && userId !== auth.currentUser?.uid && (
                <button
                  onClick={() => handleRemoveMember(userId)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}