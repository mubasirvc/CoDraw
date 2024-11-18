import { useRefs } from "../../hooks/useRefs";
import ImageChoser from "./ImageChoser";
import { useMyMoves } from "@/common/redux/room";
import { useSavedMoves } from "@/common/redux/savedMoves/savedMoves.hooks";
import { LuRedo, LuUndo } from "react-icons/lu";

const UndoRedoBtn = () => {
  const { redoRef, undoRef } = useRefs();

  const { myMoves } = useMyMoves();
  const savedMoves = useSavedMoves();

  return (
    <div className="flex text-white ">
      <button
        className={`${!savedMoves.length && 'opacity-40'}  w-10 h-10 flex justify-center items-center`}
        ref={redoRef}
        disabled={!savedMoves.length}
      >
        <LuRedo />
      </button>
      <button
        className={`${!myMoves.length && 'opacity-40'} w-10 h-10 flex justify-center items-center`}
        ref={undoRef}
        disabled={!myMoves.length}
      >
        <LuUndo />
      </button>
    </div>
  );
};

export default UndoRedoBtn;