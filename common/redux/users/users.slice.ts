import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Move } from "@/common/types/socketTypes";
import { RootState } from "../store";

interface UsersState {
  [key: string]: Move[];
}

const initialState: UsersState = {};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserMoves: (state, action: PayloadAction<{ userId: string; moves: Move[] }>) => {
      const { userId, moves } = action.payload;
      state[userId] = moves;
    },
    clearUsers: () => initialState,
  },
});

export const { setUserMoves, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
export const selectUsers = (state: RootState) => state.users;
export const selectUserIds = (state: RootState) => Object.keys(state.users);
