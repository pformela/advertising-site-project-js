import React from "react";

const UserPanelButtons = ({ activeTabName, setActiveTabName }) => {
  return (
    <div className="self-start">
      <button
        className={`px-6 py-2 border-b-2 ${
          activeTabName === "Twoje ogłoszenia"
            ? "text-black border-black font-bold"
            : "text-gray-500 border-white"
        }`}
        onClick={() => setActiveTabName("Twoje ogłoszenia")}
      >
        Twoje ogłoszenia
      </button>
      <button
        className={`px-6 py-2 border-b-2 ${
          activeTabName === "Wiadomości"
            ? "text-black border-black font-bold"
            : "text-gray-500 border-white"
        }`}
        onClick={() => setActiveTabName("Wiadomości")}
      >
        Wiadomości
      </button>
      <button
        className={`px-6 py-2 border-b-2 ${
          activeTabName === "Ustawienia"
            ? "text-black border-black font-bold"
            : "text-gray-500 border-none"
        }`}
        onClick={() => setActiveTabName("Ustawienia")}
      >
        Ustawienia
      </button>
    </div>
  );
};

export default UserPanelButtons;
