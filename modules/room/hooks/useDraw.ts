import { useBoardPosition } from "./useBoardPosition";
import { useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import { Move } from "@/common/types/socketTypes";
import { drawCircle, drawLine, drawRect } from "../helpers/canvas.helper";
import { DEFAULT_MOVE } from "@/common/constants";
import { useCtx } from "./useCtx";
import { getStringFromRgba } from "@/common/lib/rgba";
import { useOptionsValue, useSetSelection } from "@/common/redux/options";
import { useMyMoves } from "@/common/redux/room";
import { useSetSavedMoves } from "@/common/redux/savedMoves/savedMoves.hooks";
import { Canvas, Rect } from "fabric";

let tempMoves: [number, number][] = [];
let tempCircle = DEFAULT_MOVE.circle;
let tempSize = { width: 0, height: 0 };
let tempImgData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
  const ctx = useCtx();
  const options = useOptionsValue();
  const [drawing, setDrawing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const { x: movedX, y: movedY } = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();
  const { handleAddMyMove } = useMyMoves();
  const { setSelection, clearSelection } = useSetSelection();

  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isTyping) {
      const cursorBlink = setInterval(
        () => setShowCursor((prev) => !prev),
        500
      );
      return () => clearInterval(cursorBlink);
    }
  }, [isTyping]);

  const setCxtOptions = () => {
    if (ctx) {
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = getStringFromRgba(options.lineColor);
      ctx.fillStyle = getStringFromRgba(options.fillColor);
      ctx.globalCompositeOperation =
        options.mode === "eraser" ? "destination-out" : "source-over";
    }
  };

  const drawAndSet = () => {
    if (tempImgData) {
      console.log("Restoring previous image data");
      ctx?.putImageData(tempImgData, 0, 0);
    } else if (ctx) {
      console.log("Saving canvas state for future restoration");
      tempImgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const handleStartDrawing = (
    x: number,
    y: number,
    // setInputPosition: (pos: { x: number; y: number }) => void,
    // setInputVisible: (val: boolean) => void,
    // setText: (val: string) => void,
    // setIsTyping: (val: boolean) => void,
  ) => {
    if (!ctx || blocked) return;

    const finalX = getPos(x, movedX);
    const finalY = getPos(y, movedY);

    // if (options.mode === "type") {
    //   console.log("Entering typing mode");
    //   setTextPosition({ x: finalX, y: finalY });
    //   setText("");
    //   setIsTyping(true);
    //   return;
    // }

    // if (options.mode === "type") {
    //   console.log("Entering typing mode");
    //   setInputPosition({ x: finalX, y: finalY });
    //   setText(""); // Reset text state
    //   setInputVisible(true); // Show the input field
    //   setIsTyping(true);
    //   return;
    // }

    setIsTyping(false);
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
    if (!ctx || blocked || options.mode === "type") return;

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
    if (!ctx || !drawing || blocked || isTyping) return;

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
        if (shift) tempMoves = tempMoves.slice(0, 1);
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

  // const handleKeyPress = (e: KeyboardEvent) => {
  //   if (!isTyping || !ctx) return;

  //   if (e.key === " ") e.preventDefault();

  //   if (e.key === "Enter") {
  //     tempMoves.push([textPosition.x, textPosition.y]);
  //     setIsTyping(false);

  //     // Save the image state with the finalized text
  //     tempImgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   } else {
  //     drawTextPreview(e.key);
  //     setText((prev) =>
  //       e.key === "Backspace" ? prev.slice(0, -1) : prev + e.key
  //     );
  //   }
  // };

  // const drawTextPreview = (latestKey: string) => {

  //   if (!ctx) return;

  //   const previewText =
  //     latestKey === "Backspace" ? text.slice(0, -1) : text + latestKey;

  //   drawAndSet();

  //   ctx.font = "20px sans serif";
  //   ctx.textBaseline = "top";
  //   ctx.fillStyle = "black";
  //   ctx.fillText(previewText, textPosition.x, textPosition.y);

  //   // Draw a dynamic rectangle around the text (optional)
  //   const textWidth = ctx.measureText(previewText).width;
  //   const textHeight = 20; // Approximate line height

  //   // Draw a blinking cursor
  //   if (showCursor) {
  //     ctx.beginPath();
  //     ctx.moveTo(textPosition.x + textWidth + 2, textPosition.y);
  //     ctx.lineTo(textPosition.x + textWidth + 2, textPosition.y + textHeight);
  //     ctx.strokeStyle = "black";
  //     ctx.stroke();
  //   }
  // };

  // Listen for keypress events
  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyPress);
  //   return () => window.removeEventListener("keydown", handleKeyPress);
  // }, [isTyping, text, textPosition]);

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    clearOnYourMove,
    drawing,
  };
};
