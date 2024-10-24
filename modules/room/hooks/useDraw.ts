import { useMyMoves, useRoom } from "@/common/recoil/room";
import { useBoardPosition } from "./useBoardPosition";
import { useCallback, useEffect, useState } from "react";
import { useOptionsValue } from "@/common/recoil/options/options.hooks";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { CtxOptions, Move } from "@/common/types/socketTypes";
import { drawAllMoves } from "../helpers/canvas.helper";

let tempMoves: [number, number][] = [];

const setCxtOptions = (ctx: CanvasRenderingContext2D, options: CtxOptions) => {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  (ctx.lineWidth = options.lineWidth), (ctx.strokeStyle = options.lineColor);
  if (options.erase) ctx.globalCompositeOperation = "destination-out";
};

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean
) => {
  const room = useRoom()
  const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
  const options = useOptionsValue();
  const [drawing, setDrawing] = useState(false);

  const { x: movedX, y: movedY } = useBoardPosition();

  useEffect(() => {
    if (ctx) setCxtOptions(ctx, options)
  });

  useEffect(() => {
    socket.on("your_move", (move) => {
      handleAddMyMove(move);
    });

    return () => {
      socket.off("your_move");
    };
  });

  const handleUndo = useCallback(() => {
    if (ctx) {
      handleRemoveMyMove();
      socket.emit("undo");
    }
  }, [ctx, handleRemoveMyMove]);

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

    tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    const move: Move = {
      path: tempMoves,
      options,
      timestamp: 0,
      eraser: options.erase,
    };

    tempMoves = [];
    ctx.globalCompositeOperation = "source-over";

    socket.emit("draw", move);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    if(shift){
      tempMoves = tempMoves.slice(0, 1)
      drawAllMoves(ctx, room)
      setCxtOptions(ctx, options)

      ctx.beginPath()
      ctx.lineTo(tempMoves[0][0], tempMoves[0][1])
      ctx.lineTo(getPos(x, movedX), getPos(y, movedY))
      ctx.stroke()
      ctx.closePath()

      tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);

      return
    }

    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    handleUndo,
    drawing,
  };
};
