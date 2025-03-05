import React, { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { database, auth } from '../firebase';

export default function NoteChat({ noteId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Define chatRef outside useEffect
  const chatRef = ref(database, `notes/${noteId}/chat`);

  useEffect(() => {
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMessages(Object.values(data));
    });
  }, [noteId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    push(chatRef, {
      text: newMessage,
      sender: auth.currentUser.uid,
      timestamp: Date.now(),
      senderEmail: auth.currentUser.email
    });
    setNewMessage('');
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold mb-4">Note Chat</h3>
      <div className="h-48 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-medium text-blue-600">
              {msg.senderEmail}
            </div>
            <div className="text-gray-800">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}