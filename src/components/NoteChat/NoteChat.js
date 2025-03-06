import React, { useState, useEffect } from "react";
import { ref, onValue } from "../../firebase";
import { database } from "../../firebase";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import FullscreenButton from "./FullscreenButton";

export default function NoteChat({ noteId }) {
  const [messages, setMessages] = useState([]);
  const [collaborators, setCollaborators] = useState({});
  const [fullScreen, setFullScreen] = useState(false);
  const chatRef = ref(database, `notes/${noteId}/chat`);
  const membersRef = ref(database, `notes/${noteId}/members`);

  useEffect(() => {
    const unsubscribeMessages = onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
      }));
      setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
    });

    const unsubscribeMembers = onValue(membersRef, (snapshot) => {
      setCollaborators(snapshot.val() || {});
    });

    return () => {
      unsubscribeMessages();
      unsubscribeMembers();
    };
  }, [noteId]);

  return (
    <div
      className={`flex flex-col ${
        fullScreen
          ? "fixed inset-0 z-50 bg-white"
          : "border rounded-2xl shadow-lg w-full overflow-hidden"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center shadow-sm">
        <h3 className="font-bold text-lg text-white">Collaborative Chat</h3>
        <FullscreenButton
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
        />
      </div>

      <MessageList
        messages={messages}
        collaborators={collaborators}
        fullScreen={fullScreen}
      />
      <MessageInput noteId={noteId} />
    </div>
  );
}
