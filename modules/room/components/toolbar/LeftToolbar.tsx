import { FaRedo, FaUndo } from "react-icons/fa";
import { useRefs } from "../../hooks/useRefs";
import ImageChoser from "./ImageChoser";
import { useMyMoves } from "@/common/redux/room";
import { useSavedMoves } from "@/common/redux/savedMoves/savedMoves.hooks";

const LeftToolbar = () => {
  const { redoRef, undoRef } = useRefs();

  const { myMoves } = useMyMoves();
  const savedMoves = useSavedMoves();

  return (
    <div className="flex gap-2 text-white ">
      <button
        className={`${!savedMoves.length && 'opacity-40'} text-lg rounded-full bg-[#333333] p-2 w-10 h-10 flex justify-center items-center`}
        ref={redoRef}
        disabled={!savedMoves.length}
      >
        <FaRedo />
      </button>
      <button
        className={`${!myMoves.length && 'opacity-40'} text-lg rounded-full bg-[#333333] p-2 w-10 h-10 flex justify-center items-center`}
        ref={undoRef}
        disabled={!myMoves.length}
      >
        <FaUndo />
      </button>
      <ImageChoser />
    </div>
  );
};

export default LeftToolbar;