// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useMemo,
//   useCallback,
// } from "react";
// import { get, ref, push, onValue, update, child } from "firebase/database";
// import { database, auth } from "../firebase";
// import { IoSend, IoExpand, IoContract } from "react-icons/io5";
// import { FiMessageCircle, FiCheck, FiCheckCircle } from "react-icons/fi";

// export default function NoteChat({ noteId }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [fullScreen, setFullScreen] = useState(false);
//   const chatRef = ref(database, `notes/${noteId}/chat`);
//   const [members, setMembers] = useState([]);
//   const membersRef = ref(database, `notes/${noteId}/members`);
//   const messagesRef = useRef({});
//   const endOfMessagesRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     console.log("fetching members");

//     const fetchMembers = async () => {
//       try {
//         const snapshot = await get(membersRef);

//         if (snapshot.exists()) {
//           console.log(snapshot.val());
//           setMembers(snapshot.val()); // Store members in state
//         } else {
//           console.log("No members found.");
//         }
//       } catch (error) {
//         console.error("Error fetching members:", error);
//       }
//     };

//     fetchMembers();
//   }, [noteId]);

//   useEffect(() => {
//     console.log("fetching messages");

//     const unsubscribe = onValue(chatRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       const messagesArray = Object.entries(data).map(([key, value]) => ({
//         ...value,
//         id: key,
//       }));
//       setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
//       messagesRef.current = data;
//     });

//     return () => unsubscribe();
//   }, [noteId]);

//   useEffect(() => {
//     console.log("scrolling");
//     if (endOfMessagesRef.current) {
//       endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const sendMessage = useCallback(async (text, imageUrl = "") => {
//     if (!text.trim() && !imageUrl) return;

//     const messageData = {
//       text,
//       imageUrl,
//       sender: auth.currentUser.uid,
//       senderEmail: auth.currentUser.email,
//       timestamp: Date.now(),
//       readBy: { [auth.currentUser.uid]: true },
//     };

//     push(chatRef, messageData);
//     setNewMessage("");
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   const markMessagesAsRead = useCallback(() => {
//     console.log("markMessagesAsRead");
//     const currentUserUid = auth.currentUser.uid;
//     messages.forEach((msg) => {
//       if (!msg.readBy || !msg.readBy[currentUserUid]) {
//         const messageRef = child(chatRef, msg.id);
//         update(messageRef, {
//           [`readBy/${currentUserUid}`]: true,
//         });
//       }
//     });
//   }, [messages]);

//   const formatTimestamp = useMemo(() => {
//     return (timestamp) => {
//       const date = new Date(timestamp);
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     };
//   }, []);

//   const groupMessagesByDate = useMemo(() => {
//     const grouped = {};
//     console.log("grouping");

//     messages.forEach((msg) => {
//       const date = new Date(msg.timestamp);
//       const dateStr = date.toLocaleDateString();

//       if (!grouped[dateStr]) {
//         grouped[dateStr] = [];
//       }

//       grouped[dateStr].push(msg);
//     });

//     return grouped;
//   }, [messages]);

//   const isReadByOthers = useCallback(
//     (msg) => {
//       if (!msg.readBy) return false;

//       const readers = Object.keys(msg.readBy).filter(
//         (uid) => uid !== msg.sender
//       );

//       const memberIds = Object.keys(members);
//       console.log(
//         "readers.length",
//         readers.length,
//         "memberIds.length",
//         memberIds.length
//       );

//       return readers.length === memberIds.length-1;
//     },
//     [members]
//   );

//   const groupedMessages = groupMessagesByDate;
//   const isCurrentUser = (senderId) => senderId === auth.currentUser?.uid;

//   return (
//     <div
//       className={`flex flex-col h-full ${
//         fullScreen
//           ? "fixed inset-0 z-50 bg-white"
//           : "border rounded-2xl w-full overflow-hidden"
//       }`}
//     >
//       <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-2">
//           <FiMessageCircle className="text-white text-xl" />
//           <h3 className="font-bold text-lg text-white">Collaborative Chat</h3>
//         </div>
//         <button
//           onClick={() => setFullScreen(!fullScreen)}
//           className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//           aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
//         >
//           {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
//         </button>
//       </div>

//       <div
//         className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50"
//         style={{
//           height: fullScreen ? "calc(100vh - 120px)" : "auto",
//         }}
//         onClick={markMessagesAsRead}
//         onFocus={markMessagesAsRead}
//       >
//         {Object.entries(groupedMessages).map(([date, msgs]) => (
//           <div key={date} className="space-y-3">
//             <div className="flex justify-center">
//               <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600 inline-block">
//                 {date === new Date().toLocaleDateString() ? "Today" : date}
//               </div>
//             </div>

//             {msgs.map((msg, index) => {
//               const isSender = isCurrentUser(msg.sender);
//               const showAvatar =
//                 index === 0 || msgs[index - 1]?.sender !== msg.sender;
//               const hasBeenReadByOthers = isReadByOthers(msg);

//               return (
//                 <div
//                   key={msg.id}
//                   className={`flex ${
//                     isSender ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`relative max-w-[75%] ${
//                       isSender
//                         ? "bg-indigo-500 text-white rounded-t-xl rounded-bl-xl"
//                         : "bg-white border border-gray-200 rounded-t-xl rounded-br-xl shadow-sm"
//                     } px-4 py-3`}
//                   >
//                     {!isSender && showAvatar && (
//                       <div className="font-medium text-xs mb-1 text-indigo-600">
//                         {msg.senderEmail.split("@")[0]}
//                       </div>
//                     )}

//                     {msg.imageUrl && (
//                       <img
//                         src={msg.imageUrl}
//                         alt="attachment"
//                         className="rounded-lg mb-2 max-w-full"
//                       />
//                     )}

//                     <div className={isSender ? "text-white" : "text-gray-800"}>
//                       {msg.text}
//                     </div>

//                     <div
//                       className={`text-xs mt-1 flex items-center justify-end gap-1 ${
//                         isSender ? "text-indigo-100" : "text-gray-400"
//                       }`}
//                     >
//                       <span>{formatTimestamp(msg.timestamp)}</span>
//                       {isSender &&
//                         (hasBeenReadByOthers ? (
//                           <FiCheckCircle className="text-green-400" />
//                         ) : (
//                           <FiCheck />
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ))}

//         {messages.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
//             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//               <FiMessageCircle className="text-indigo-500 text-2xl" />
//             </div>
//             <h4 className="font-medium text-gray-700 mb-1">No messages yet</h4>
//             <p className="text-sm">
//               Start the conversation by sending a message.
//             </p>
//           </div>
//         )}

//         <div ref={endOfMessagesRef} />
//       </div>

//       <div className="p-3 border-t bg-white">
//         <div className="flex items-center gap-2">
//           <input
//             ref={inputRef}
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)}
//             onFocus={markMessagesAsRead}
//             className="flex-1 border border-gray-200 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={() => sendMessage(newMessage)}
//             disabled={!newMessage.trim()}
//             className={`p-2.5 rounded-full shadow-sm ${
//               newMessage.trim()
//                 ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             } transition-colors duration-200`}
//           >
//             <IoSend />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
