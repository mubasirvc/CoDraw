import React from 'react'
import UserMouse from './UserMouse';
import { useRoom } from '@/common/recoil/room';
import { socket } from '@/common/lib/socket';

const MouseRender = () => {
  const room = useRoom()

  return (
    <>
      {[...room?.users?.keys()].map((userId) => {
        if (userId === socket.id) return null
        return (
          <UserMouse
            userId={userId}
            key={userId}
            username={room.users.get(userId) || "Anonymouse"}
          />)
      })}
    </>
  )
}

export default MouseRender
