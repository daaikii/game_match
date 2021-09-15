import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type USER = {
  displayName: string;
  photoUrl: string;
};

const userSlice = createSlice({
  name: "user",
  initialState: { user: { uid: "", displayName: "", photoUrl: "" } },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = { uid: "", displayName: "", photoUrl: "" };
    },
    signUpUserProfile: (state, action) => {
      state.user.displayName = action.payload.displayName;
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
  },
});

export const { login, logout, signUpUserProfile, updateUserProfile } =
  userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
