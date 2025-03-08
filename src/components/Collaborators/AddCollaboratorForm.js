import React, { forwardRef } from "react";
import { FiMail } from "react-icons/fi";
import { IoPersonAdd } from "react-icons/io5";

const AddCollaboratorForm = forwardRef(
  ({ email, loading, onEmailChange, onAddMember }, ref) => (
    <div className="bg-gray-900 rounded-xl shadow-lg p-4 border border-pink-500/20 hover:border-pink-500/30 transition-all duration-300 hover:shadow-xl group">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400 group-hover:text-pink-400 transition-colors duration-300" />
          </div>
          <input
            ref={ref}
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Add collaborator by email"
            className="w-full pl-10 pr-4 py-3 border border-gray-800 bg-gray-800 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && onAddMember()}
          />
        </div>
        <button
          onClick={onAddMember}
          disabled={!email.trim() || loading}
          className={`p-3 rounded-full shadow-sm min-w-[44px] ${
            email.trim() && !loading
              ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          } transition-all duration-200`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoPersonAdd size={20} />
          )}
        </button>
      </div>
    </div>
  )
);

export default AddCollaboratorForm;
