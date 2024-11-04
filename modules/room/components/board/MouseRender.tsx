import React from 'react'
import UserMouse from './UserMouse';
import { socket } from '@/common/lib/socket';
import { useRoom } from '@/common/redux/room';

const MouseRender = () => {
  const { users } = useRoom()

  return (
    <>
      {[...users?.keys()].map((userId) => {
        if (userId === socket.id) return null
        return (
          <UserMouse
            userId={userId}
            key={userId}
          />)
      })}
    </>
  )
}

export default MouseRender
