import { COLORS_ARRAY } from "@/common/constants";
import { socket } from "@/common/lib/socket";
import { useRoom, useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";
import usersAtom, { useUserIds } from "@/common/recoil/users";
import { Move, User } from "@/common/types/socketTypes";
import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

export const roomContext = createContext<{
  x: MotionValue<number>
  y: MotionValue<number>
  undoRef: RefObject<HTMLButtonElement>;
  redoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  miniMapRef: RefObject<HTMLCanvasElement>;
  moveImage: string;
  setMoveImage: (base64: string) => void;
}>(null!)

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const setRoom = useSetRoom()
  const { users } = useRoom()
  const { handleAddUser, handleRemoveUser } = useSetUsers()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const undoRef = useRef<HTMLButtonElement>(null)
  const redoRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const miniMapRef = useRef<HTMLCanvasElement>(null)

  const [moveImage, setMoveImage] = useState('')

  useEffect(() => {
    socket.on("room", (room, usersMovesoParse, usersToParse) => {
      const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesoParse))
      const parsedUsers = new Map<string, string>(JSON.parse(usersToParse))

      const newUsers = new Map<string, User>();

      parsedUsers.forEach((name, id) => {
        if (id === socket.id) return

        const index = [...parsedUsers.keys()].indexOf(id)
        const color = COLORS_ARRAY[index % COLORS_ARRAY.length]

        newUsers.set(id, {
          name, color
        })
      })

      setRoom(prev => ({
        ...prev,
        users: newUsers,
        usersMoves,
        movesWithoutUser: room.drawed,
      }))
    })

    socket.on("new_user", (userId, username) => {
      toast.info(`${username} has joined the room`, {
        position: "top-center",
        theme: 'colored'
      })
      handleAddUser(userId, username)
    })

    socket.on("user_disconnected", userId => {
      toast.info(`${users.get(userId)?.name || "Annonymous"} has left the room`, {
        position: "top-center",
        theme: 'colored'
      })
      handleRemoveUser(userId)
    })

    return () => {
      socket.off("room")
      socket.off("user_disconnected")
      socket.off("new_user")
    }
  }, [handleRemoveUser, handleAddUser, setRoom, users])

  return (
    <roomContext.Provider value={{ x, y, undoRef, redoRef, canvasRef, miniMapRef, moveImage, setMoveImage }}>
      {children}
    </roomContext.Provider>
  )
}

export default RoomContextProvider