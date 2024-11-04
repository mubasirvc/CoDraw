import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setRoomId,
  addUser,
  removeUser,
  addMoveToUser,
  removeMoveFromUser,
  addMyMove,
  removeMyMove,
  updateRoom,
} from "./room.slice";
import { Move } from "@/common/types/socketTypes";

// Retrieve the full room object
export const useRoom = () => {
  return useSelector((state: RootState) => state.room);
};

// Set the entire room state (Redux does not directly allow setting state like Recoil’s useSetRecoilState, 
// so here we would implement specific actions as needed)

// export const useSetRoom = () => {
//   const dispatch = useDispatch();
//   return (room: RootState['room']) => dispatch(setRoomId(room.id));
// };

export const useSetRoom = () => {
  const dispatch = useDispatch();
  return (updates: Partial<RootState['room']>) => dispatch(updateRoom(updates));
};

// Get the current room ID
export const useRoomId = () => {
  return useSelector((state: RootState) => state.room.id);
};

// Set a new room ID and reset other state properties (similar to `handlSetRoomId` from Recoil)
export const useSetRoomId = () => {
  const dispatch = useDispatch();
  return (id: string) => dispatch(setRoomId(id));
};

// Manage users (add and remove)
export const useSetUsers = () => {
  const dispatch = useDispatch();

  const handleAddUser = (userId: string, name: string) => {
    dispatch(addUser({ userId, name }));
  };

  const handleRemoveUser = (userId: string) => {
    dispatch(removeUser(userId));
  };

  const handleAddMoveToUser = (userId: string, move: Move) => {
    dispatch(addMoveToUser({ userId, move }));
  };

  const handleRemoveMoveFromUser = (userId: string) => {
    dispatch(removeMoveFromUser(userId));
  };

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

// Manage my moves (add and remove)
export const useMyMoves = () => {
  const dispatch = useDispatch();
  const myMoves = useSelector((state: RootState) => state.room.myMoves);

  const handleAddMyMove = (move: Move) => {
    dispatch(addMyMove(move));
  };

  const handleRemoveMyMove = (): Move | undefined => {
    const lastMove = myMoves[myMoves.length - 1];
    dispatch(removeMyMove());
    return lastMove;
  };

  return { handleAddMyMove, handleRemoveMyMove, myMoves };
};
