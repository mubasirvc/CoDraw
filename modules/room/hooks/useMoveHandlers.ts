import { useEffect, useMemo, useState } from "react";
import { socket } from "@/common/lib/socket";
import { useRefs } from "./useRefs";
import { Move } from "@/common/types/socketTypes";
import { useCtx } from "./useCtx";
import { useSelection } from "./useSelection";
import { getStringFromRgba } from "@/common/lib/rgba";
import { useSetSelection } from "@/common/recoil/options";
import { useMyMoves, useRoom } from "@/common/redux/room";
import { useSetSavedMoves } from "@/common/redux/savedMoves/savedMoves.hooks";

let prevMovesLength = 0;

export const useMovesHandlers = (clearOnYourMove: () => void) => {
  const { canvasRef, miniMapRef } = useRefs();
  const room = useRoom();
  const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();

  const ctx = useCtx();
  const { clearSelection } = useSetSelection();

  const { addSavedMove, removeSavedMove } = useSetSavedMoves();

  const sortedMoves = useMemo(() => {
    const { usersMoves, movesWithoutUser, myMoves } = room;
    const moves = [...movesWithoutUser, ...myMoves];

    usersMoves.forEach((userMoves) => moves.push(...userMoves));

    moves.sort((a, b) => a.timestamp - b.timestamp);

    return moves;
  }, [room]);

  const copyCanvasToSmall = () => {
    if (canvasRef.current && miniMapRef.current) {
      const smallCtx = miniMapRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
      }
    }
  };

  const drawMove = (move: Move, image?: HTMLImageElement) => {
    const { path } = move;

    if (!ctx && !path.length) return;

    const moveOptions = move.options;

    if (moveOptions.mode == "select") return;

    ctx!.lineWidth = moveOptions.lineWidth;
    ctx!.strokeStyle = getStringFromRgba(moveOptions.lineColor);
    ctx!.fillStyle = getStringFromRgba(moveOptions.fillColor);
    if (moveOptions.mode === "eraser")
      ctx!.globalCompositeOperation = "destination-out";
    else ctx!.globalCompositeOperation = "source-over";

    if (moveOptions.shape === "image" && image) {
      ctx?.drawImage(image, path[0][0], path[0][1]);
    }

    switch (moveOptions.shape) {
      case "line":
        ctx?.beginPath();
        path?.forEach(([x, y]) => {
          ctx?.lineTo(x, y);
        });
        ctx?.stroke();
        ctx?.closePath();
        break;
      case "circle": {
        const { cX, cY, radiusX, radiusY } = move.circle;

        ctx?.beginPath();
        ctx?.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx?.stroke();
        ctx?.fill();
        ctx?.closePath();
        break;
      }
      case "rect": {
        const { width, height } = move.rect;

        ctx?.beginPath();
        ctx?.rect(path[0][0], path[0][1], width, height);
        ctx?.stroke();
        ctx?.fill();
        ctx?.closePath();
        break;
      }
      default:
        break;
    }

    copyCanvasToSmall();
  };

  const drawAllMoves = async () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const images = await Promise.all(
      sortedMoves
        .filter((move) => move.options.shape === "image")
        .map((move) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = move.img.base64;
            img.id = move.id;
            img.addEventListener("load", () => resolve(img));
          });
        })
    );

    sortedMoves.forEach((move) => {
      if (move.options.shape === "image") {
        const img = images.find((image) => image.id === move.id);
        if (img) drawMove(move, img);
      } else drawMove(move);
    });

    copyCanvasToSmall();
  };

  useSelection(drawAllMoves);

  useEffect(() => {
    socket.on("your_move", (move) => {
      clearOnYourMove();
      handleAddMyMove(move);
      setTimeout(clearSelection, 100);
    });

    return () => {
      socket.off("your_move");
    };
  }, [handleAddMyMove, clearOnYourMove, clearSelection]);

  useEffect(() => {
    if (prevMovesLength >= sortedMoves.length || !prevMovesLength) {
      drawAllMoves();
    } else {
      const lastMove = sortedMoves[sortedMoves.length - 1];

      if (lastMove.options.shape === "image") {
        const img = new Image();
        img.src = lastMove.img.base64;
        img.addEventListener("load", () => drawMove(lastMove, img));
      } else drawMove(lastMove);
    }

    return () => {
      prevMovesLength = sortedMoves.length;
    };
  }, [sortedMoves]);

  const handleUndo = () => {
    if (ctx) {
      const move = handleRemoveMyMove();
      if (move?.options.mode == "select") clearSelection();
      else if (move) {
        addSavedMove(move);
        socket.emit("undo");
      }
    }
  };

  const handleRedo = () => {
    if (ctx) {
      const move = removeSavedMove();

      if (move) {
        socket.emit("draw", move);
      }
    }
  };

  useEffect(() => {
    const handleUndoRedoKeyboard = (e: KeyboardEvent) => {
      if (e.key === "z" && e.ctrlKey) {
        handleUndo();
      } else if (e.key === "y" && e.ctrlKey) {
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleUndoRedoKeyboard);

    return () => {
      document.removeEventListener("keydown", handleUndoRedoKeyboard);
    };
  }, [handleUndo, handleRedo]);

  return { drawAllMoves, drawMove, handleUndo, handleRedo };
};
