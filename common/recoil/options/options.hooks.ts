import { useRecoilState, useRecoilValue } from "recoil";
import { optionsAtom } from "./options.atoms";

export const useOptions = () => {
  const options = useRecoilValue(optionsAtom);

  return options;
};

export const useSetOptions = () => {
  const setOptions = useRecoilState(optionsAtom);

  return setOptions
};
