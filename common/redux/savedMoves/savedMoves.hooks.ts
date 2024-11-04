import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addMove, removeMove, clearMoves } from './savedMoves.slice';
import { Move } from "@/common/types/socketTypes";

export const useSavedMoves = () => {
  return useSelector((state: RootState) => state.savedMoves.savedMoves);
};

export const useSetSavedMoves = () => {
  const dispatch: AppDispatch = useDispatch();
  const savedMoves = useSelector((state: RootState) => state.savedMoves.savedMoves);

  const addSavedMove = (move: Move) => {
    if (move.options.mode === "select") return;
    dispatch(addMove(move));
  };

  const removeSavedMove = (): Move | null => {
    const move = savedMoves.length > 0 ? savedMoves[0] : null;
    dispatch(removeMove());
    return move;
  };

  const clearSavedMoves = () => {
    dispatch(clearMoves());
  };

  return { addSavedMove, removeSavedMove, clearSavedMoves };
};
