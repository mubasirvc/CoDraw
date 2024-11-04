import React from 'react'
import RoomContextProvider from '../context/Room.context'
import Canvas from './board/Canvas'
import MousePosition from './board/MousePosition'
import MouseRender from './board/MouseRender'
import NameInput from './NameInput'
import UsersList from './UsersList'
import Chat from './chat/Chat'
import MoveImage from './board/MoveImage'
import SelectionBtns from './board/SelctionBtns'
import Toolbar from './toolbar/Toolbar'
import { useRoom } from '@/common/redux/room'

const Room = () => {
  const room = useRoom()

  if (!room.id) return <NameInput />

  return (
    <RoomContextProvider>
      <div className='relative h-full w-full overflow-hidden'>
        <UsersList />
        {/* <Toolbar /> */}
        <Toolbar />
        <SelectionBtns />
        <MoveImage />
        <Canvas />
        <MousePosition />
        <MouseRender />
        <Chat />
      </div>
    </RoomContextProvider>
  )
}

export default Room
