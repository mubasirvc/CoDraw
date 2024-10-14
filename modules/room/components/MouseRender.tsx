import React from 'react'
import UserMouse from './UserMouse';
import { useUserIds } from '@/common/recoil/users';

const MouseRender = () => {
  const userIds = useUserIds()

  return (
    <>
      {userIds.map((userId) => {
        return <UserMouse userId={userId} key={userId} />
      })}
    </>
  )
}

export default MouseRender
