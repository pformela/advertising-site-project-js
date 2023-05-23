import React, { useState } from "react";
import Settings from "./Settings";
import UserAccountTab from "./UserAccountTab";
import UserAds from "./UserAds";
import UserMessages from "./UserMessages";
import UserPanelButtons from "./UserPanelButtons";

const UserPanel = () => {
  const [activeTabName, setActiveTabName] = useState("Twoje ogłoszenia");

  return (
    <div className="flex flex-col h-48 justify-between gap-2">
      <div className="p-4 h-16 text-4xl">{activeTabName}</div>
      <UserPanelButtons
        activeTabName={activeTabName}
        setActiveTabName={setActiveTabName}
      />
      {activeTabName === "Twoje ogłoszenia" && <UserAds />}
      {activeTabName === "Wiadomości" && <UserMessages />}
      {activeTabName === "Ustawienia" && <Settings />}
    </div>
  );
};

export default UserPanel;
