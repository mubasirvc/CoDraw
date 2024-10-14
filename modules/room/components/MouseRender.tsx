import { socket } from '@/common/lib/socket';
import React, { useEffect, useState } from 'react'
import SocketMouse from './SocketMouse';
import { useUserIds } from '@/common/recoil/users';

const MouseRender = () => {
  const userIds = useUserIds()

  return (
    <>
      {userIds.map((userId) => {
        return <SocketMouse userId={userId} key={userId} />
      })}
    </>
  )
}

export default MouseRender
