import { socket } from "@/common/lib/socket";
import { useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";
import usersAtom, { useUserIds } from "@/common/recoil/users";
import { Move } from "@/common/types/socketTypes";
import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, ReactNode, useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const roomContext = createContext<{
  x: MotionValue<number>
  y: MotionValue<number>
}>(null!)

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const setRoom = useSetRoom()
  const { handleAddUser, handleRemoveUser } = useSetUsers()
  // const setUsers = useSetRecoilState(usersAtom)
  // const usersIds = useUserIds()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    socket.on("room", (room, usersToParse) => {
      const users = new Map<string, Move[]>(JSON.parse(usersToParse))

      setRoom(prev => ({
        ...prev,
        users,
        movesWithoutUser: room.drawed,
      }))
    })

    socket.on("new_user", newUser => handleAddUser(newUser))

    socket.on("user_disconnected", userId => handleRemoveUser(userId))

    return () => {
      socket.off("room")
      socket.off("user_disconnected")
      socket.off("new_user")
    }
  }, [handleRemoveUser, handleAddUser, setRoom])

  return (
    <roomContext.Provider value={{ x, y }}>{children} </roomContext.Provider>
  )
}

export default RoomContextProvider