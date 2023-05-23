import React from "react";
import elektronika from "../images/categories/elektronika.png";
import motoryzacja from "../images/categories/motoryzacja.png";
import dom_i_ogrod from "../images/categories/dom_i_ogrod.png";
import moda from "../images/categories/moda.png";
import sport_i_turystyka from "../images/categories/sport_i_turystyka.png";
import zdrowie_i_uroda from "../images/categories/zdrowie_i_uroda.png";
import dla_dzieci from "../images/categories/dla_dzieci.png";
import muzyka_i_rozrywka from "../images/categories/muzyka_i_rozrywka.png";
import ksiazki_i_czasopisma from "../images/categories/ksiazki_i_czasopisma.png";
import zwierzeta from "../images/categories/zwierzeta.png";
import praca from "../images/categories/praca.png";
import uslugi from "../images/categories/uslugi.png";
import inne from "../images/categories/inne.png";
import { useDispatch } from "react-redux";
import { adActions } from "../features/ads/adSlice";
import { useGetAdsMutation } from "../features/ads/adApiSlice";
import LoadingModal from "./UI/LoadingModal";
import { useNavigate } from "react-router-dom";

export const DUMMY_CATEGORIES = [
  { id: 1, name: "Elektronika", cat: "Elektronika", img: elektronika },
  { id: 2, name: "Motoryzacja", cat: "Motoryzacja", img: motoryzacja },
  { id: 3, name: "Dom i ogród", cat: "DomIOgrod", img: dom_i_ogrod },
  { id: 4, name: "Moda", cat: "Moda", img: moda },
  {
    id: 5,
    name: "Sport i turystyka",
    cat: "SportITurystyka",
    img: sport_i_turystyka,
  },
  {
    id: 6,
    name: "Zdrowie i uroda",
    cat: "ZdrowieIUroda",
    img: zdrowie_i_uroda,
  },
  { id: 7, name: "Dla dzieci", cat: "DlaDzieci", img: dla_dzieci },
  {
    id: 8,
    name: "Muzyka i rozrywka",
    cat: "MuzykaIRozrywka",
    img: muzyka_i_rozrywka,
  },
  {
    id: 9,
    name: "Książki i czasopisma",
    cat: "KsiazkiICzasopisma",
    img: ksiazki_i_czasopisma,
  },
  { id: 10, name: "Zwierzęta", cat: "Zwierzeta", img: zwierzeta },
  { id: 11, name: "Praca", cat: "Praca", img: praca },
  { id: 12, name: "Usługi", cat: "Uslugi", img: uslugi },
  { id: 13, name: "Inne", cat: "Inne", img: inne },
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getAds, { isLoading }] = useGetAdsMutation();

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

  return (
    <div className="flex flex-col w-full border-2 border-darkGreen bg-white p-4 shadow">
      {isLoading && <LoadingModal />}
      <h1 className="text-center text-4xl">Kategorie</h1>
      <div className="flex flex-row flex-wrap justify-center gap-4 m-4">
        {DUMMY_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className="flex flex-col items-center justify-center border-2 border-white rounded-xl p-2 w-1/6 h-1/6 hover:border-darkGreen hover:bg-wheat hover:shadow-md"
            onClick={() => handleCategoryClick(category.cat)}
          >
            <img
              src={category.img}
              alt={category.name}
              className="w-1/3 h-1/3"
            />
            <p className="p-1 text-center text-sm font-bold">{category.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
