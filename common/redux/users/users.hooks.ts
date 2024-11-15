import { useSelector } from "react-redux";
import { selectUsers, selectUserIds } from "./users.slice";
import { RootState } from "../store";

export const useUserIds = () => {
  return useSelector((state: RootState) => selectUserIds(state));
};

export const useUsers = () => {
  return useSelector((state: RootState) => selectUsers(state));
};
