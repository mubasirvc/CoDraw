import { useCallback, useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { drawAllMoves, handleMove } from "../helpers/canvas.helper";
import usersAtom, { useUsers } from "@/common/recoil/users";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "@/common/lib/getPos";
import { useSetRecoilState } from "recoil";
import { Move, Room } from "@/common/types/socketTypes";
import { useOptionsValue } from "@/common/recoil/options/options.hooks";

const movesWithoutUser: Move[] = [];
let moves: [number, number][] = [];
const savedMoves: Move[] = [];

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean,
  handleEnd: () => void
) => {
  const users = useUsers();
  const options = useOptionsValue();
  const [drawing, setDrawing] = useState(false);

  const { x: movedX, y: movedY } = useBoardPosition();

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  });

  const handleUndo = useCallback(() => {
    if (ctx) {
      savedMoves.pop();
      socket.emit("undo");

      drawAllMoves(ctx, movesWithoutUser, savedMoves, users);
      handleEnd();
    }
  }, [ctx, handleEnd, users]);

  useEffect(() => {
    const handleUndoKey = (e: KeyboardEvent) => {
      if (e.key === "z" && e.ctrlKey) {
        handleUndo();
      }
    };

    document.addEventListener("keydown", handleUndoKey);

    return () => {
      document.removeEventListener("keydown", handleUndoKey);
    };
  }, [handleUndo]);

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    moves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    const move: Move = {
      path: moves,
      options,
    };
    savedMoves.push(move);
    moves = [];

    socket.emit("draw", move);

    drawAllMoves(ctx, movesWithoutUser, savedMoves, users);
    handleEnd();
  };

  const handleDraw = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) return;

    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    moves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    handleUndo,
    drawing,
  };
};

export const useSocketDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  drawing: boolean,
  handleEnd: () => void
) => {
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    if (ctx) socket.emit("joined_room");
  }, [ctx]);

  useEffect(() => {
    socket.on("room", (room, usersToParse) => {
      if (!ctx) return;

      const users = new Map<string, Move[]>(JSON.parse(usersToParse));

      room?.drawed?.forEach((move) => {
        handleMove(move, ctx);
        movesWithoutUser.push(move);
      });

      users?.forEach((userMoves, userId) => {
        userMoves?.forEach((move) => handleMove(move, ctx));
        setUsers((prev) => ({ ...prev, [userId]: userMoves }));
      });

      handleEnd();
    });

    return () => {
      socket.off("room");
    };
  }, [ctx, handleEnd, setUsers]);

  useEffect(() => {
    let moveToDrawLater: Move | undefined;
    let userIdLater = "";
    socket.on("user_draw", (move, userId) => {
      if (ctx && !drawing) {
        handleMove(move, ctx);

        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          if (newUsers[userId]) newUsers[userId] = [...newUsers[userId], move];
          return newUsers;
        });
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");
      if (moveToDrawLater && userIdLater && ctx) {
        handleMove(moveToDrawLater, ctx);
        handleEnd();
        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          if (newUsers[userIdLater])
            newUsers[userIdLater] = [
              ...newUsers[userIdLater],
              moveToDrawLater as Move,
            ];

          return newUsers;
        });
      }
    };
  }, [ctx, handleEnd, setUsers, drawing]);

  useEffect(() => {
    socket.on("user_undo", (userId) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        newUsers[userId] = newUsers[userId]?.slice(0, -1);

        if (ctx) {
          drawAllMoves(ctx, movesWithoutUser, savedMoves, newUsers);
          handleEnd();
        }

        return newUsers;
      });
    });

    return () => {
      socket.off("user_undo");
    };
  }, [ctx, handleEnd, setUsers]);
};
