import { configureStore } from "@reduxjs/toolkit";
import optionsReducer from "./options/options.slice";
import roomReducer from "./room/room.slice";
import savedMovesReducer from "./savedMoves/savedMoves.slice";
import usersReducer from "./users/users.slice";
import { enableMapSet } from 'immer';

enableMapSet()

const store = configureStore({
  reducer: {
    room: roomReducer,
    options: optionsReducer,
    savedMoves: savedMovesReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
