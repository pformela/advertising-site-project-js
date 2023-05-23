import React from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentSearchValues } from "./adSlice";
import { useGetAdsMutation } from "./adApiSlice";
import { adActions } from "./adSlice";
import LoadingModal from "../../components/UI/LoadingModal";

const SortResults = () => {
  const dispatch = useDispatch();
  const currentSearchValues = useSelector(selectCurrentSearchValues);
  const [getAds, { isLoading }] = useGetAdsMutation();

  const handleSortSubmit = async (values) => {
    try {
      const { data } = await getAds({
        ...currentSearchValues,
        sort: values.sort,
        asc: values.asc,
      });
      dispatch(adActions.setFoundsAds(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <Formik
        initialValues={{
          name: "",
        }}
        onSubmit={async (values) => {
          console.log("wysyłam");
          console.log(values);
          if (values.name === "Najtańsze") {
            await handleSortSubmit({
              sort: "price",
              asc: true,
              category: "",
            });
          } else if (values.name === "Najdroższe") {
            await handleSortSubmit({
              sort: "price",
              asc: false,
              category: "",
            });
          } else if (values.name === "Najnowsze") {
            await handleSortSubmit({
              sort: "createdAt",
              asc: false,
              category: "",
            });
          } else if (values.name === "Najstarsze") {
            await handleSortSubmit({
              sort: "createdAt",
              asc: true,
              category: "",
            });
          } else {
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-row gap-4 bg-lightWheat p-4 justify-center"
          >
            <select
              name="name"
              value={values.name}
              onChange={handleChange}
              className="px-8 py-4 bg-white"
            >
              <option key="0" value="">
                Sortuj
              </option>
              <option key="1" value="Najtańsze">
                Najtańsze
              </option>
              <option key="2" value="Najdroższe">
                Najdroższe
              </option>
              <option key="3" value="Najnowsze">
                Najnowsze
              </option>
              <option key="4" value="Najstarsze">
                Najstarsze
              </option>
            </select>
            <button type="submit" className="px-8 py-4 font-bold bg-white">
              Sortuj
            </button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SortResults;
