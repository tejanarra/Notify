import React, { useMemo } from "react";
import MemberItem from "./MemberItem";
import { auth } from "../../firebase";

export default function MemberList({ members, presence, isOwner, onRemoveMember }) {
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aIsCurrent = a.userId === auth.currentUser?.uid;
      const bIsCurrent = b.userId === auth.currentUser?.uid;
      if (aIsCurrent) return -1;
      if (bIsCurrent) return 1;
      return !!presence[b.userId] - !!presence[a.userId] || a.email.localeCompare(b.email);
    });
  }, [members, presence]);

  return (
    <div className="space-y-3">
      {sortedMembers.map((member) => (
        <MemberItem
          key={member.userId}
          {...member}
          isOnline={!!presence[member.userId]}
          isOwner={isOwner}
          onRemove={onRemoveMember}
        />
      ))}
    </div>
  );
}