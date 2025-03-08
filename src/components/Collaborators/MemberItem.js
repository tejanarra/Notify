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
  
  const statusStyles = {
    current: {
      bg: "bg-gradient-to-r from-pink-500/10 to-fuchsia-600/10",
      border: "border-pink-500/30",
      avatarBg: "bg-gradient-to-r from-pink-500 to-fuchsia-600",
      statusColor: "text-pink-400"
    },
    online: {
      bg: "bg-gradient-to-r from-green-500/10 to-green-600/10",
      border: "border-green-500/30",
      avatarBg: "bg-gradient-to-r from-green-500 to-green-600",
      statusColor: "text-green-400"
    },
    offline: {
      bg: "bg-gray-900",
      border: "border-gray-800",
      avatarBg: "bg-gray-700",
      statusColor: "text-gray-400"
    }
  };
  
  // Determine which style to use
  const style = isCurrentUser ? statusStyles.current : 
               isOnline ? statusStyles.online : 
               statusStyles.offline;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-lg ${style.bg} border ${style.border} transition-all duration-300 hover:shadow-xl group`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/20 ${style.avatarBg}`}
        >
          {getUserInitials(email)}
        </div>
        <MemberInfo
          email={email}
          isCurrentUser={isCurrentUser}
          isOnline={isOnline}
          style={style}
        />
      </div>
      {isOwner && !isCurrentUser && (
        <RemoveButton email={email} onClick={() => onRemove(userId, email)} />
      )}
    </div>
  );
}

const MemberInfo = ({ email, isCurrentUser, isOnline, style }) => (
  <div>
    <div className="text-sm font-medium flex items-center gap-1 text-white">
      {email}
      {isCurrentUser && (
        <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
          You
        </span>
      )}
    </div>
    <OnlineStatus isOnline={isOnline} style={style} />
  </div>
);

const OnlineStatus = ({ isOnline, style }) => (
  <div
    className={`text-xs font-medium flex items-center gap-1 ${style.statusColor}`}
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
    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
    aria-label={`Remove ${email}`}
  >
    <IoPersonRemove size={18} />
  </button>
);