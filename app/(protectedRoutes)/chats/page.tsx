import React from "react";

const Chats = () => {
  return (
    <div className={`sm:w-1/2 md:w-3/5 lg:1/4  relative bg-slate-300 rounded `}>
      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-2xl md:text-3xl w-full text-center font-bold text-slate-500 hidden sm:block">
        Start messaging...
      </h2>
    </div>
  );
};

export default Chats;
