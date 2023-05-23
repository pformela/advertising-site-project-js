import React from "react";

const UserAdPanel = ({ finished, onChangeTab, activeNum, finishedNum }) => {
  return (
    <div className="flex flex-row">
      <button
        className={`px-6 py-2 ${
          !finished
            ? "border-b-2 border-black font-bold"
            : "border-b-2 border-lightWheat"
        }`}
        onClick={() => onChangeTab(false)}
      >
        Aktywne [{activeNum}]
      </button>
      <button
        className={`px-6 py-2 ${
          finished
            ? "border-b-2 border-black font-bold"
            : "border-b-2 border-lightWheat"
        }`}
        onClick={() => onChangeTab(true)}
      >
        Zakończone [{finishedNum}]
      </button>
    </div>
  );
};

export default UserAdPanel;
