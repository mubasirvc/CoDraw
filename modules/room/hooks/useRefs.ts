import { useContext } from "react";
import { roomContext } from "../context/Room.context";

export const useRefs = () => {
  const { undoRef, redoRef, canvasRef, miniMapRef, selectionRefs } = useContext(roomContext);

  return {
    undoRef,
    redoRef,
    canvasRef,
    miniMapRef,
    selectionRefs,
  }
};
