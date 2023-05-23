import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userAds: [],
  finishedUserAds: [],
  favouriteUserAds: [],
  favouriteUserAdsIds: [],
  isFavoriteUserAdsEmpty: false,
  filteredUserAds: [],
  isUserAdsEmpty: false,
  foundAds: [],
  highlightedAds: [],
  currentSearchValues: {
    searchValue: "",
    category: "",
    city: "",
    priceFrom: "",
    priceTo: "",
  },
  ad: {},
  formAd: {},
};

export const adSlice = createSlice({
  name: "ad",
  initialState,
  reducers: {
    setCurrentSearchValues: (state, action) => {
      state.currentSearchValues.searchValue = action.payload.searchValue;
      state.currentSearchValues.category = action.payload.category
        ? action.payload.category
        : "";
      state.currentSearchValues.city = action.payload.city
        ? action.payload.city
        : "";
      state.currentSearchValues.priceFrom = action.payload.priceFrom
        ? action.payload.priceFrom
        : "";
      state.currentSearchValues.priceTo = action.payload.priceTo
        ? action.payload.priceTo
        : "";
    },
    setFoundsAds: (state, action) => {
      state.foundAds = action.payload;
    },
    setHighlightedAds: (state, action) => {
      state.highlightedAds = action.payload;
    },
    setSingleAd: (state, action) => {
      state.ad = action.payload[0];
    },
    setUserAds: (state, action) => {
      action.payload.reduce((acc, ad) => {
        if (ad.active) {
          state.userAds = [ad, ...state.userAds];
          state.filteredUserAds = [ad, ...state.filteredUserAds];
        } else {
          state.finishedUserAds = [ad, ...state.finishedUserAds];
        }
        return acc;
      }, "");
    },
    setFormAd: (state, action) => {
      state.formAd = action.payload;
    },
    activateUserAd: (state, action) => {
      const activatedAd = action.payload[0];
      state.userAds = [activatedAd, ...state.userAds];
      state.filteredUserAds = [activatedAd, ...state.filteredUserAds];
      state.finishedUserAds = [...state.finishedUserAds].reduce((acc, ad) => {
        if (ad.id !== activatedAd.id) acc.push(ad);
        return acc;
      }, []);
    },
    finishUserAd: (state, action) => {
      const finishedAd = action.payload[0];
      state.userAds = [...state.userAds].reduce((acc, ad) => {
        if (ad.id !== finishedAd.id) acc.push(ad);
        return acc;
      }, []);
      state.filteredUserAds = [...state.filteredUserAds].reduce((acc, ad) => {
        if (ad.id !== finishedAd.id) acc.push(ad);
        return acc;
      }, []);
      state.finishedUserAds = [finishedAd, ...state.finishedUserAds];
    },
    setUserFavouriteAds: (state, action) => {
      if (action.payload.length === 0) {
        state.isFavoriteUserAdsEmpty = true;
      } else {
        state.favouriteUserAds = action.payload;
        state.favouriteUserAdsIds = action.payload.map((ad) => ad.id);
        state.isFavoriteUserAdsEmpty = false;
      }
    },
    setAdToEdit: (state, action) => {
      state.formAd = state.userAds.filter((ad) => ad.id === action.payload)[0];
    },
    // updateUserAd: (state, action) => {
    //   const updatedAd = action.payload[0];
    //   state.userAds = [...state.userAds].reduce((acc, ad) => {
    //     if (ad.id === updatedAd.id) acc.push(updatedAd);
    //     else acc.push(ad);
    //     return acc;
    //   }, []);
    //   state.filteredUserAds = [...state.filteredUserAds].reduce((acc, ad) => {
    //     if (ad.id === updatedAd.id) acc.push(updatedAd);
    //     else acc.push(ad);
    //     return acc;
    //   }, []);
    // },
    removeUserAd: (state, action) => {
      state.finishedUserAds = [...state.finishedUserAds].reduce((acc, ad) => {
        if (ad.id !== action.payload) acc.push(ad);
        return acc;
      }, []);
    },
    setIsUserAdsEmpty: (state, action) => {
      state.isUserAdsEmpty = action.payload;
    },
    addUserFavuoriteAd: (state, action) => {
      state.favouriteUserAds = [action.payload, ...state.favouriteUserAds];
      state.favouriteUserAdsIds = [
        action.payload.id,
        ...state.favouriteUserAdsIds,
      ];
    },
    removeUserFavuoriteAd: (state, action) => {
      state.favouriteUserAds = state.favouriteUserAds.filter(
        (ad) => ad.id !== action.payload
      );
      state.favouriteUserAdsIds = state.favouriteUserAdsIds.filter(
        (id) => id !== action.payload
      );
    },
    addUserAd: (state, action) => {
      state.userAds = [action.payload, ...state.userAds];
      state.filteredUserAds = [action.payload, ...state.filteredUserAds];
    },
    filterUserAds: (state, action) => {
      state.filteredUserAds = state.userAds.filter(
        (ad) =>
          ad.title.toLowerCase().includes(action.payload.title.toLowerCase()) &&
          (action.payload.category !== ""
            ? ad.category === action.payload.category
            : true)
      );
    },
    sortUserAds: (state, action) => {
      if (action.payload.asc) {
        state.filteredUserAds.sort((a, b) =>
          a[action.payload.sort] > b[action.payload.sort] ? 1 : -1
        );
      } else {
        state.filteredUserAds.sort((a, b) =>
          a[action.payload.sort] < b[action.payload.sort] ? 1 : -1
        );
      }
    },
    resetFilterUserAds: (state) => {
      state.filteredUserAds = state.userAds;
    },
  },
});

export const selectUserAds = (state) => state.ad.userAds;
export const selectFilteredUserAds = (state) => state.ad.filteredUserAds;
export const selectFavouriteUserAds = (state) => state.ad.favouriteUserAds;
export const selectIsFavoriteUserAdsEmpty = (state) =>
  state.ad.isFavoriteUserAdsEmpty;
export const selectFoundAds = (state) => state.ad.foundAds;
export const selectHighlightedAds = (state) => state.ad.highlightedAds;
export const selectCurrentSearchValues = (state) =>
  state.ad.currentSearchValues;
export const selectSingleAd = (state) => state.ad.ad;
export const selectIsUserAdsEmpty = (state) => state.ad.isUserAdsEmpty;
export const selectFinishedUserAds = (state) => state.ad.finishedUserAds;
export const selectFavouriteUserAdsIds = (state) =>
  state.ad.favouriteUserAdsIds;
export const selectFormAd = (state) => state.ad.formAd;

export const adActions = adSlice.actions;

export default adSlice.reducer;
