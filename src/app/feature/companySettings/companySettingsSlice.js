import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companySettings: null,
};

export const companySettingsSlice = createSlice({
  name: "company_settings",
  initialState,
  reducers: {
    setCompanySettings: (state, action) => {
      state.companySettings = action.payload;
    },
    clearCompanySettings: (state) => {
      state.companySettings = null;
    },
  },
});

export const { setCompanySettings, clearCompanySettings } =
  companySettingsSlice.actions;
export default companySettingsSlice.reducer;
