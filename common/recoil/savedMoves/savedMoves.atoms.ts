import { Move } from "@/common/types/socketTypes";
import { atom } from "recoil";

export const savedMovesAtom = atom<Move[]>({
  key: "saved_moves",
  default: [],
});