// NoteEditor.jsx
import React, { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { FiMaximize, FiMinimize } from "react-icons/fi";

const sanitizeElements = (elements) => {
  // Keep existing sanitization logic
};

export default function NoteEditor({ noteId }) {
  const [elements, setElements] = useState([]);
  const [error, setError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const noteRef = ref(database, `notes/${noteId}/content/drawing`);
    const unsubscribe = onValue(noteRef, (snapshot) => {
      try {
        setElements(sanitizeElements(snapshot.val()) || []);
      } catch (err) {
        setError("Failed to load drawing");
      }
    });
    return unsubscribe;
  }, [noteId]);

  const handleDrawingChange = (elements) => {
    // Keep existing change handler logic
  };

  return (
    <div className={`relative ${fullscreen ? "fixed inset-0 z-50 bg-white" : "h-full"}`}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          {fullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
        </button>
      </div>
      
      <div className="h-full">
        <Excalidraw
          initialData={{ elements }}
          onChange={handleDrawingChange}
        />
      </div>
      
      {error && (
        <div className="absolute bottom-4 left-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}