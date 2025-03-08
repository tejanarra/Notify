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
    <div className="p-3 border-t border-pink-500/20 bg-gray-900">
      <div className="flex items-center gap-2">
        <input
          id="messagebox"
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)}
          onFocus={markMessagesAsRead}
          className="flex-1 bg-gray-800 text-gray-100 border border-pink-500/30 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={() => sendMessage(newMessage)}
          disabled={!newMessage.trim()}
          className={`p-2.5 rounded-full shadow-sm transition-colors duration-200 ${
            newMessage.trim()
              ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 shadow-lg shadow-pink-500/30"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <IoSend />
        </button>
      </div>
    </div>
  )
);