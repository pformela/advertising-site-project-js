import React, { useState } from "react";
import { DUMMY_CATEGORIES } from "../../components/Categories";
import { useDispatch } from "react-redux";
import { adActions } from "../ads/adSlice";

const SORT_CRITERIA = {
  Najtańsze: { sort: "price", asc: true },
  Najdroższe: { sort: "price", asc: false },
  Najnowsze: { sort: "originalCreatedAt", asc: false },
  Najstarsze: { sort: "originalCreatedAt", asc: true },
};

const UserAdFilterPanel = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const dispatch = useDispatch();

  const handleFilter = () => {
    dispatch(
      adActions.filterUserAds({
        title,
        category,
      })
    );
  };

  const handleSort = () => {
    if (sort === "") dispatch(adActions.resetFilterUserAds());
    else dispatch(adActions.sortUserAds(SORT_CRITERIA[sort]));
  };

  const handleReset = () => {
    setTitle("");
    setCategory("");
    setSort({
      sort: "",
      asc: false,
    });
    dispatch(adActions.resetFilterUserAds());
  };

  return (
    <div className="flex flex-row bg-white p-4 justify-between w-full">
      <div className="flex flex-row gap-2">
        <input
          type="text"
          placeholder="Wprowadź tytuł ogłoszenia"
          className="border border-black p-2 active:outline-none focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <select
          className="border border-black p-2 bg-white active:outline-none focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Wszystkie kategorie</option>
          {DUMMY_CATEGORIES.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          className="border border-black px-4 py-2 bg-green text-white font-bold"
          onClick={handleFilter}
        >
          Filtruj
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <select
          className="border border-black p-2 bg-white active:outline-none focus:outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sortuj</option>
          {Object.keys(SORT_CRITERIA).map((sort) => (
            <option key={sort} value={sort}>
              {sort}
            </option>
          ))}
        </select>
        <button
          className="border border-black px-4 py-2 bg-green text-white font-bold"
          onClick={handleSort}
        >
          Sortuj
        </button>
      </div>
      <button
        className="border border-black px-4 py-2 bg-green text-white font-bold"
        onClick={handleReset}
      >
        Resetuj
      </button>
    </div>
  );
};

export default UserAdFilterPanel;
