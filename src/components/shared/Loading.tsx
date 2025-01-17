import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative text-[#B1B762] text-xl animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default Loading;
