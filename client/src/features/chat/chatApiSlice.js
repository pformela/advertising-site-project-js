import { apiSlice } from "../../app/api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postMessage: builder.mutation({
      query: (message) => ({
        url: "/chat",
        method: "POST",
        body: { ...message },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getMessages: builder.mutation({
      query: (userId) => ({
        url: `/chat/get`,
        method: "POST",
        body: { ...userId },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    checkIfReceiverAndAdExist: builder.mutation({
      query: (message) => ({
        url: "/chat/check",
        method: "POST",
        body: { ...message },
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
  usePostMessageMutation,
  useGetMessagesMutation,
  useCheckIfReceiverAndAdExistMutation,
} = chatApiSlice;
