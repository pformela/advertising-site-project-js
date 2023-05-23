import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  phone: "",
  userId: "",
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.phone = action.payload.phone ? action.payload.phone : "";
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName
        ? action.payload.firstName
        : "";
      state.lastName = action.payload.lastName ? action.payload.lastName : "";
      state.city = action.payload.city ? action.payload.city : "";
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.email = "";
      state.phone = "";
      state.isAuthenticated = false;
    },
  },
});

export const selectUser = (state) => state.user;

export const userActions = userSlice.actions;

export default userSlice.reducer;
