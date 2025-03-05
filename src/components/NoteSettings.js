import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { database, auth } from "../firebase";

export default function NoteSettings({ noteId, isOwner }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const noteRef = ref(database, `notes/${noteId}/members`);

    const fetchMembers = async () => {
      try {
        const snapshot = await get(noteRef);
        if (snapshot.exists()) {
          const membersData = snapshot.val();
          const userIds = Object.keys(membersData);

          // Fetching user details by userId
          const userPromises = userIds.map(async (userId) => {
            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();
            return { userId, email: userData?.email };
          });

          const users = await Promise.all(userPromises);
          setMembers(users);
        } else {
          setError("No members found");
        }
      } catch (err) {
        setError("Failed to fetch members");
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [noteId]);

  console.log(members);

  const addMember = async () => {
    if (!newMemberEmail) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      // Query users by email
      const usersRef = ref(database, `users`);
      console.log(usersRef);
      const snapshot = await get(usersRef);
      const allUsers = snapshot.val() || {};

      // Find user by email
      const userId = Object.keys(allUsers).find(
        (uid) =>
          allUsers[uid].email?.toLowerCase() === newMemberEmail.toLowerCase()
      );

      if (userId) {
        if (!isOwner) {
          setError("Only note owner can add members");
          return;
        }

        // Add user to the note's members list
        const memberRef = ref(database, `notes/${noteId}/members/${userId}`);
        await set(memberRef, {
          userId: true,
        });

        // Reset input and update local members state
        setNewMemberEmail("");
        const newUser = { userId, email: allUsers[userId]?.email };
        setMembers((prev) => [...prev, newUser]);
        setError("");
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to add member");
      console.error(err);
    }
  };

  const removeMember = async (userId) => {
    const db = getDatabase();
    try {
      if (isOwner) {
        // Remove the member from the note's members list
        const memberRef = ref(db, `notes/${noteId}/members/${userId}`);
        console.log("first", memberRef);
        await set(memberRef, null);
        console.log("secons", memberRef);

        // Update local state
        setMembers((prev) => prev.filter((member) => member.userId !== userId));
      }
    } catch (err) {
      setError("Failed to remove member.");
      console.error("Error removing member:", err);
    }
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">Manage Members</h3>
      <div>
        {isOwner && (
          <div>
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email to add"
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              onClick={addMember}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Member
            </button>
          </div>
        )}

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Current Members:</h4>
          <ul>
            {members.map((member) => (
              <li
                key={member.userId}
                className="flex justify-between items-center"
              >
                <span>{member.email}</span>{" "}
                {/* Display email instead of userId */}
                {isOwner && (
                  <button
                    onClick={() => removeMember(member.userId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
