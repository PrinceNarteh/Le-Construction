import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
};

export const resetPasswordSlice = createSlice({
  name: "reset-password",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = "";
    },
  },
});

export const { setEmail, clearEmail } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
