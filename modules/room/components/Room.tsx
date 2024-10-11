import React from 'react'
import RoomContextProvider from '../context/Room.context'
import Canvas from './Canvas'
import MousePosition from './MousePosition'
import MouseRender from './MouseRender'

const Room = () => {
  return (
    <RoomContextProvider>
      <div className='relative h-full w-full overflow-hidden'>
        <Canvas/>
        <MousePosition />
        <MouseRender />
      </div>
    </RoomContextProvider>
  )
}

export default Room
