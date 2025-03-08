import React from "react";
import { FiMessageCircle } from "react-icons/fi";
import { IoExpand, IoContract } from "react-icons/io5";

export const MessageHeader = React.memo(({ fullScreen, setFullScreen }) => (
  <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-3 flex justify-between items-center shadow-sm">
    <div className="flex items-center gap-2">
      <FiMessageCircle className="text-white text-xl" />
      <h3 className="font-bold text-lg text-white">Collaborative Chat</h3>
    </div>
    <button
      onClick={() => setFullScreen(!fullScreen)}
      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
      aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
    </button>
  </div>
));