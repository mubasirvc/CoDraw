import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { optionsAtom } from "./options.atoms";

// export const useOptions = () => {
//   const options = useRecoilValue(optionsAtom);

//   return options;
// };

// export const useSetOptions = () => {
//   const setOptions = useRecoilState(optionsAtom);

//   return setOptions
// };

export const useOptionsValue = () => {
  const options = useRecoilValue(optionsAtom);

  return options;
};

export const useSetOptions = () => {
  const setOptions = useSetRecoilState(optionsAtom);

  return setOptions;
};

export const useOptions = () => {
  const options = useRecoilState(optionsAtom);

  return options;
};
