import { useRefs } from "../../hooks/useRefs";
import ImageChoser from "./ImageChoser";
import { useMyMoves } from "@/common/redux/room";
import { useSavedMoves } from "@/common/redux/savedMoves/savedMoves.hooks";
import { LuRedo, LuUndo } from "react-icons/lu";
import Tooltip from "./Tooltip";

const UndoRedoBtn = () => {
  const { redoRef, undoRef } = useRefs();

  const { myMoves } = useMyMoves();
  const savedMoves = useSavedMoves();

  return (
    <div className="flex ">
      <Tooltip title="redo">
        <button
          className={`${!savedMoves.length ? 'opacity-40' : ''
            } w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full`}
          ref={redoRef}
          disabled={!savedMoves.length}
        >
          <LuRedo />
        </button>
      </Tooltip>

      <Tooltip title="undo">
        <button
          className={`${!myMoves.length && 'opacity-40'} w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full`}
          ref={undoRef}
          disabled={!myMoves.length}
        >
          <LuUndo />
        </button>
      </Tooltip>
    </div>
  );
};

export default UndoRedoBtn;