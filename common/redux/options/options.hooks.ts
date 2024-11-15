import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setOptions, setSelection, clearSelection } from "./options.slice";
import { CtxOptions } from "@/common/types/socketTypes";

// Get the current options value
export const useOptionsValue = () => {
  return useSelector((state: RootState) => state.options);
};

// Set new options
export const useSetOptions = () => {
  const dispatch = useDispatch();
  return (options: CtxOptions) => dispatch(setOptions(options));
};

// Get options and setter together
export const useOptions = (): [CtxOptions, (options: CtxOptions) => void] => {
  const options = useOptionsValue();
  const setOptionsHandler = useSetOptions();
  return [options, setOptionsHandler];
};

// Manage selection state (set and clear)
export const useSetSelection = () => {
  const dispatch = useDispatch();

  const setSelectionHandler = (rect: { x: number; y: number; width: number; height: number }) => {
    dispatch(setSelection(rect));
  };

  const clearSelectionHandler = () => {
    dispatch(clearSelection());
  };

  return { setSelection: setSelectionHandler, clearSelection: clearSelectionHandler };
};
