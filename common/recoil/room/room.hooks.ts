import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DEFAULT_ROOM, roomAtom } from "./room.atom";
import { Move } from "@/common/types/socketTypes";
import { getColor } from "@/common/lib/getColor";

export const useRoom = () => {
  const room = useRecoilValue(roomAtom);

  return room;
};

export const useSetRoom = () => {
  const setRoom = useSetRecoilState(roomAtom);

  return setRoom;
};

export const useRoomId = () => {
  const { id } = useRecoilValue(roomAtom);

  return id;
};

export const useSetRoomId = () => {
  const setRoomId = useSetRecoilState(roomAtom);

  const handlSetRoomId = (id: string) => {
    setRoomId({ ...DEFAULT_ROOM, id });
  };

  return handlSetRoomId;
};

export const useSetUsers = () => {
  const setRoom = useSetRecoilState(roomAtom);

  const handleAddUser = (userId: string, name: string) => {
    setRoom((prev) => {
      const { users: newUsers, usersMoves: newUserMoves } = prev;
      
      const color = getColor([...newUsers.values()].pop()?.color)
      newUsers.set(userId, {name, color});
      newUserMoves.set(userId, []);

      return { ...prev, users: newUsers, usersMoves: newUserMoves };
    });
  };

  const handleRemoveUser = (userId: string) => {
    setRoom((prev) => {
      const { users: newUsers, usersMoves: newUserMoves } = prev;

      const userMoves = newUserMoves.get(userId);
      newUsers.delete(userId);
      newUserMoves.delete(userId);

      return {
        ...prev,
        users: newUsers,
        usersMoves: newUserMoves,
        movesWithoutUser: [...prev.movesWithoutUser, ...(userMoves || [])],
      };
    });
  };

  const handleAddMoveToUser = (userId: string, moves: Move) => {
    setRoom((prev) => {
      const newUserMoves = prev.usersMoves;
      const oldMoves = prev.usersMoves.get(userId);

      newUserMoves.set(userId, [...(oldMoves || []), moves]);

      return { ...prev, usersMoves: newUserMoves };
    });
  };

  const handleRemoveMoveFromUser = (userId: string) => {
    setRoom((prev) => {
      const newUserMoves = prev.usersMoves;
      const oldMoves = prev.usersMoves.get(userId);
      oldMoves?.pop();

      newUserMoves.set(userId, oldMoves || []);

      return { ...prev, usersMoves: newUserMoves };
    });
  };

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

export const useMyMoves = () => {
  const [room, setRoom] = useRecoilState(roomAtom);

  const handleAddMyMove = (move: Move) => {
    setRoom((prev) => ({ ...prev, myMoves: [...prev.myMoves, move] }));
  };

  const handleRemoveMyMove = () => {
    const newMoves = [...room.myMoves];
    const removedMove = newMoves.pop();
    setRoom((prev) => ({ ...prev, myMoves: newMoves }));

    return removedMove
  };

  return { handleAddMyMove, handleRemoveMyMove, myMoves: room.myMoves };
};
