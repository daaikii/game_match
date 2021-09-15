import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
  name: "status",
  initialState: {
    status: {
      LoL: { platform: "", id: "" },
      Valorant: { platform: "", id: "" },
      Apex: { platform: "", id: "" },
      Fortnite: { platform: "", id: "" },
      Game: { platform: "", id: "" },
    },
    condition: "",
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setCondition: (state, action) => {
      state.condition = action.payload;
    },
  },
});

export const { setStatus, setCondition } = statusSlice.actions;
export const selectStatus = (state) => state.status.status;
export const selectCondition = (state) => state.status.condition;

export default statusSlice.reducer;
