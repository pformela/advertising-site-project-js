import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  useGetSingleAdMutation,
  useGetAdsMutation,
  useAddToFavoritesMutation,
  useRemoveFromFavouritesMutation,
} from "./adApiSlice";
import { selectSingleAd } from "./adSlice";
import { useSelector, useDispatch } from "react-redux";
import { adActions, selectFavouriteUserAdsIds } from "./adSlice";
import { selectUser } from "../account/userSlice";
import LoadingModal from "../../components/UI/LoadingModal";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/UI/AlertComponent";
import { chatActions } from "../chat/chatSlice";

const CATEGORIES = {
  Elektronika: "Elektronika",
  Motoryzacja: "Motoryzacja",
  "Dom i ogród": "DomIOgród",
  Moda: "Moda",
  "Sport i turystyka": "SportITurystyka",
  "Zdrowie i uroda": "ZdrowieIUroda",
  "Dla dzieci": "DlaDzieci",
  "Muzyka i rozrywka": "MuzykaIRozrywka",
  "Książki i czasopisma": "KsiazkiICzasopisma",
  Zwierzęta: "Zwierzeta",
  Praca: "Praca",
  Usługi: "Uslugi",
  Inne: "Inne",
};

const AdInfo = () => {
  const ad = useSelector(selectSingleAd);
  const user = useSelector(selectUser);
  const isAdInFavourites = useSelector(selectFavouriteUserAdsIds).includes(
    ad?.id || ""
  );
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  const { id } = useParams();

  const [alertMessage, setAlertMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getAd, { isLoading }] = useGetSingleAdMutation();
  const [getAds, { isLoadingAds }] = useGetAdsMutation();
  const [addToFavorites, { isLoading: isLoadingAddToFavorites }] =
    useAddToFavoritesMutation();
  const [removeFromFavourites, { isLoading: isLoadingRemove }] =
    useRemoveFromFavouritesMutation();

  const handlePositiveResult = () => {
    setIsAlertVisible(true);

    setTimeout(() => {
      setIsAlertVisible(false);
    }, 5000);
  };

  const handleCategoryClick = async (category) => {
    dispatch(adActions.setCurrentSearchValues({ category }));
    try {
      const { data } = await getAds({ category, sort: "", asc: false });
      dispatch(adActions.setFoundsAds(data));
      navigate("/search-results");
    } catch (error) {
      console.log(error);
    }
  };

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
      setAlertMessage(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleAd = async () => {
    try {
      const { data } = await getAd({ id });
      dispatch(adActions.setSingleAd(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ad?.id !== id) {
      getSingleAd();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ad?.id)
    return (
      <Layout>
        {(isLoading ||
          isLoadingAds ||
          isLoadingRemove ||
          isLoadingAddToFavorites) && <LoadingModal />}
        <div className="w-full h-64 flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl">Nie znaleziono ogłoszenia</h1>
          <button
            className="px-4 py-2 bg-green text-white text-xl p-2 rounded-md"
            onClick={() => navigate(-1)}
          >
            Wróć do wyników wyszukiwania
          </button>
        </div>
      </Layout>
    );
  else
    return (
      <Layout>
        {(isLoading ||
          isLoadingAds ||
          isLoadingRemove ||
          isLoadingAddToFavorites) && <LoadingModal />}
        {isAlertVisible && (
          <AlertComponent
            message={alertMessage}
            onClose={() => setIsAlertVisible(false)}
          />
        )}
        {ad.id === id && (
          <div className="w-full bg-lightWheat p-4 flex flex-col gap-4">
            <div className="flex flex-row w-full justify-between gap-2 bg-white p-4 shadow-md">
              <button
                className="h-128 min-w-16 max-w-16 w-16 bg-green flex flex-row items-center"
                onClick={() => {
                  if (currentPictureIndex > 0) {
                    setCurrentPictureIndex(currentPictureIndex - 1);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <div className="relative flex flex-row h-128 max-w-fit bg-white self-center">
                <img
                  src={ad.photos[currentPictureIndex].url}
                  alt={ad.title}
                  className="object-contain h-full max-h-none self-center aspect-auto m-auto"
                />
                <ul className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row w-max gap-2 bg-blackRgba p-2 rounded-full">
                  {ad.photos.map((photo, index) => (
                    <li
                      key={index}
                      className={`${
                        index === currentPictureIndex ? "bg-green" : "bg-white"
                      } p-3 rounded-full shadow-xl`}
                      onClick={() => setCurrentPictureIndex(index)}
                    ></li>
                  ))}
                </ul>
              </div>
              <button
                className="h-128 min-w-16 max-w-16 w-16 bg-green flex flex-row items-center"
                onClick={() => {
                  if (currentPictureIndex < ad.photos.length - 1) {
                    setCurrentPictureIndex(currentPictureIndex + 1);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col bg-white p-4 shadow-md w-full gap-4">
              {!ad.active && (
                <div className="w-full bg-green shadow-md text-white">
                  <h1 className="text-4xl font-bold text-center my-4">
                    Ogłoszenie archiwalne
                  </h1>
                </div>
              )}
              <div>
                <button
                  className="px-4 py-2 rounded-md bg-green text-white font-bold"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Powrót do wyszukiwań
                </button>
              </div>
              <div>
                <h3>
                  Kategoria:{" "}
                  <button
                    className="font-bold hover:underline hover:text-darkGreen"
                    onClick={() => handleCategoryClick(CATEGORIES[ad.category])}
                  >
                    {ad.category}
                  </button>
                </h3>
              </div>
              <div className="flex flex-row w-full justify-between">
                <span className="text-gray-500 text-sm">
                  Dodano {ad.createdAt}
                </span>
                {ad.active && (
                  <button className="" onClick={handleAddToFavorites}>
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
                )}
              </div>
              <div className="flex flex-col w-full">
                <h1 className="text-3xl ">{ad.title}</h1>
                <h2 className="text-4xl font-bold">{ad.price} zł</h2>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Opis</h1>
                <section className="">{ad.description}</section>
              </div>
              <div>
                <h1 className="text-xl">
                  Lokalizacja: <span className="font-bold">{ad.city}</span>
                </h1>
              </div>
              {ad.active && (
                <div className="flex flex-col mt-4 pt-4 border-t border-gray-500">
                  <h3 className="text-xl text-center">
                    Kontakt do sprzedającego
                  </h3>
                  <div className="flex flex-row justify-center gap-2 mt-4">
                    {!showPhone ? (
                      <button
                        className="bg-green text-white px-4 py-2 rounded-md"
                        onClick={() => {
                          setShowPhone(true);
                        }}
                      >
                        Pokaż numer telefonu
                      </button>
                    ) : (
                      <span className="px-4 py-2 text-center font-bold text-xl">
                        {ad.phone}
                      </span>
                    )}
                    {ad.userId !== user.userId ? (
                      <button
                        className="bg-green text-white px-4 rounded-md"
                        onClick={() => {
                          dispatch(
                            chatActions.setActiveChat(`${ad.id}_${ad.userId}`)
                          );
                          navigate(`/user/chat/${ad.id}/${ad.userId}`);
                        }}
                      >
                        Wiadomość do sprzedającego
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Layout>
    );
};

export default AdInfo;
