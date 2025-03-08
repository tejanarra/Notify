import React from "react";
import { FiUsers } from "react-icons/fi";
import { IoPersonAdd } from "react-icons/io5";

export default function EmptyCollaboratorsState({ isOwner, onAddMember }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-400 bg-gray-900 rounded-xl border border-pink-500/20 shadow-lg transition-all duration-300 hover:border-pink-500/30 hover:shadow-xl">
      <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20">
        <FiUsers className="text-pink-400 text-2xl" />
      </div>
      <h4 className="font-medium text-white mb-1">No collaborators yet</h4>
      <p className="text-sm">
        {isOwner 
          ? "Add people to collaborate on this note in real-time" 
          : "You're the only person with access to this note"}
      </p>
      {isOwner && (
        <button 
          onClick={onAddMember}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-full text-sm flex items-center gap-2 hover:from-pink-600 hover:to-fuchsia-700 shadow-lg shadow-pink-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-pink-500/40"
        >
          <IoPersonAdd size={16} />
          Add collaborator
        </button>
      )}
    </div>
  );
}