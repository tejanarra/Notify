import React from "react";

export const Loader = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 blur-md opacity-50 animate-pulse"></div>
      <div className="relative h-16 w-16 rounded-full border-4 border-transparent border-t-pink-500 border-b-fuchsia-600 animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-gray-900 rounded-full"></div>
    </div>
  </div>
);
