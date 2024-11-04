import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CtxOptions } from "@/common/types/socketTypes";

const initialState: CtxOptions = {
  lineColor: { r: 0, g: 0, b: 0, a: 1 },
  fillColor: { r: 0, g: 0, b: 0, a: 0 },
  lineWidth: 5,
  shape: "line",
  mode: "draw",
  selection: null,
};

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setOptions(state, action: PayloadAction<CtxOptions>) {
      return action.payload;
    },
    setSelection(
      state,
      action: PayloadAction<{
        x: number;
        y: number;
        width: number;
        height: number;
      }>
    ) {
      state.selection = action.payload;
    },
    clearSelection(state) {
      state.selection = null;
    },
  },
});

export const { setOptions, setSelection, clearSelection } =
  optionsSlice.actions;
export default optionsSlice.reducer;
