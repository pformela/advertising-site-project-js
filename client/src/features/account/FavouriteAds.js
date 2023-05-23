import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { useGetUserFavouriteAdsMutation } from "../ads/adApiSlice";
import { useSelector } from "react-redux";
import {
  selectFavouriteUserAds,
  selectIsFavoriteUserAdsEmpty,
} from "../ads/adSlice";
import { selectUser } from "./userSlice";
import LoadingModal from "../../components/UI/LoadingModal";
import SearchResultsAd from "../ads/SearchResultsAd";

const FavouriteAds = () => {
  const user = useSelector(selectUser);
  const favouriteAds = useSelector(selectFavouriteUserAds);
  const isFavouriteAdsEmpty = useSelector(selectIsFavoriteUserAdsEmpty);
  const [getUserFavouriteAds, { isLoading }] = useGetUserFavouriteAdsMutation();

  const getFavouriteAds = async () => {
    try {
      await getUserFavouriteAds({ userId: user.userId });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isFavouriteAdsEmpty && favouriteAds.length === 0) {
      getFavouriteAds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {isLoading && <LoadingModal />}
      {favouriteAds.length === 0 ? (
        <div className="bg-lightWheat w-full flex flex-col p-4">
          <h1 className="text-2xl font-bold py-8">Obserwowane ogłoszenia</h1>
          <div className="bg-white text-center">
            <h1 className="text-2xl font-bold py-8">
              Brak obserwowanych ogłoszeń
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-lightWheat w-full flex flex-col p-4">
          <h1 className="text-2xl font-bold py-8">Obserwowane ogłoszenia</h1>
          <ul className="flex flex-col gap-2">
            {favouriteAds.length !== 0 &&
              favouriteAds.map((ad) => (
                <li key={ad.id}>
                  <SearchResultsAd ad={ad} />
                </li>
              ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default FavouriteAds;
