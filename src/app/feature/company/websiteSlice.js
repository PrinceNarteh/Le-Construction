import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  website: null,
};

export const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    setWebsite: (state, action) => {
      state.website = action.payload;
    },
    clearWebsite: (state) => {
      state.website = null;
    },
  },
});

export const { setWebsite, clearWebsite } = websiteSlice.actions;
export default websiteSlice.reducer;
