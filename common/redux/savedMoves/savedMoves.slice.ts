import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Move } from "@/common/types/socketTypes";

interface SavedMovesState {
  savedMoves: Move[];
}

const initialState: SavedMovesState = {
  savedMoves: [],
};

const savedMovesSlice = createSlice({
  name: 'savedMoves',
  initialState,
  reducers: {
    addMove: (state, action: PayloadAction<Move>) => {
      if (action.payload.options.mode !== "select") {
        state.savedMoves.unshift(action.payload);
      }
    },
    removeMove: (state) => {
      if (state.savedMoves.length > 0) {
        state.savedMoves.shift();
      }
    },
    clearMoves: (state) => {
      state.savedMoves = [];
    },
  },
});

export const { addMove, removeMove, clearMoves } = savedMovesSlice.actions;
export default savedMovesSlice.reducer;
