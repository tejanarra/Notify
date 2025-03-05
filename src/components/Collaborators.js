import React, { useEffect, useState } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { FiUser, FiX } from "react-icons/fi";
import { database, auth } from "../firebase";

export default function Collaborators({ noteId, isOwner }) {
  const [members, setMembers] = useState([]);
  const [presence, setPresence] = useState({});
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch members and presence data
  useEffect(() => {
    const membersRef = ref(database, `notes/${noteId}/members`);
    const presenceRef = ref(database, `notes/${noteId}/presence`);

    const unsubscribeMembers = onValue(membersRef, async (snapshot) => {
      try {
        const membersData = snapshot.val() || {};
        const userIds = Object.keys(membersData);

        // Get user details
        const userPromises = userIds.map(async (userId) => {
          const userSnapshot = await get(ref(database, `users/${userId}`));
          return { userId, email: userSnapshot.val()?.email };
        });

        const users = await Promise.all(userPromises);
        setMembers(users.filter((user) => user.email));
      } catch (err) {
        setError("Failed to load members");
      }
    });

    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });

    setLoading(false);
    return () => {
      unsubscribeMembers();
      unsubscribePresence();
    };
  }, [noteId]);

  const handleAddMember = async () => {
    if (!newEmail) return;

    try {
      // Find user by email
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!isOwner) return;

    try {
      await set(ref(database, `notes/${noteId}/members/${userId}`), null);
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const sortedMembers = members.sort((a, b) => {
    const aOnline = !!presence[a.userId];
    const bOnline = !!presence[b.userId];
    return bOnline - aOnline || a.email.localeCompare(b.email);
  });

  if (loading) return <div>Loading collaborators...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Collaborators</h3>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Add Member Form */}
      {isOwner && (
        <div className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Add by email"
            className="flex-1 border rounded px-3 py-2 text-sm"
            onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
          />
          <button
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-2">
        {sortedMembers.map(({ userId, email }) => (
          <div
            key={userId}
            className={`flex items-center justify-between p-2 rounded ${
              presence[userId] ? "bg-green-100" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-600" />
              <span className="text-sm">{email}</span>
              {presence[userId] && (
                <span className="text-xs text-green-600">• Online</span>
              )}
            </div>

            {isOwner && userId !== auth.currentUser?.uid && (
              <button
                onClick={() => handleRemoveMember(userId)}
                className="text-red-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
