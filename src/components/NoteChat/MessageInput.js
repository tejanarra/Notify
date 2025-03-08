import React from "react";
import { IoSend } from "react-icons/io5";

export const MessageInput = React.memo(
  ({
    newMessage,
    setNewMessage,
    sendMessage,
    inputRef,
    markMessagesAsRead,
  }) => (
    <div className="p-3 border-t bg-white">
      <div className="flex items-center gap-2">
        <input
          id="messagebox"
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)}
          onFocus={markMessagesAsRead}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Type a message..."
        />
        <button
          onClick={() => sendMessage(newMessage)}
          disabled={!newMessage.trim()}
          className={`p-2.5 rounded-full shadow-sm transition-colors duration-200 ${
            newMessage.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <IoSend />
        </button>
      </div>
    </div>
  )
);
