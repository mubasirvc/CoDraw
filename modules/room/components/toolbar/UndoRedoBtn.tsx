import { FaRedo, FaUndo } from "react-icons/fa";

import { useMyMoves } from "@/common/recoil/room";

import { useRefs } from "../../hooks/useRefs";
import { useSavedMoves } from "@/common/recoil/savedMoves/savedMoves.hooks";

const UndoRedoBtn = () => {
  const { redoRef, undoRef } = useRefs();

  const { myMoves } = useMyMoves();
  const savedMoves = useSavedMoves();
console.log(savedMoves.length, myMoves.length, 'mymovvv');

  return (
    <>
      <button
        className="text-xl"
        ref={redoRef}
        disabled={!savedMoves.length}
      >
        <FaRedo />
      </button>
      <button
        className="text-xl"
        ref={undoRef}
        disabled={!myMoves.length}
      >
        <FaUndo />
      </button>
    </>
  );
};

export default UndoRedoBtn;