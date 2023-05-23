import React from "react";
import { useNavigate } from "react-router-dom";
import UserAdFilterPanel from "./UserAdFilterPanel";
import UserAdCard from "../ads/UserAdCard";
import { useDeactivateAdMutation } from "../ads/adApiSlice";
import LoadingModal from "../../components/UI/LoadingModal";
import { adActions } from "../ads/adSlice";
import { useDispatch } from "react-redux";

const UserActiveAds = ({ allUserAds, userAds }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deactivateAd, { isLoading }] = useDeactivateAdMutation();

  const handleDeactivateAd = async (adId) => {
    try {
      await deactivateAd({ adId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAd = (adId) => {
    dispatch(adActions.setAdToEdit(adId));
    navigate(`/user/edit-ad`);
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <UserAdFilterPanel />
      {allUserAds.length === 0 && (
        <div className="flex flex-col bg-white p-4">
          <div className="text-2xl text-center p-4">
            Nie masz jeszcze żadnych ogłoszeń
          </div>
          <div className="text-xl text-center mb-4">
            Dodaj swoje pierwsze ogłoszenie klikając przycisk poniżej
          </div>
          <button
            className="bg-green text-white p-2 rounded-md"
            onClick={() => navigate("/user/new-ad")}
          >
            Dodaj ogłoszenie
          </button>
        </div>
      )}
      {allUserAds.length > 0 && userAds.length === 0 && (
        <div className="flex flex-col bg-white p-4">
          <div className="text-2xl text-center p-4">
            Nie znaleziono żadnych ogłoszeń
          </div>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {userAds.map((ad, index) => (
          <li key={index}>
            <UserAdCard
              ad={ad}
              onDeactivate={handleDeactivateAd}
              onEdit={handleEditAd}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserActiveAds;
