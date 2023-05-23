import React from "react";
import { Link } from "react-router-dom";

const SessionExpired = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b from-lightCyan to-wheat">
      <h1 className="text-16xl font-bold text-white text-center">WPO</h1>
      <div className="text-3xl text-center text-black text-bold">
        Session expired
      </div>
      <div className="text-xl text-center text-gray text-bold">
        <Link to="/login">Click here to login again</Link>
      </div>
    </div>
  );
};

export default SessionExpired;
