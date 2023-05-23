import React from "react";

const Loading = () => {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-lightCyan to-wheat flex flex-row">
      <span className="text-8xl self-center m-auto text-center z-10 font-bold bg-white p-16 shadow-xl border border-black rounded-xl">
        Loading...
      </span>
      <h1 className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-32xl font-bold text-white text-center">
        WPO
        <br />
      </h1>
    </div>
  );
};

export default Loading;
