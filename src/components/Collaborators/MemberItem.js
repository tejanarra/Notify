import React from "react";
import { IoPersonRemove } from "react-icons/io5";
import { getUserInitials } from "../../utils/utils";
import { auth } from "../../firebase";

export default function MemberItem({
  userId,
  email,
  isOnline,
  isOwner,
  onRemove,
}) {
  const isCurrentUser = userId === auth.currentUser?.uid;
  const statusColor = isCurrentUser ? "indigo" : isOnline ? "green" : "gray";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${
        isCurrentUser
          ? "bg-indigo-50 border border-indigo-100"
          : isOnline
          ? "bg-green-50 border border-green-100"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-${statusColor}-500`}
        >
          {getUserInitials(email)}
        </div>
        <MemberInfo
          email={email}
          isCurrentUser={isCurrentUser}
          isOnline={isOnline}
        />
      </div>
      {isOwner && !isCurrentUser && (
        <RemoveButton email={email} onClick={() => onRemove(userId, email)} />
      )}
    </div>
  );
}

const MemberInfo = ({ email, isCurrentUser, isOnline }) => (
  <div>
    <div className="text-sm font-medium flex items-center gap-1">
      {email}
      {isCurrentUser && (
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
          You
        </span>
      )}
    </div>
    <OnlineStatus isOnline={isOnline} />
  </div>
);

const OnlineStatus = ({ isOnline }) => (
  <div
    className={`text-xs font-medium flex items-center gap-1 ${
      isOnline ? "text-green-600" : "text-gray-500"
    }`}
  >
    {isOnline ? (
      <>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        Online now
      </>
    ) : (
      "Offline"
    )}
  </div>
);

const RemoveButton = ({ email, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
    aria-label={`Remove ${email}`}
  >
    <IoPersonRemove size={18} />
  </button>
);
