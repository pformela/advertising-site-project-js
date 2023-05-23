import React, { useEffect } from "react";
import Categories from "./Categories";
import HighlightedAds from "./HighlightedAds";
import SearchBar from "./SearchBar";
import Layout from "./Layout";
import { adActions } from "../features/ads/adSlice";
import { useDispatch } from "react-redux";
import { useGetAdsMutation } from "../features/ads/adApiSlice";
import LoadingModal from "./UI/LoadingModal";

const HomePage = () => {
  const dispatch = useDispatch();

  const [getAds, { isLoading }] = useGetAdsMutation();

  const getHiglightedAds = async () => {
    try {
      const { data } = await getAds({
        searchValue: "",
        category: "",
        priceFrom: "",
        priceTo: "",
        limit: 8,
      });
      dispatch(adActions.setHighlightedAds(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHiglightedAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {isLoading && <LoadingModal />}
      <SearchBar />
      <Categories />
      <HighlightedAds />
    </Layout>
  );
};

export default HomePage;
