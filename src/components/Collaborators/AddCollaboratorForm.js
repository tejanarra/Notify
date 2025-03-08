import React, { forwardRef } from "react";
import { FiMail } from "react-icons/fi";
import { IoPersonAdd } from "react-icons/io5";

const AddCollaboratorForm = forwardRef(
  ({ email, loading, onEmailChange, onAddMember }, ref) => (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            ref={ref}
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Add collaborator by email"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && onAddMember()}
          />
        </div>
        <button
          onClick={onAddMember}
          disabled={!email.trim() || loading}
          className={`p-3 rounded-full shadow-sm min-w-[44px] ${
            email.trim() && !loading
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
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
