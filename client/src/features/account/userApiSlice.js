import { apiSlice } from "../../app/api/apiSlice";
import { userActions } from "./userSlice";
import { logout } from "../authentication/authSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeUserData: builder.mutation({
      query: (credentials) => ({
        url: "/user/updateData",
        method: "PUT",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.setUser(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    changeUserPassword: builder.mutation({
      query: (credentials) => ({
        url: "/user/updatePassword",
        method: "PUT",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.setUser(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    changeUserEmail: builder.mutation({
      query: (credentials) => ({
        url: "/user/updateEmail",
        method: "PUT",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.setUser(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/delete",
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
  }),
});

export const {
  useChangeUserDataMutation,
  useChangeUserPasswordMutation,
  useChangeUserEmailMutation,
  useDeleteUserMutation,
} = userApiSlice;
