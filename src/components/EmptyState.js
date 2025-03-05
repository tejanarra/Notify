// components/EmptyState.jsx
import { FaRegFileAlt } from "react-icons/fa";

export const EmptyState = () => (
  <div className="text-center mt-16">
    <div className="inline-block p-8 bg-white rounded-lg shadow-lg">
      <FaRegFileAlt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 className="mt-4 text-xl font-medium text-gray-900">
        No notes found
      </h3>
      <p className="mt-1 text-gray-500">Create your first note to get started</p>
    </div>
  </div>
);