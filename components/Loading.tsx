import React from "react";

const Loading = () => {
  return (
    <div className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500">
      <div
        className="spinner w-12 h-12 rounded-full animate-spin
      border-4 border-solid border-slate-500 border-t-transparent"
      />
    </div>
  );
};

export default Loading;
