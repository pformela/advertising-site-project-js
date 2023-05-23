import React, { useState } from "react";
import {
  selectFilteredUserAds,
  selectUserAds,
  selectFinishedUserAds,
} from "../ads/adSlice";
import { useSelector } from "react-redux";
import UserActiveAds from "./UserActiveAds";
import UserFinishedAds from "./UserFinishedAds";
import UserAdPanel from "./UserAdPanel";

const UserAds = () => {
  const [showFinishedAds, setShowFinishedAds] = useState(false);

  const userAds = useSelector(selectFilteredUserAds);
  const finishedUserAds = useSelector(selectFinishedUserAds);
  const allUserAds = useSelector(selectUserAds);

  const activeNum = userAds.length;
  const finishedNum = finishedUserAds.length;

  return (
    <div className="flex flex-col bg-lightWheat w-full p-4 gap-4">
      <UserAdPanel
        finished={showFinishedAds}
        onChangeTab={setShowFinishedAds}
        activeNum={activeNum}
        finishedNum={finishedNum}
      />
      {showFinishedAds ? (
        <UserFinishedAds finishedAds={finishedUserAds} />
      ) : (
        <UserActiveAds allUserAds={allUserAds} userAds={userAds} />
      )}
    </div>
  );
};

export default UserAds;
