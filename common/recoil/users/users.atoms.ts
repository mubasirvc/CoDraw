import { Move } from "@/common/types/socketTypes";
import { atom, selector } from "recoil";

export const usersAtom = atom<{ [key: string]: Move[] }>({
  key: "users",
  default: {},
});

export const userIds = selector({
  key: "usersIds",
  get: ({ get }) => {
    const users = get(usersAtom);
    return Object.keys(users);
  },
});
