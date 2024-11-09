import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  percentage: 0,
};

const loadingBarSlice = createSlice({
  name: "loadingBar",
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.percentage = action.payload;
    },
    resetValue: (state) => {
      state.percentage = 0;
    },
  },
});

export const { setValue, resetValue } = loadingBarSlice.actions;
export default loadingBarSlice.reducer;
