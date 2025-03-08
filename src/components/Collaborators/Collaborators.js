import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { ref, onValue, set, get } from "firebase/database";
import { database } from "../../firebase";
import CollaboratorsHeader from "./CollaboratorsHeader";
import CollaboratorsAlert from "./CollaboratorsAlert";
import AddCollaboratorForm from "./AddCollaboratorForm";
import MemberList from "./MemberList";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyCollaboratorsState from "./EmptyCollaboratorsState";

export default function Collaborators({ noteId, isOwner }) {
  const [state, setState] = useState({
    members: [],
    presence: {},
    newEmail: "",
    loading: true,
    error: "",
    success: "",
    fullScreen: false,
    isAdding: false,
  });

  const inputRef = useRef(null);

  const membersRef = useMemo(
    () => ref(database, `notes/${noteId}/members`),
    [noteId]
  );
  const presenceRef = useMemo(
    () => ref(database, `notes/${noteId}/presence`),
    [noteId]
  );

  const updateState = useCallback((newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const fetchUserDetails = useCallback(async (userId) => {
    const snapshot = await get(ref(database, `users/${userId}`));
    return { userId, email: snapshot.val()?.email };
  }, []);

  const handleMembersUpdate = useCallback(
    async (snapshot) => {
      try {
        const membersData = snapshot.val() || {};
        const members = await Promise.all(
          Object.keys(membersData).map(fetchUserDetails)
        );
        updateState({
          members: members.filter((m) => m.email),
          loading: false,
        });
      } catch (err) {
        updateState({ error: "Failed to load members", loading: false });
      }
    },
    [fetchUserDetails, updateState]
  );

  const handlePresenceUpdate = useCallback(
    (snapshot) => {
      updateState({ presence: snapshot.val() || {} });
    },
    [updateState]
  );

  useEffect(() => {
    const unsubscribeMembers = onValue(membersRef, handleMembersUpdate);
    const unsubscribePresence = onValue(presenceRef, handlePresenceUpdate);
    return () => {
      unsubscribeMembers();
      unsubscribePresence();
    };
  }, [membersRef, presenceRef, handleMembersUpdate, handlePresenceUpdate]);

  const handleAddMember = async () => {
    const { newEmail } = state;
    if (!newEmail.trim()) return;

    try {
      updateState({ isAdding: true, error: "" });
      const usersSnapshot = await get(ref(database, "users"));
      const user = findUserByEmail(usersSnapshot.val(), newEmail);

      if (!user) throw new Error("User not found");
      if (!isOwner) throw new Error("Only owners can add members");

      await set(ref(database, `notes/${noteId}/members/${user.id}`), true);
      showSuccess(`Added ${newEmail} successfully`);
      updateState({ newEmail: "" });
    } catch (err) {
      updateState({ error: err.message });
    } finally {
      updateState({ isAdding: false });
    }
  };

  const handleRemoveMember = async (userId, email) => {
    if (!isOwner) return;
    try {
      await set(ref(database, `notes/${noteId}/members/${userId}`), null);
      showSuccess(`Removed ${email} successfully`);
    } catch (err) {
      updateState({ error: "Failed to remove member" });
    }
  };

  const findUserByEmail = (users, email) => {
    const userId = Object.keys(users).find(
      (uid) => users[uid].email?.toLowerCase() === email.toLowerCase()
    );
    return userId ? { id: userId, ...users[userId] } : null;
  };

  const showSuccess = (message) => {
    updateState({ success: message });
    setTimeout(() => updateState({ success: "" }), 3000);
  };

  if (state.loading) return <LoadingSkeleton />;

  return (
    <div
      className={`flex flex-col h-full ${
        state.fullScreen
          ? "fixed inset-0 z-50 bg-black"
          : "border border-pink-500/20 rounded-2xl shadow-lg shadow-pink-500/20 w-full overflow-hidden"
      }`}
    >
      <CollaboratorsHeader
        fullScreen={state.fullScreen}
        memberCount={state.members.length}
        onFullscreenToggle={() =>
          updateState({ fullScreen: !state.fullScreen })
        }
      />

      <div
        className="flex-1 overflow-y-auto bg-gray-900 p-4 space-y-4"
        style={{ height: state.fullScreen ? "calc(100vh - 132px)" : "250px" }}
      >
        <CollaboratorsAlert
          type="error"
          message={state.error}
          onDismiss={() => updateState({ error: "" })}
        />
        <CollaboratorsAlert
          type="success"
          message={state.success}
          onDismiss={() => updateState({ success: "" })}
        />

        {isOwner && (
          <AddCollaboratorForm
            ref={inputRef}
            email={state.newEmail}
            loading={state.isAdding}
            onEmailChange={(e) => updateState({ newEmail: e.target.value })}
            onAddMember={handleAddMember}
          />
        )}

        {state.members.length > 0 ? (
          <MemberList
            members={state.members}
            presence={state.presence}
            isOwner={isOwner}
            onRemoveMember={handleRemoveMember}
          />
        ) : (
          <EmptyCollaboratorsState
            isOwner={isOwner}
            onAddMember={() => inputRef.current?.focus()}
          />
        )}
      </div>
    </div>
  );
}
