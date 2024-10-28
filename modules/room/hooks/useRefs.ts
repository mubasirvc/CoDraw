import { useContext } from "react";
import { roomContext } from "../context/Room.context";

export const useRefs = () => {
  const { undoRef, canvasRef, miniMapRef } = useContext(roomContext);

  return {
    undoRef,
    canvasRef,
    miniMapRef,
  }
};
