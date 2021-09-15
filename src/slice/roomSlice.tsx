import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    room: {
      categorie: "",
      title: "",
      roomId: "",
      host: false,
    },
  },
  reducers: {
    reqruit: (state, action) => {
      state.room = {
        categorie: action.payload.categorie,
        title: action.payload.title,
        roomId: action.payload.roomId,
        host: true,
      };
    },
    join: (state, action) => {
      state.room = {
        categorie: action.payload.categorie,
        title: action.payload.title,
        roomId: action.payload.roomId,
        host: false,
      };
    },
    exit: (state) => {
      state.room = {
        categorie: "",
        title: "",
        roomId: "",
        host: false,
      };
    },
  },
});

export const { reqruit, join, exit } = roomSlice.actions;
export const selectRoom = (state) => state.room.room;

export default roomSlice.reducer;
