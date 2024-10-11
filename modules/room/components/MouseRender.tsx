import { socket } from '@/common/lib/socket';
import React, { useEffect, useState } from 'react'
import SocketMouse from './SocketMouse';

const MouseRender = () => {
  const [mouse, setMouse] = useState<string[]>([])
  console.log(mouse, 'mouse');

  useEffect(() => {
    socket.on("users_in_room", (socketIds) => {
      const allUsers = socketIds.filter(id => id !== socket.id)
      setMouse(allUsers)
    })

    return () => {
      socket.off("users_in_room")
    }
  }, [])

  return (
    <>
      {mouse.map((socketId) => {
        return <SocketMouse socketId={socketId} key={socketId} />
      })}
    </>
  )
}

export default MouseRender
