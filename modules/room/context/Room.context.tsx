import { COLORS_ARRAY } from "@/common/constants";
import { socket } from "@/common/lib/socket";
import { useRoom, useSetRoom, useSetUsers } from "@/common/redux/room";
import { Move, User } from "@/common/types/socketTypes";
import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const roomContext = createContext<{
  x: MotionValue<number>
  y: MotionValue<number>
  undoRef: RefObject<HTMLButtonElement>;
  redoRef: RefObject<HTMLButtonElement>;
  selectionRefs: RefObject<HTMLButtonElement[]>;
  canvasRef: RefObject<HTMLCanvasElement>;
  miniMapRef: RefObject<HTMLCanvasElement>;
  moveImage: { base64: string; x?: number; y?: number; };
  setMoveImage: Dispatch<SetStateAction<{ base64: string; x?: number | undefined; y?: number | undefined; }>>
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
  const selectionRefs = useRef<HTMLButtonElement[]>([])

  const [moveImage, setMoveImage] = useState<{ base64: string; x?: number; y?: number; }>({ base64: '' })

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

      setRoom({
        users: newUsers,
        usersMoves,
        movesWithoutUser: room.drawed,
      });
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
    <roomContext.Provider value={{ x, y, undoRef, redoRef, canvasRef, miniMapRef, moveImage, setMoveImage, selectionRefs }}>
      {children}
    </roomContext.Provider>
  )
}

export default RoomContextProvider