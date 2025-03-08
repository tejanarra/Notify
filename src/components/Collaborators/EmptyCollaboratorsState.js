import React from "react";
import { FiUsers } from "react-icons/fi";
import { IoPersonAdd } from "react-icons/io5";

export default function EmptyCollaboratorsState({ isOwner, onAddMember }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
        <FiUsers className="text-indigo-500 text-2xl" />
      </div>
      <h4 className="font-medium text-gray-700 mb-1">No collaborators yet</h4>
      <p className="text-sm">
        {isOwner 
          ? "Add people to collaborate on this note in real-time" 
          : "You're the only person with access to this note"}
      </p>
      {isOwner && (
        <button 
          onClick={onAddMember}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm flex items-center gap-2 hover:bg-indigo-700"
        >
          <IoPersonAdd size={16} />
          Add collaborator
        </button>
      )}
    </div>
  );
}