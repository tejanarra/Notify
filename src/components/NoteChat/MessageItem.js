import React from "react";
import { FiCheck, FiCheckCircle } from "react-icons/fi";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function MessageItem({ msg, collaborators }) {
  const isSender = msg.sender === collaborators?.uid; // Adjust based on how `collaborators` is structured

  const hasBeenReadByOthers = (msg) => {
    const readers = Object.keys(msg.readBy || {}).filter((uid) => uid !== msg.sender);
    return readers.length > 0;
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[75%] ${
          isSender
            ? "bg-indigo-500 text-white rounded-t-xl rounded-bl-xl"
            : "bg-white border border-gray-200 rounded-t-xl rounded-br-xl shadow-sm"
        } px-4 py-3`}
      >
        <div className={isSender ? "text-white" : "text-gray-800"}>{msg.text}</div>
        <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${isSender ? "text-indigo-100" : "text-gray-400"}`}>
          <span>{formatTimestamp(msg.timestamp)}</span>
          {isSender && (hasBeenReadByOthers(msg) ? <FiCheckCircle className="text-green-400" /> : <FiCheck />)}
        </div>
      </div>
    </div>
  );
}
