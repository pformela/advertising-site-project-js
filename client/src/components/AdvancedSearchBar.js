import React from "react";
import { Formik } from "formik";
import { useGetAdsMutation } from "../features/ads/adApiSlice";
import { useNavigate } from "react-router-dom";
import LoadingModal from "./UI/LoadingModal";
import { useDispatch, useSelector } from "react-redux";
import { adActions } from "../features/ads/adSlice";
import { selectCurrentSearchValues } from "../features/ads/adSlice";
import { DUMMY_CATEGORIES } from "./Categories";

const AdvancedSearchBar = ({ onChangeSearchBar, disableBasic }) => {
  const currentSearchValues = useSelector(selectCurrentSearchValues);
  const [getAds, { isLoading }] = useGetAdsMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = async (values) => {
    try {
      dispatch(adActions.setCurrentSearchValues(values));
      const { data } = await getAds({ ...values, sort: "", asc: false });
      dispatch(adActions.setFoundsAds(data));
      navigate("/search-results");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-wheat w-full shadow">
      {isLoading && <LoadingModal />}
      <Formik
        initialValues={{
          searchValue: currentSearchValues.searchValue,
          category: currentSearchValues.category,
          priceFrom: currentSearchValues.priceFrom,
          priceTo: currentSearchValues.priceTo,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await handleSearch(values);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col p-6 gap-6"
          >
            <div className="w-full flex flex-row justify-center items-center gap-4">
              <div className="w-4/5 self-stretch h-min flex flex-row px-2 bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="silver"
                  className="h-6 w-6 self-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  className="w-full pl-1 px-2 py-2 rounded-lg bg-darkNavy text-silver active:outline-none focus:outline-none"
                  type="text"
                  name="searchValue"
                  id="searchValue"
                  placeholder="Wpisz nazwę przedmiotu, którego szukasz..."
                  value={values.searchValue}
                  onChange={handleChange}
                />
              </div>
              <button
                className="bg-white text-xl px-4 py-2 font-bold h-full border-2 border-white hover:bg-white hover:border-black"
                type="submit"
                disabled={isSubmitting}
              >
                Wyszukaj
              </button>
            </div>
            <div className="flex flex-col self-center gap-4">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-1">
                  <h3>Kategoria</h3>
                  <div>
                    <select
                      name="category"
                      id="category"
                      value={values.category}
                      onChange={handleChange}
                      className="bg-white text-gray p-4 border-2 border-white"
                    >
                      <option value="">Wszystkie kategorie</option>
                      {DUMMY_CATEGORIES.map((category, index) => (
                        <option key={index} value={category.cat}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h3>Cena</h3>
                  <div className="flex flex-row gap-2">
                    <input
                      className="bg-white text-gray p-4 w-24"
                      type="number"
                      name="priceFrom"
                      id="priceFrom"
                      placeholder="Od"
                      min="0"
                      value={values.priceFrom}
                      onChange={handleChange}
                    />
                    <input
                      className="bg-white text-gray p-4 w-24"
                      type="number"
                      name="priceTo"
                      id="priceTo"
                      min="0"
                      placeholder="Do"
                      value={values.priceTo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              {!disableBasic && (
                <button
                  className="flex flex-row bg-white p-3 gap-2 border-2 border-white hover:border-black w-max self-center"
                  onClick={() => {
                    onChangeSearchBar();
                    dispatch(adActions.setCurrentSearchValues(values));
                  }}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
                    />
                  </svg>

                  <span className="text-xl text-center self-center">
                    Wyszukiwanie podstawowe
                  </span>
                </button>
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AdvancedSearchBar;
