import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientRoom, Move } from "@/common/types/socketTypes";
import { getColor } from "@/common/lib/getColor";

const initialState: ClientRoom = {
  id: "",
  users: new Map(),
  usersMoves: new Map(),
  movesWithoutUser: [],
  myMoves: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId(state, action: PayloadAction<string>) {
      state.id = action.payload;
      state.users = new Map();
      state.usersMoves = new Map();
      state.movesWithoutUser = [];
      state.myMoves = [];
    },

    updateRoom(state, action: PayloadAction<Partial<ClientRoom>>) {
      Object.assign(state, action.payload); // Merge updates into the current state
    },

    addUser(state, action: PayloadAction<{ userId: string; name: string }>) {
      const { userId, name } = action.payload;
      const color = getColor([...state.users.values()].pop()?.color);
      state.users.set(userId, { name, color });
      state.usersMoves.set(userId, []);
    },

    removeUser(state, action: PayloadAction<string>) {
      const userId = action.payload;
      const userMoves = state.usersMoves.get(userId) || [];
      state.users.delete(userId);
      state.usersMoves.delete(userId);
      state.movesWithoutUser.push(...userMoves);
    },

    addMoveToUser(state, action: PayloadAction<{ userId: string; move: Move }>) {
      const { userId, move } = action.payload;
      const moves = state.usersMoves.get(userId) || [];
      state.usersMoves.set(userId, [...moves, move]);
    },

    removeMoveFromUser(state, action: PayloadAction<string>) {
      const userId = action.payload;
      const moves = state.usersMoves.get(userId) || [];
      moves.pop();
      state.usersMoves.set(userId, moves);
    },

    addMyMove(state, action: PayloadAction<Move>) {
      const move = action.payload;
      const lastMove = state.myMoves[state.myMoves.length - 1];
      if (lastMove && lastMove.options.mode === "select") {
        state.myMoves[state.myMoves.length - 1] = move;
      } else {
        state.myMoves.push(move);
      }
    },

    removeMyMove(state) {
      state.myMoves.pop();
    },
  },
});


export const {
  setRoomId,
  addUser,
  removeUser,
  addMoveToUser,
  removeMoveFromUser,
  addMyMove,
  removeMyMove,
  updateRoom,
} = roomSlice.actions;
export default roomSlice.reducer;
