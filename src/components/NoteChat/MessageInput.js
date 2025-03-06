import React, { useState, useRef } from "react";
import { ref, push } from "firebase/database";
import { database, auth } from "../../firebase";
import { IoSend } from "react-icons/io5";

export default function MessageInput({ noteId }) {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);
  const chatRef = ref(database, `notes/${noteId}/chat`);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const messageData = {
      text,
      sender: auth.currentUser.uid,
      senderEmail: auth.currentUser.email,
      timestamp: Date.now(),
      readBy: { [auth.currentUser.uid]: true },
    };

    push(chatRef, messageData);
    setNewMessage("");
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)}
          className="flex-1 border border-gray-200 rounded-full px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          placeholder="Type a message..."
        />
        <button
          onClick={() => sendMessage(newMessage)}
          disabled={!newMessage.trim()}
          className={`p-3 rounded-full shadow-sm ${newMessage.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
