import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function CollaboratorsAlert({ type, message, onDismiss }) {
  if (!message) return null;

  const config = {
    error: {
      icon: <FiAlertCircle className="text-red-500" />,
      colors: "bg-red-50 border-red-100 text-red-800"
    },
    success: {
      icon: <IoCheckmarkCircle className="text-green-500" />,
      colors: "bg-green-50 border-green-100 text-green-800"
    }
  };

  return (
    <div className={`${config[type].colors} px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-fadeIn`}>
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