import React, { useState, useEffect, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase";
import { FiMaximize, FiMinimize, FiEdit3, FiAlertCircle } from "react-icons/fi";

// Add debounce function for saving
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const sanitizeElements = (elements) => {
  // Basic validation - extend this based on your needs
  if (!Array.isArray(elements)) return [];
  return elements.filter(
    (el) =>
      el &&
      typeof el === "object" &&
      "type" in el &&
      ["rectangle", "ellipse", "line", "text"].includes(el.type)
  );
};

export default function NoteEditor({ noteId }) {
  const [elements, setElements] = useState([]);
  const [error, setError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Firebase reference
  const drawingRef = ref(database, `notes/${noteId}/content/drawing`);

  // Real-time sync from Firebase
  useEffect(() => {
    setIsLoading(true);
    let isMounted = true;

    const unsubscribe = onValue(
      drawingRef,
      (snapshot) => {
        if (!isMounted) return;

        try {
          const data = sanitizeElements(snapshot.val());
          setElements(data || []);
          setError("");
        } catch (err) {
          setError("Failed to load drawing");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setError("Error connecting to database");
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [noteId]);

  // Debounced save function
  const saveToFirebase = useCallback(
    debounce(async (elementsToSave) => {
      try {
        setIsSaving(true);
        await set(drawingRef, elementsToSave);
      } catch (err) {
        setError("Failed to save changes");
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  // Handle drawing changes
  const handleDrawingChange = useCallback(
    (elements) => {
      const sanitized = sanitizeElements(elements);
      setElements(sanitized);
      saveToFirebase(sanitized);
    },
    [saveToFirebase]
  );

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-200 shadow-lg ${
        fullscreen
          ? "fixed inset-0 z-50 bg-white rounded-none border-0"
          : "h-full"
      }`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-indigo-600 to-blue-500 p-3 flex justify-between items-center shadow-md">
        <div className="flex items-center text-white">
          <FiEdit3 className="mr-2" size={20} />
          <h2 className="font-bold text-lg">Collaborative Canvas</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors duration-200"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 text-indigo-600 font-medium">
              Loading canvas...
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="h-full pt-14">
        <Excalidraw
          initialData={{ elements }}
          onChange={handleDrawingChange}
          theme="light"
          gridModeEnabled={true}
          zenModeEnabled={fullscreen}
          viewBackgroundColor="#f8fafc"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg border border-red-200 shadow-sm flex items-center">
          <FiAlertCircle className="mr-2" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Saving indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-sm flex items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full mr-2 ${
            isSaving ? "bg-yellow-500 pulse-animation" : "bg-green-500"
          }`}
        />
        <span className="font-medium">{isSaving ? "Saving..." : "Saved"}</span>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
