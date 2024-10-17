import React from 'react'
import RoomContextProvider from '../context/Room.context'
import Canvas from './Canvas'
import MousePosition from './MousePosition'
import MouseRender from './MouseRender'
import Toolbar from './Toolbar'
import { useRoomId } from '@/common/recoil/room'

const Room = () => {
  const roomId = useRoomId()

  if(!roomId) return <p>No room Id</p>
  return (
    <RoomContextProvider>
      <div className='relative h-full w-full overflow-hidden'>
        <Toolbar/>
        <Canvas/>
        <MousePosition />
        <MouseRender />
      </div>
    </RoomContextProvider>
  )
}

export default Room
