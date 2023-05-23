import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingModal from "../../components/UI/LoadingModal";
import { useDispatch, useSelector } from "react-redux";
import { useActivateAdMutation, useDeleteAdMutation } from "../ads/adApiSlice";
import { adActions } from "../ads/adSlice";
import AlertComponent from "../../components/UI/AlertComponent";
import { selectUser } from "./userSlice";

const UserFinishedAds = ({ finishedAds }) => {
  const user = useSelector(selectUser);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activateAd, { isLoading }] = useActivateAdMutation();
  const [deleteAd] = useDeleteAdMutation();

  const handlePositiveResult = () => {
    setIsAlertVisible(true);

    setTimeout(() => {
      setIsAlertVisible(false);
    }, 5000);
  };

  const dispatch = useDispatch();

  const handleActivateAd = async (adId) => {
    try {
      await activateAd({ adId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      const { data } = await deleteAd({ userId: user.userId, adId });
      dispatch(adActions.removeUserAd(adId));
      handlePositiveResult();
      setAlertMessage(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      {isAlertVisible && (
        <AlertComponent
          message={alertMessage}
          onClose={() => setIsAlertVisible(false)}
        />
      )}
      {finishedAds.length === 0 ? (
        <div className="text-2xl text-center p-4">
          Brak zakończonych ogłoszeń
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {finishedAds.map((ad, index) => (
            <li key={index} className="flex flex-col bg-white p-2">
              <div className="bg-white p-2 h-40 flex flex-row gap-2">
                <div className="flex flex-row h-36 w-60 bg-white self-center">
                  <img
                    src={ad.photos[0].url}
                    alt={ad.title}
                    className="object-cover w-full h-full max-w-none max-h-none self-center aspect-auto  m-auto"
                  />
                </div>
                <div className="flex flex-col justify-between w-full">
                  <div className="flex flex-row justify-between w-full">
                    <Link to={`/search-results/${ad.id}`} className="w-max">
                      <h1 className="my-2 text-xl h-12 line-clamp-2 hover:underline">
                        {ad.title}
                      </h1>
                    </Link>
                    <h2 className="text-xl text-center font-bold">
                      {ad.price} zł
                    </h2>
                  </div>
                  <div className="flex flex-col justify-end">
                    <span className="text-gray-700">{ad.category}</span>
                    <div className="flex flex-row justify-between">
                      <h2 className="text-sm text-gray-500">
                        {ad.city} - {ad.createdAt}
                      </h2>
                      <span className="text-sm text-gray-500">
                        Zakończono: {ad.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-300 p-4 pr-2 pb-2 w-full">
                <div className="flex flex-row gap-2 w-max float-right">
                  <button
                    className="px-4 py-2 bg-red-500 text-white font-bold border border-black"
                    onClick={() => handleDeleteAd(ad.id)}
                  >
                    Usuń
                  </button>
                  <button
                    className="px-4 py-2 bg-white text-black font-bold border border-black"
                    onClick={() => handleActivateAd(ad.id)}
                  >
                    Aktywuj
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default UserFinishedAds;
