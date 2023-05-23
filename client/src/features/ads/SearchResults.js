import React, { useEffect } from "react";
import AdvancedSearchBar from "../../components/AdvancedSearchBar";
import Layout from "../../components/Layout";
import { selectFoundAds } from "./adSlice";
import { useSelector } from "react-redux";
import SearchResultsAd from "./SearchResultsAd";
import SortResults from "./SortResults";
import NumberOfResults from "./NumberOfResults";

const SearchResults = () => {
  const foundAds = useSelector(selectFoundAds);

  useEffect(() => {
    window.scrollTo(0, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <AdvancedSearchBar disableBasic={true} />
      <SortResults />
      <NumberOfResults ads={foundAds} />
      {foundAds.length === 0 ? null : (
        <div className="bg-lightWheat w-full p-4">
          <ul className="w-full flex flex-col gap-4">
            {foundAds.map((ad, index) => (
              <li key={index}>
                <SearchResultsAd ad={ad} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default SearchResults;
