import React from "react";
import { FaRegFileAlt } from "react-icons/fa";

export const EmptyState = () => (
  <div className="flex items-center justify-center mt-16">
    <div className="text-center p-10 bg-gray-900 rounded-2xl shadow-lg border border-pink-500/20 transform transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 hover:border-pink-500/40">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-lg shadow-pink-500/30 flex items-center justify-center">
          <FaRegFileAlt className="h-10 w-10 text-white" />
        </div>
      </div>
      <h3 className="mt-6 text-2xl font-bold text-white">No notes found</h3>
      <p className="mt-2 text-gray-400 mb-6">
        Create your first note to get started with your collaborative workspace
      </p>
    </div>
  </div>
);
