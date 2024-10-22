import React from 'react'
import RoomContextProvider from '../context/Room.context'
import Canvas from './Canvas'
import MousePosition from './MousePosition'
import MouseRender from './MouseRender'
import { useRoom } from '@/common/recoil/room'
import Toolbar from './toolbar/Toolbar'
import NameInput from './NameInput'
import UsersList from './UsersList'

const Room = () => {
  const room = useRoom()

  if (!room.id) return <NameInput />

  return (
    <RoomContextProvider>
      <div className='relative h-full w-full overflow-hidden'>
        <UsersList />
        <Toolbar />
        <Canvas />
        <MousePosition />
        <MouseRender />
      </div>
    </RoomContextProvider>
  )
}

export default Room
