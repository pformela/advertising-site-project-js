import { apiSlice } from "../../app/api/apiSlice";
import { adActions } from "../ads/adSlice";

export const adApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAds: builder.mutation({
      query: (credentials) => ({
        url: "/ad/get",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.setFoundsAds(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUserAds: builder.mutation({
      query: (credentials) => ({
        url: "/ad/get/user",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.setUserAds(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getSingleAd: builder.mutation({
      query: (credentials) => ({
        url: "/ad/get/single",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.setSingleAd(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    addToFavorites: builder.mutation({
      query: (credentials) => ({
        url: "/ad/favourite",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    removeFromFavourites: builder.mutation({
      query: (credentials) => ({
        url: "/ad/favourite",
        method: "DELETE",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUserFavouriteAds: builder.mutation({
      query: (credentials) => ({
        url: "/ad/get/favourite",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.setUserFavouriteAds(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    createAd: builder.mutation({
      query: (credentials) => ({
        url: "/ad/create",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.addUserAd(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteAd: builder.mutation({
      query: (credentials) => ({
        url: "/ad/delete",
        method: "DELETE",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateAd: builder.mutation({
      query: (credentials) => ({
        url: "/ad/update",
        method: "PUT",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activateAd: builder.mutation({
      query: (credentials) => ({
        url: "/ad/activate",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.activateUserAd(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deactivateAd: builder.mutation({
      query: (credentials) => ({
        url: "/ad/deactivate",
        method: "DELETE",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(adActions.finishUserAd(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetAdsMutation,
  useGetSingleAdMutation,
  useGetUserAdsMutation,
  useCreateAdMutation,
  useDeleteAdMutation,
  useUpdateAdMutation,
  useAddToFavoritesMutation,
  useActivateAdMutation,
  useDeactivateAdMutation,
  useRemoveFromFavouritesMutation,
  useGetUserFavouriteAdsMutation,
} = adApiSlice;
