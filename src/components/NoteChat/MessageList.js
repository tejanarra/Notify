import React, { useCallback } from "react";
import { auth } from "../../firebase";
import { FiMessageCircle, FiCheck, FiCheckCircle } from "react-icons/fi";

export const MessageList = ({
  groupedMessages,
  isReadByOthers,
  endOfMessagesRef,
  messages,
}) => (
  <>
    {Object.entries(groupedMessages).map(([date, msgs]) => (
      <div key={date} className="space-y-3">
        <DateSeparator date={date} />
        {msgs.map((msg, index) => (
          <Message
            key={msg.id}
            msg={msg}
            index={index}
            msgs={msgs}
            isReadByOthers={isReadByOthers}
          />
        ))}
      </div>
    ))}

    {messages.length === 0 && <EmptyState />}
    <div ref={endOfMessagesRef} />
  </>
);

const DateSeparator = ({ date }) => (
  <div className="flex justify-center">
    <div className="px-3 py-1 bg-gray-800 border border-pink-500/20 rounded-full text-xs text-gray-300">
      {date === new Date().toLocaleDateString() ? "Today" : date}
    </div>
  </div>
);

const Message = React.memo(({ msg, index, msgs, isReadByOthers }) => {
  const isSender = msg.sender === auth.currentUser?.uid;
  const showAvatar = index === 0 || msgs[index - 1]?.sender !== msg.sender;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[75%] ${
          isSender
            ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20 rounded-t-xl rounded-bl-xl"
            : "bg-gray-800 border border-pink-500/20 text-gray-100 rounded-t-xl rounded-br-xl shadow-sm"
        } px-4 py-3`}
      >
        {!isSender && showAvatar && (
          <div className="text-pink-400 text-xs font-medium mb-1">
            {msg.senderEmail.split("@")[0]}
          </div>
        )}

        {msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="attachment"
            className="rounded-lg mb-2 max-w-full"
          />
        )}

        <div className={isSender ? "text-white" : "text-gray-100"}>
          {msg.text}
        </div>
        <MessageTimestamp
          msg={msg}
          isSender={isSender}
          isReadByOthers={isReadByOthers}
        />
      </div>
    </div>
  );
});

const MessageTimestamp = ({ msg, isSender, isReadByOthers }) => {
  const formatTimestamp = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <div
      className={`text-xs mt-1 flex items-center justify-end gap-1 ${
        isSender ? "text-pink-200" : "text-gray-400"
      }`}
    >
      <span>{formatTimestamp(msg.timestamp)}</span>
      {isSender &&
        (isReadByOthers(msg) ? (
          <FiCheckCircle className="text-green-400" />
        ) : (
          <FiCheck />
        ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-gray-300 text-center">
    <div className="w-16 h-16 bg-gray-800 border border-pink-500/30 rounded-full flex items-center justify-center mb-4">
      <FiMessageCircle className="text-pink-500 text-2xl" />
    </div>
    <h4 className="font-medium text-gray-100 mb-1">No messages yet</h4>
    <p className="text-sm">Start the conversation by sending a message.</p>
  </div>
);