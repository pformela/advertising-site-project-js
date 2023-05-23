import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavouritesMutation,
} from "./adApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { adActions, selectFavouriteUserAdsIds } from "./adSlice";
import { selectUser } from "../account/userSlice";
import LoadingModal from "../../components/UI/LoadingModal";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/UI/AlertComponent";

const SearchResultsAd = ({ ad }) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const user = useSelector(selectUser);
  const isAdInFavourites = useSelector(selectFavouriteUserAdsIds).includes(
    ad.id
  );
  const [alertMessage, setAlertMessage] = useState("");

  const handlePositiveResult = () => {
    setIsAlertVisible(true);

    setTimeout(() => {
      setIsAlertVisible(false);
    }, 5000);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addToFavorites, { isLoading: isLoadingAddToFavorites }] =
    useAddToFavoritesMutation();
  const [removeFromFavourites, { isLoading }] =
    useRemoveFromFavouritesMutation();

  const handleAddToFavorites = async () => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAdInFavourites) {
      try {
        const { data } = await removeFromFavourites({
          adId: ad.id,
          userId: user.userId,
        });
        dispatch(adActions.removeUserFavuoriteAd(ad.id));
        handlePositiveResult();
        setAlertMessage(data.message);
      } catch (error) {
        console.log(error);
      }

      return;
    }

    try {
      const { data } = await addToFavorites({
        adId: ad.id,
        userId: user.userId,
      });
      dispatch(adActions.addUserFavuoriteAd(ad));
      handlePositiveResult();
      setAlertMessage(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isAlertVisible && (
        <AlertComponent
          message={alertMessage}
          onClose={() => setIsAlertVisible(false)}
        />
      )}
      {(isLoadingAddToFavorites || isLoading) && <LoadingModal />}
      <div className="bg-white p-2 h-40 shadow-md flex flex-row gap-2">
        <div className="flex flex-row h-36 w-60 bg-white self-center">
          <img
            src={ad.photos[0].url}
            alt={ad.title}
            className="object-cover w-full h-full max-w-none max-h-none self-center aspect-auto  m-auto"
          />
        </div>
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-row justify-between w-full">
            <Link to={`/search-results/${ad.id}`} className="w-4/5">
              <h1 className="my-2 text-xl w-full h-12 line-clamp-2 hover:underline">
                {ad.title}
              </h1>
            </Link>
            <h2 className="text-xl text-right font-bold w-1/5 mr-0">
              {ad.price} zł
            </h2>
          </div>
          <div className="flex flex-row justify-between">
            <h2 className="text-sm text-gray-500">
              {ad.city} - {ad.createdAt}
            </h2>
            <button onClick={handleAddToFavorites}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={`${isAdInFavourites ? "red" : "none"}`}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 m-auto ${
                  isAdInFavourites ? "text-red-500" : "text-black"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResultsAd;
