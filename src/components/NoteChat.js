// NoteChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { ref, push, onValue } from "firebase/database";
import { database, auth } from "../firebase";
import { FiSend, FiMaximize, FiMinimize } from "react-icons/fi";

export default function NoteChat({ noteId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const chatRef = ref(database, `notes/${noteId}/chat`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
      }));
      setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
    });
    return () => unsubscribe();
  }, [noteId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const messageData = {
      text,
      sender: auth.currentUser.uid,
      senderEmail: auth.currentUser.email,
      timestamp: Date.now(),
      readBy: { [auth.currentUser.uid]: true },
    };

    push(ref(database, `notes/${noteId}/chat`), messageData);
    setNewMessage("");
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-sm border ${fullscreen ? "fixed inset-0 z-50" : "h-full"}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-lg">Chat</h3>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {fullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === auth.currentUser.uid ? "items-end" : "items-start"}`}
          >
            <div className={`max-w-[80%] p-3 rounded-xl ${
              msg.sender === auth.currentUser.uid 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100"
            }`}>
              <div className="text-sm font-medium mb-1">
                {msg.sender === auth.currentUser.uid ? "You" : msg.senderEmail}
              </div>
              <p className="text-sm">{msg.text}</p>
              <div className="flex items-center justify-end gap-2 mt-2 text-xs opacity-75">
                <span>{formatTimestamp(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => sendMessage(newMessage)}
            className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}