import React from "react";
import { Formik } from "formik";
import { useGetAdsMutation } from "../features/ads/adApiSlice";
import { useNavigate } from "react-router-dom";
import LoadingModal from "./UI/LoadingModal";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentSearchValues } from "../features/ads/adSlice";
import { adActions } from "../features/ads/adSlice";

const BasicSearchBar = ({ onChangeSearchBar }) => {
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
              >
                Wyszukaj
              </button>
            </div>
            <div className="self-center">
              <button
                className="flex flex-row bg-white p-3 gap-2 border-2 border-white hover:border-black"
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
                  Wyszukiwanie zaawansowane
                </span>
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default BasicSearchBar;
