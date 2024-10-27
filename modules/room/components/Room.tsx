import React from 'react'
import RoomContextProvider from '../context/Room.context'
import Canvas from './board/Canvas'
import MousePosition from './board/MousePosition'
import MouseRender from './board/MouseRender'
import { useRoom } from '@/common/recoil/room'
import Toolbar from './toolbar/Toolbar'
import NameInput from './NameInput'
import UsersList from './UsersList'
import Chat from './chat/Chat'

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
        <Chat />
      </div>
    </RoomContextProvider>
  )
}

export default Room
