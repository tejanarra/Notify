import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { get, ref, push, onValue, update, child } from "firebase/database";
import { database, auth } from "../../firebase";
import { MessageHeader } from "./MessageHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export default function NoteChat({ noteId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [members, setMembers] = useState({});
  const chatRef = useRef(ref(database, `notes/${noteId}/chat`));
  const membersRef = useRef(ref(database, `notes/${noteId}/members`));
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snapshot = await get(membersRef.current);
        if (snapshot.exists()) setMembers(snapshot.val());
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, [noteId]);

  useEffect(() => {
    const unsubscribe = onValue(chatRef.current, (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
      }));
      setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
    });
    return () => unsubscribe();
  }, [noteId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text, imageUrl = "") => {
    if (!text.trim() && !imageUrl) return;
    
    const messageData = {
      text,
      imageUrl,
      sender: auth.currentUser.uid,
      senderEmail: auth.currentUser.email,
      timestamp: Date.now(),
      readBy: { [auth.currentUser.uid]: true },
    };

    await push(chatRef.current, messageData);
    setNewMessage("");
    inputRef.current?.focus();
  }, []);

  const markMessagesAsRead = useCallback(() => {
    const currentUserUid = auth.currentUser.uid;
    messages.forEach((msg) => {
      if (!msg.readBy?.[currentUserUid]) {
        update(child(chatRef.current, msg.id), {
          [`readBy/${currentUserUid}`]: true,
        });
      }
    });
  }, [messages]);

  const groupMessagesByDate = useMemo(() => {
    return messages.reduce((acc, msg) => {
      const dateStr = new Date(msg.timestamp).toLocaleDateString();
      (acc[dateStr] = acc[dateStr] || []).push(msg);
      return acc;
    }, {});
  }, [messages]);

  const isReadByOthers = useCallback((msg) => {
    if (!msg.readBy) return false;
    const readers = Object.keys(msg.readBy).filter(uid => uid !== msg.sender);
    return readers.length === Object.keys(members).length - 1;
  }, [members]);

  return (
    <div className={`flex flex-col h-full ${
      fullScreen 
        ? "fixed inset-0 z-50 bg-black" 
        : "border border-pink-500/30 rounded-2xl w-full overflow-hidden shadow-lg shadow-pink-500/10"
    }`}>
      <MessageHeader fullScreen={fullScreen} setFullScreen={setFullScreen} />
      
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-black"
        style={{ height: fullScreen ? "calc(100vh - 120px)" : "auto" }}
        onClick={markMessagesAsRead}
      >
        <MessageList
          groupedMessages={groupMessagesByDate}
          isReadByOthers={isReadByOthers}
          members={members}
          endOfMessagesRef={endOfMessagesRef}
          messages={messages}
        />
      </div>

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        inputRef={inputRef}
        markMessagesAsRead={markMessagesAsRead}
      />
    </div>
  );
}