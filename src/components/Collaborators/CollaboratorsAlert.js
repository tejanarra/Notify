import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function CollaboratorsAlert({ type, message, onDismiss }) {
  if (!message) return null;

  const config = {
    error: {
      icon: <FiAlertCircle className="text-red-400" />,
      colors: "bg-gray-900 border-red-500/30 text-red-400"
    },
    success: {
      icon: <IoCheckmarkCircle className="text-green-400" />,
      colors: "bg-gray-900 border-green-500/30 text-green-400"
    }
  };

  return (
    <div className={`${config[type].colors} px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-fadeIn border shadow-lg transition-all duration-300`}>
      {config[type].icon}
      <span>{message}</span>
      <button 
        onClick={onDismiss}
        className="ml-auto text-current hover:opacity-70"
      >
        <FiX size={18} />
      </button>
    </div>
  );
}