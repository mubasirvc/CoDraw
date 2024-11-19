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
        data-tooltip-target="tooltip-bottom" data-tooltip-placement="bottom"
        className={`${!savedMoves.length && 'opacity-40'}  w-10 h-10 flex justify-center items-center `}
        ref={redoRef}
        disabled={!savedMoves.length}
      >
        <LuRedo />
      </button>
      <div id="tooltip-bottom" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        redo
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>

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