import { useCallback, useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { useOptions } from "@/common/recoil/options";
import { drawUndo } from "../helpers/canvas.helper";
import usersAtom, { useUsers } from "@/common/recoil/users";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "@/common/lib/getPos";
import { useSetRecoilState } from "recoil";

let moves: [number, number][] = [];
const savedMoves: [number, number][][] = [];

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean,
  handleEnd: () => void
) => {
  const users = useUsers();
  const options = useOptions();
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

      drawUndo(ctx, savedMoves, users);
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
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();
    savedMoves.push(moves);

    socket.emit("draw", moves, options);

    moves = [];
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
  handleEnd: () => void
) => {
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    socket.on("user_draw", (newMoves, options, userId) => {
      if (ctx) {
        ctx.lineWidth = options.lineWidth;
        ctx.strokeStyle = options.lineColor;

        ctx.beginPath();

        newMoves.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });

        ctx.stroke();
        ctx.closePath();

        handleEnd();

        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          if (newUsers[userId])
            newUsers[userId] = [...newUsers[userId], newMoves];
          return newUsers;
        });
      }
    });

    socket.on("user_undo", (userId) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        newUsers[userId] = newUsers[userId]?.slice(0, -1);

        if (ctx) {
          drawUndo(ctx, savedMoves, newUsers);
          handleEnd();
        }

        return newUsers;
      });
    });

    return () => {
      socket.off("user_draw");
      socket.off("user_undo");
    };
  }, [ctx, handleEnd, setUsers]);
};
