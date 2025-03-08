import React from "react";
import { FiUsers } from "react-icons/fi";
import { IoExpand, IoContract } from "react-icons/io5";

export default function CollaboratorsHeader({ fullScreen, memberCount, onFullscreenToggle }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FiUsers className="text-white text-xl" />
        <h3 className="font-bold text-lg text-white">Collaborators</h3>
        <span className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5 ml-1">
          {memberCount}
        </span>
      </div>
      <button
        onClick={onFullscreenToggle}
        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {fullScreen ? <IoContract size={20} /> : <IoExpand size={20} />}
      </button>
    </div>
  );
}