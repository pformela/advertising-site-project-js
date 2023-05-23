import React from "react";

const AlertComponent = ({ message, onClose }) => {
  return (
    <div
      className="fixed font-bold p-4 bg-white border border-gray-500 shadow-md bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all ease-in duration-700"
      onClick={onClose}
    >
      {message}
    </div>
  );
};

export default AlertComponent;
