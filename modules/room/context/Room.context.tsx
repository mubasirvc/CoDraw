import { COLORS_ARRAY } from "@/common/constants";
import { socket } from "@/common/lib/socket";
import { useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";
import usersAtom, { useUserIds } from "@/common/recoil/users";
import { Move, User } from "@/common/types/socketTypes";
import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, ReactNode, RefObject, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";

export const roomContext = createContext<{
  x: MotionValue<number>
  y: MotionValue<number>
  undoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}>(null!)

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const setRoom = useSetRoom()
  const { handleAddUser, handleRemoveUser } = useSetUsers()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const undoRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    socket.on("room", (room, usersMovesoParse, usersToParse) => {
      const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesoParse))
      const parsedUsers = new Map<string, string>(JSON.parse(usersToParse))

      const users = new Map<string, User>();

      parsedUsers.forEach((name, id) => {
        if (id === socket.id) return

        const index = [...parsedUsers.keys()].indexOf(id)
        const color = COLORS_ARRAY[index % COLORS_ARRAY.length]

        users.set(id, {
          name, color
        })
      })

      setRoom(prev => ({
        ...prev,
        users,
        usersMoves,
        movesWithoutUser: room.drawed,
      }))
    })

    socket.on("new_user", (userId, username) => handleAddUser(userId, username))

    socket.on("user_disconnected", userId => handleRemoveUser(userId))

    return () => {
      socket.off("room")
      socket.off("user_disconnected")
      socket.off("new_user")
    }
  }, [handleRemoveUser, handleAddUser, setRoom])

  return (
    <roomContext.Provider value={{ x, y, undoRef, canvasRef }}>{children} </roomContext.Provider>
  )
}

export default RoomContextProvider