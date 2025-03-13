import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Excalidraw,
  restoreElements,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { debounce } from "lodash";
import { FiEdit3, FiSave, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { LiveCollaborationTrigger } from "@excalidraw/excalidraw";

export default function NoteEditor({ noteId }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [libraryItems, setLibraryItems] = useState(null);
  const sceneRef = useRef(ref(database, `notes/${noteId}/scene`));

  const saveScene = useCallback(async () => {
    if (!excalidrawAPI) return;
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = Object.values(excalidrawAPI.getFiles());

      console.log(excalidrawAPI);

      const serializedData = serializeAsJSON(elements, appState);

      const saveData = JSON.parse(serializedData);

      saveData.appState.theme = appState.theme;
      saveData.appState.scrollX = appState.scrollX;
      saveData.appState.scrollY = appState.scrollY;
      saveData.appState.zoom = appState.zoom;
      saveData.files = files;
      saveData.libraryItems = libraryItems;

      await set(sceneRef.current, saveData);
    } catch (error) {
      console.error("Save failed:", error);
    }
  }, [excalidrawAPI, libraryItems]);

  useEffect(() => {
    const debouncedSave = debounce(saveScene, 10000);
    return () => debouncedSave.cancel();
  }, [saveScene]);

  useEffect(() => {
    const unsubscribe = onValue(sceneRef.current, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data || !excalidrawAPI) return;
        excalidrawAPI.updateScene({
          elements: restoreElements(data.elements || []),
          appState: data.appState,
          files: data.files,
        });

        if (data.files) {
          excalidrawAPI.addFiles(data.files);
        }
        if (data.libraryItems) {
          excalidrawAPI.updateLibrary({
            libraryItems: data.libraryItems,
            merge: true,
          });
        }
      } catch (error) {
        console.error("Load error:", error);
      }
    });
    setLoading(false);

    return () => {
      unsubscribe();
    };
  }, [excalidrawAPI]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div
      className={fullScreen ? "fixed inset-0 z-50 bg-black" : "h-full"}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: fullScreen ? "0" : "0.75rem",
        border: !fullScreen ? "1px solid rgba(236, 72, 153, 0.3)" : "none",
        boxShadow: !fullScreen
          ? "0 10px 15px -3px rgba(236, 72, 153, 0.1)"
          : "none",
        overflow: "hidden",
      }}
    >
      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-3 flex justify-between items-center shadow-md">
        <div className="flex items-center text-white">
          <FiEdit3 className="mr-2" size={20} />
          <h2 className="font-bold text-lg">Collaborative Canvas</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFullScreen(!fullScreen)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullScreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
          <button
            onClick={saveScene}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            aria-label="Save"
          >
            <FiSave size={20} />
          </button>
        </div>
      </div>
      <div
        className="flex-1"
        style={{ height: fullScreen ? "calc(100vh - 64px)" : "100%" }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={{
              appState: {
                viewBackgroundColor: "#fff",
                theme: "dark",
              },
            }}
            onLibraryChange={(libraryItems) => setLibraryItems(libraryItems)}
            // gridModeEnabled
            renderTopRightUI={() => (
              <LiveCollaborationTrigger
                isCollaborating={isCollaborating}
                onSelect={() => {
                  setIsCollaborating(!isCollaborating);
                }}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
