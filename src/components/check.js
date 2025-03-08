import React, { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ref, onValue, runTransaction } from "firebase/database";
import { database } from "../firebase";
const sanitizeElements = (elements) => {
  if (!elements) return [];
  return elements
    .map((element) => ({
      type: "rectangle",
      strokeColor: "#000000",
      backgroundColor: "transparent",
      fillStyle: "hachure",
      strokeWidth: 1,
      roughness: 1,
      ...element,
      points: element.points ? [...element.points] : [],
      pressures: element.pressures ? [...element.pressures] : [],
      customData: element.customData || null,
      id: element.id,
    }))
    .filter((element) => !!element && element.id);
};
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Drawing editor failed to load. Please refresh the page.
      </div>
    ) : this.props.children;
  }
}

export default function NoteEditor({ noteId }) {
  const [elements, setElements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const noteRef = ref(database, `notes/${noteId}/content/drawing`);
    // Listen for real-time updates from Firebase
    const unsubscribe = onValue(noteRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const sanitizedData = sanitizeElements(data);
          // Only update state if the new data differs from current state
          if (JSON.stringify(sanitizedData) !== JSON.stringify(elements)) {
            setElements(sanitizedData);
          }
        } else {
          setElements([]);
        }
      } catch (err) {
        setError("Failed to load drawing");
        console.error("Load error:", err);
      }
    });
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [noteId, elements]); // Ensuring we capture updates from Firebase
  const handleDrawingChange = (elements) => {
    if (!isSaving) {
      setIsSaving(true);
      setError("");
      try {
        const cleanedElements = sanitizeElements(elements);
        runTransaction(
          ref(database, `notes/${noteId}/content/drawing`),
          (currentData) => {
            if (currentData) {
              return JSON.parse(JSON.stringify(cleanedElements)); // Save updated elements to Firebase
            } else {
              return cleanedElements; // If no data exists, initialize it
            }
          }
        )
          .catch((err) => {
            setError(`Save failed: ${err.message}`);
            console.error("Transaction error:", err);
          })
          .finally(() => setIsSaving(false));
      } catch (err) {
        setError("Error processing drawing data");
        console.error("Processing error:", err);
        setIsSaving(false);
      }
    }
  };
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm h-[calc(100vh-150px)]">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <div className="h-full border rounded relative">
        <ErrorBoundary>
          <Excalidraw
            initialData={{ elements }}
            onChange={handleDrawingChange}
          />
        </ErrorBoundary>
        {isSaving && (
          <div className="absolute bottom-2 right-2 text-sm bg-white px-2 py-1 rounded shadow">
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}
