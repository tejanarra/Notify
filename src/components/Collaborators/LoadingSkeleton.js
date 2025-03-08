import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="border border-pink-500/20 rounded-2xl shadow-lg shadow-pink-500/10 w-full overflow-hidden bg-gray-900">
      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-4 flex justify-between items-center animate-pulse opacity-70">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/30"></div>
          <div className="h-6 w-32 bg-white/30 rounded-md"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/30"></div>
      </div>
      
      <div className="p-4 space-y-4 bg-gray-900">
        <div className="bg-gray-800 h-12 rounded-xl animate-pulse"></div>
        <div className="space-y-3">
          <div className="bg-gray-800 h-20 rounded-xl animate-pulse"></div>
          <div className="bg-gray-800 h-20 rounded-xl animate-pulse"></div>
          <div className="bg-gray-800 h-20 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}