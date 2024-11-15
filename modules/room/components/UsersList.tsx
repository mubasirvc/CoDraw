import { useRoom } from '@/common/redux/room'
import React from 'react'

const UsersList = () => {
  const { users } = useRoom()
  return (
    <div className='pointer-events-none absolute z-30 flex p-5'>
      {[...users.keys()].map((userId, i) => {
        return (
          <div
            key={userId}
            className='flex h-8 w-8 select-none items-center justify-center rounded-full text-white'
            style={{
              backgroundColor: users.get(userId)?.color || "black",
              marginLeft: i !== 0 ? "-0.5rem" : 0
            }}
          >
            {users.get(userId)?.name[0] || "A"}
          </div>
        )
      })}

    </div>
  )
}

export default UsersList
