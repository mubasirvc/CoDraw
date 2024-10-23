import React, { useEffect, useState } from 'react'
import { useBoardPosition } from '../../hooks/useBoardPosition' 
import { socket } from '@/common/lib/socket'
import { motion } from 'framer-motion'
import { BsCursorFill } from 'react-icons/bs'
import { useRoom } from '@/common/recoil/room'

const UserMouse = ({ userId }: { userId: string }) => {
  const boardPos = useBoardPosition()
  const { users } = useRoom()
  const user = users.get(userId)

  const [msg, setMsg] = useState('')
  const [x, setX] = useState(boardPos.x.get())
  const [y, setY] = useState(boardPos.y.get())
  const [pos, setPos] = useState({ x: -1, y: -1 })

  useEffect(() => {
    socket.on("mouse_moved", (newX, newY, userIdMoved) => {
      if (userIdMoved === userId) {
        setPos({ x: newX, y: newY })
      }
    })

    const handleNewMsg = (msgUserId: string, newMsg: string) => {
      if (msgUserId === userId) {
        setMsg(newMsg);

        setTimeout(() => {
          setMsg("");
        }, 3000);
      }
    };
    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("mouse_moved")
      socket.off("new_msg", handleNewMsg);
    }
  }, [userId])

  useEffect(() => {
    const unSubscribe = boardPos.x.on('change', setX)
    return unSubscribe
  }, [boardPos.x])

  useEffect(() => {
    const unSubscribe = boardPos.y.on('change', setY)
    return unSubscribe
  }, [boardPos.y])

  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-800 pointer-events-none ${pos.x === -1 && "hidden"}`}
      style={{ color: user?.color}}
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.2, ease: 'linear' }}
    >
      <BsCursorFill className='-rotate-90' />
      {msg && (
        <p className="absolute top-full left-5 max-h-20 max-w-[15rem] overflow-hidden text-ellipsis rounded-md bg-zinc-900 p-1 px-3 text-white">
          {msg}
        </p>
      )}
      <p className='ml-2'>{user?.name || 'Anonymous'}</p>
    </motion.div>
  )
}

export default UserMouse
