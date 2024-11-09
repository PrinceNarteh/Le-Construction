import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFCMToken: (state, action) => {
      state.user = {
        ...state.user,
        fcm_token: action.payload,
      };
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, setFCMToken } = userSlice.actions;

export default userSlice.reducer;
