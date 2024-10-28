import { useBoardPosition } from "./useBoardPosition";
import { useEffect, useState } from "react";
import { useOptionsValue } from "@/common/recoil/options/options.hooks";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { Move } from "@/common/types/socketTypes";
import { drawCircle, drawLine, drawRect } from "../helpers/canvas.helper";
import { useRefs } from "./useRefs";
import { DEFAULT_MOVE } from "@/common/constants";

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
      if (options.erase) ctx.globalCompositeOperation = "destination-out";
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

    ctx.beginPath();
    ctx.lineTo(finalX, finalY);
    ctx.stroke();

    tempMoves.push([finalX, finalY]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    const move: Move = {
      rect: { ...tempSize },
      circle: { ...tempCircle },
      path: tempMoves,
      options,
      timestamp: 0,
      eraser: options.erase,
      img: DEFAULT_MOVE.img,
      id: "",
    };

    tempMoves = [];
    tempCircle = { ...tempCircle };
    tempSize = { width: 0, height: 0 };
    tempImgData = undefined;

    socket.emit("draw", move);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);

    switch (options.shape) {
      case "line":
        if (shift) {
          tempMoves = tempMoves.slice(0, 1);
          drawAndSet();
        }
        drawLine(ctx, tempMoves[0], finalX, finalY, shift);
        tempMoves.push([finalX, finalY]);
        break;
      case "circle":
        drawAndSet();
        if(shift) tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY, shift);
        else tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY );
        break;
      case "rect":
        drawAndSet();
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
