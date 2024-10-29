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
import { useRefs } from "./useRefs";
import { DEFAULT_MOVE } from "@/common/constants";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";

let tempMoves: [number, number][] = [];
let tempCircle = DEFAULT_MOVE.circle;
let tempSize = { width: 0, height: 0 };
let tempImgData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
  const { canvasRef } = useRefs();

  const options = useOptionsValue();
  const [drawing, setDrawing] = useState(false);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const { x: movedX, y: movedY } = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();
  const { setSelection } = useSetSelection();

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) setCtx(newCtx);
  }, [canvasRef]);

  const setCxtOptions = () => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
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

    if (options.shape === "line" && options.mode !== "select") {
      ctx.beginPath();
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }

    tempMoves.push([finalX, finalY]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    if (options.mode === "select") {
      drawAndSet();

      const x = tempMoves[0][0];
      const y = tempMoves[0][1];
      const width = tempMoves[tempMoves.length - 1][0] - x;
      const height = tempMoves[tempMoves.length - 1][1] - y;

      if (width !== 0 && height !== 0) setSelection({ x, y, width, height });
    }

    const move: Move = {
      rect: { ...tempSize },
      circle: { ...tempCircle },
      path: tempMoves,
      options,
      timestamp: 0,
      img: DEFAULT_MOVE.img,
      id: "",
    };

    tempMoves = [];
    tempCircle = { ...tempCircle };
    tempSize = { width: 0, height: 0 };
    tempImgData = undefined;

    if (options.mode !== "select") {
      socket.emit("draw", move);
      clearSavedMoves();
    }
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);
    drawAndSet();
    if (options.mode === "select") {
      ctx.fillStyle = "rgba(0,0,0,0.2)";

      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      ctx.fillStyle = "rgba(0,0,0)";
      tempMoves.push([finalX, finalY]);
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
    drawing,
  };
};
