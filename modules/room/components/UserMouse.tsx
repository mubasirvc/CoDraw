import React, { useEffect, useState } from 'react'
import { useBoardPosition } from '../hooks/useBoardPosition'
import { socket } from '@/common/lib/socket'
import { motion } from 'framer-motion'
import { BsCursorFill } from 'react-icons/bs'

const UserMouse = ({ userId, username }: { userId: string, username: string }) => {
  const boardPos = useBoardPosition()
  const [x, setX] = useState(boardPos.x.get())
  const [y, setY] = useState(boardPos.y.get())
  const [pos, setPos] = useState({ x: -1, y: -1 })

  useEffect(() => {
    socket.on("mouse_moved", (newX, newY, userIdMoved) => {
      if (userIdMoved === userId) {
        setPos({ x: newX, y: newY })
      }
    })

    return () => {
      socket.off("mouse_moved")
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
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.1, ease: 'linear' }}
    >
      <BsCursorFill className='-rotate-90' />
      <p className='ml-2'>{username}</p>
    </motion.div>
  )
}

export default UserMouse
