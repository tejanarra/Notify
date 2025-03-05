// components/CreateNoteForm.jsx
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export const CreateNoteForm = ({ onCreate, error, setError }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Note title cannot be empty");
      return;
    }
    onCreate(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          placeholder="New note title"
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
          disabled={!title.trim()}
        >
          <FaPlus className="text-lg" />
          Create Note
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-100 rounded">
          {error}
        </div>
      )}
    </form>
  );
};