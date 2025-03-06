import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden transition-all duration-300">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FaPlus className="w-4 h-4" />
          </div>
          <span className="text-gray-500 font-medium">Create a new note...</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all duration-200"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
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
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <FaTimes className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 font-medium text-sm flex items-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-70"
              disabled={!title.trim()}
            >
              <FaPlus className="w-3.5 h-3.5" />
              Create Note
            </button>
          </div>
        </form>
      )}
    </div>
  );
};