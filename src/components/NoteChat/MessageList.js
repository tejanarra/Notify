import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, collaborators, fullScreen }) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupMessagesByDate = () => {
    const grouped = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      const dateStr = date.toLocaleDateString();
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      style={{ height: fullScreen ? "calc(100vh - 132px)" : "300px" }}
    >
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="space-y-3">
          <div className="flex justify-center">
            <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600 inline-block">
              {date === new Date().toLocaleDateString() ? "Today" : date}
            </div>
          </div>
          {msgs.map((msg) => (
            <MessageItem key={msg.id} msg={msg} collaborators={collaborators} />
          ))}
        </div>
      ))}

      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
          <h4 className="font-medium text-gray-700 mb-1">No messages yet</h4>
          <p className="text-sm">Start the conversation by sending a message.</p>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
}
