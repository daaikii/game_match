import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import roomReducer from "../slice/roomSlice";
import statusReducer from "../slice/statusSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    status: statusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
