import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

export const CreateNoteForm = ({ onCreate, error, setError }) => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Note title cannot be empty");
      return;
    }
    onCreate(title.trim());
    setTitle("");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setError("");
    setIsExpanded(false);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-pink-500/20 mb-8 overflow-hidden transition-all duration-300">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-800 transition-colors"
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30">
            <FiPlus className="w-4 h-4" />
          </div>
          <span className="text-gray-300 font-medium">Create a new note...</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="noteTitle" className="block text-sm font-medium text-white mb-2">
              Note Title
            </label>
            <input
              id="noteTitle"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Enter a descriptive title for your note"
              className="w-full bg-gray-800 border border-pink-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-500 text-white transition-all duration-200"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 flex items-center gap-2 text-pink-400 text-sm p-3 bg-pink-500/10 rounded-lg border border-pink-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-pink-500/30 text-pink-400 rounded-lg hover:bg-pink-500/10 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <FiX className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-lg hover:from-pink-600 hover:to-fuchsia-700 disabled:from-gray-600 disabled:to-gray-700 font-medium text-sm flex items-center gap-2 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-200 disabled:opacity-70"
              disabled={!title.trim()}
            >
              <FiPlus className="w-3.5 h-3.5" />
              Create Note
            </button>
          </div>
        </form>
      )}
    </div>
  );
};