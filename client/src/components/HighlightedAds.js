import React from "react";
import { selectHighlightedAds } from "../features/ads/adSlice";
import { useSelector } from "react-redux";
import ShortAdInfo from "../features/ads/ShortAdInfo";

const HighlightedAds = () => {
  const highlightedAds = useSelector(selectHighlightedAds);

  return (
    <div className="w-full p-4 border-2 border-darkGreen bg-lightWheat">
      <h1 className="text-center text-4xl">Wyróżnione ogłoszenia</h1>
      <ul className="flex flex-row flex-wrap gap-2 mt-6 justify-center">
        {highlightedAds.map((ad, index) => (
          <li key={index}>
            <ShortAdInfo ad={ad} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighlightedAds;
