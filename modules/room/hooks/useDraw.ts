import { useBoardPosition } from "./useBoardPosition";
import { useEffect, useState } from "react";
import {
  useOptionsValue,
  useSetSelection,
} from "@/common/recoil/options/options.hooks";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { Move } from "@/common/types/socketTypes";
import { drawCircle, drawLine, drawRect } from "../helpers/canvas.helper";
import { DEFAULT_MOVE } from "@/common/constants";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";
import { useCtx } from "./useCtx";
import { getStringFromRgba } from "@/common/lib/rgba";
import { useMyMoves } from "@/common/recoil/room";

let tempMoves: [number, number][] = [];
let tempCircle = DEFAULT_MOVE.circle;
let tempSize = { width: 0, height: 0 };
let tempImgData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
  const ctx = useCtx();

  const options = useOptionsValue();
  const [drawing, setDrawing] = useState(false);

  const { x: movedX, y: movedY } = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();
  const { handleAddMyMove } = useMyMoves();
  const { setSelection, clearSelection } = useSetSelection();

  const setCxtOptions = () => {
    if (ctx) {
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = getStringFromRgba(options.lineColor);
      ctx.fillStyle = getStringFromRgba(options.fillColor);
      if (options.mode === "eraser")
        ctx.globalCompositeOperation = "destination-out";
      else ctx.globalCompositeOperation = "source-over";
    }
  };

  const drawAndSet = () => {
    if (!tempImgData) {
      tempImgData = ctx?.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }

    if (tempImgData) ctx?.putImageData(tempImgData, 0, 0);
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);

    setDrawing(true);
    setCxtOptions();
    drawAndSet();

    if (options.shape === "line" && options.mode !== "select") {
      ctx.beginPath();
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }

    tempMoves.push([finalX, finalY]);
  };

  const clearOnYourMove = () => {
    drawAndSet();
    tempImgData = undefined;
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    let addMove = true;
    if (options.mode === "select" && tempMoves.length) {
      clearOnYourMove();

      let x = tempMoves[0][0];
      let y = tempMoves[0][1];
      let width = tempMoves[tempMoves.length - 1][0] - x;
      let height = tempMoves[tempMoves.length - 1][1] - y;

      if (width < 0) (width -= 4), (x += 2);
      else (width += 4), (x -= 2);

      if (height < 0) (height -= 4), (y += 2);
      else (height += 4), (y -= 2);

      if ((width < 4 || width > 4) && (height < 4 || height > 4))
        setSelection({ x, y, width, height });
      else {
        addMove = false;
        clearSelection();
      }
    }

    const move: Move = {
      ...DEFAULT_MOVE,
      rect: { ...tempSize },
      circle: { ...tempCircle },
      path: tempMoves,
      options,
    };

    tempMoves = [];
    tempCircle = { ...tempCircle };
    tempSize = { width: 0, height: 0 };

    if (options.mode !== "select") {
      socket.emit("draw", move);
      clearSavedMoves();
    } else if (addMove) handleAddMyMove(move);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);
    drawAndSet();
    if (options.mode === "select") {
      ctx.fillStyle = "rgba(0,0,0,0.2)";

      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      tempMoves.push([finalX, finalY]);

      setCxtOptions();
      return;
    }
    switch (options.shape) {
      case "line":
        if (shift) {
          tempMoves = tempMoves.slice(0, 1);
        }
        drawLine(ctx, tempMoves[0], finalX, finalY, shift);
        tempMoves.push([finalX, finalY]);
        break;
      case "circle":
        tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY, shift);
        break;
      case "rect":
        tempSize = drawRect(ctx, tempMoves[0], finalX, finalY, shift);
        break;
      default:
        break;
    }
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    clearOnYourMove,
    drawing,
  };
};
