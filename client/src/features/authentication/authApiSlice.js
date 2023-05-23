import { apiSlice } from "../../app/api/apiSlice";
import { logout, setCredentials } from "./authSlice";
import { userActions } from "../account/userSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, email, phone, userId, city, firstName, lastName } =
            data;
          dispatch(setCredentials({ token }));
          dispatch(
            userActions.setUser({
              email,
              phone,
              userId,
              city,
              firstName,
              lastName,
            })
          );
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, email, phone, userId, city, firstName, lastName } =
            data;
          dispatch(setCredentials({ token }));
          dispatch(
            userActions.setUser({
              email,
              phone,
              userId,
              city,
              firstName,
              lastName,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          dispatch(userActions.clearUser());
          apiSlice.util.resetApiState();
        } catch (error) {
          console.log(error);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, email, phone, userId, city, firstName, lastName } =
            data;
          dispatch(setCredentials({ token }));
          dispatch(
            userActions.setUser({
              email,
              phone,
              userId,
              city,
              firstName,
              lastName,
            })
          );
        } catch (error) {
          // console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice;
