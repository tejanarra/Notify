import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { FiEdit3, FiSave, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { debounce } from "lodash";

const sanitizeElements = (elements) => {
  try {
    return JSON.parse(JSON.stringify(elements)).filter(
      (element) =>
        element &&
        typeof element === "object" &&
        element.id &&
        (element.type !== "freedraw" || Array.isArray(element.points))
    );
  } catch (error) {
    console.error("Sanitization error:", error);
    return [];
  }
};

export default function NoteEditor({ noteId }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [remoteData, setRemoteData] = useState({ elements: [], appState: {} });
  const [fullScreen, setFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const noteRef = useMemo(
    () => ref(database, `notes/${noteId}/content/drawing`),
    [noteId]
  );
  const saveQueue = useRef([]);
  const isMounted = useRef(true);
  const isRemoteUpdate = useRef(false);
  const excalidrawRef = useRef(null);

  const debouncedSave = useRef(
    debounce(async () => {
      if (saveQueue.current.length === 0 || !excalidrawAPI) return;

      const elementsToSave = saveQueue.current.flat();
      saveQueue.current = [];

      try {
        setIsSaving(true);
        const currentAppState = excalidrawAPI.getAppState();
        const dataToSave = {
          elements: sanitizeElements(elementsToSave),
          appState: {
            viewBackgroundColor: currentAppState.viewBackgroundColor,
            zoom: currentAppState.zoom,
            scrollX: currentAppState.scrollX,
            scrollY: currentAppState.scrollY,
            gridSize: currentAppState.gridSize,
          },
          lastUpdated: Date.now(),
        };

        await set(noteRef, dataToSave);
        setLastUpdate(Date.now());
      } catch (error) {
        console.error("Save error:", error);
      } finally {
        if (isMounted.current) setIsSaving(false);
      }
    }, 1000)
  );

  useEffect(() => {
    const unsubscribe = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || data.lastUpdated <= lastUpdate) return;

      setRemoteData({
        elements: sanitizeElements(data.elements),
        appState: {
          viewBackgroundColor: data.appState?.viewBackgroundColor || "#111111",
          zoom: data.appState?.zoom || { value: 1 },
          scrollX: data.appState?.scrollX || 0,
          scrollY: data.appState?.scrollY || 0,
          gridSize: data.appState?.gridSize || null,
        },
      });
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
      debouncedSave.current.cancel();
    };
  }, [noteId, lastUpdate, noteRef]);

  const handleChange = useCallback((elements) => {
    if (!isMounted.current || isRemoteUpdate.current) return;

    const validElements = sanitizeElements(elements);
    saveQueue.current.push(validElements);
    debouncedSave.current();
  }, []);

  const handleManualSave = useCallback(() => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    saveQueue.current = [elements];
    debouncedSave.current.flush();
  }, [excalidrawAPI]);

  useEffect(() => {
    if (!excalidrawAPI || !remoteData.elements.length) return;

    isRemoteUpdate.current = true;
    excalidrawAPI.updateScene({
      elements: remoteData.elements,
      appState: remoteData.appState,
      scrollToContent: true,
    });
    isRemoteUpdate.current = false;
  }, [excalidrawAPI, remoteData]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && fullScreen) {
        setFullScreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [fullScreen]);
  
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreen]);

  return (
    <div
      className={fullScreen ? "fixed inset-0 z-50 bg-black" : "h-full"}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: fullScreen ? '0' : '0.75rem',
        border: !fullScreen ? '1px solid rgba(236, 72, 153, 0.3)' : 'none',
        boxShadow: !fullScreen ? '0 10px 15px -3px rgba(236, 72, 153, 0.1)' : 'none',
        overflow: 'hidden',
      }}
    >
      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-3 flex justify-between items-center shadow-md">
        <div className="flex items-center text-white">
          <FiEdit3 className="mr-2" size={20} />
          <h2 className="font-bold text-lg">Collaborative Canvas</h2>
          {isSaving && (
            <span className="ml-2 text-sm text-yellow-300">Saving...</span>
          )}
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
            onClick={handleManualSave}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            aria-label="Save"
          >
            <FiSave size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1" style={{ height: fullScreen ? 'calc(100vh - 64px)' : '100%' }}>
        <Excalidraw
          ref={excalidrawRef}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            elements: remoteData.elements,
            appState: remoteData.appState,
            scrollToContent: true,
          }}
          onChange={handleChange}
          theme="dark"
          gridModeEnabled
          zenModeEnabled
          viewBackgroundColor="#111111"
        />
      </div>
    </div>
  );
}