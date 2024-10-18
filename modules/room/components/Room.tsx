import React, { useEffect } from 'react'
import RoomContextProvider from '../context/Room.context'
import Canvas from './Canvas'
import MousePosition from './MousePosition'
import MouseRender from './MouseRender'
import Toolbar from './Toolbar'
import { useRoom, useRoomId, useSetRoomId } from '@/common/recoil/room'
import { useRouter } from 'next/router'
import { socket } from '@/common/lib/socket'

const Room = () => {
  const roomId = useRoomId()
  const room = useRoom()
  const setRoomId = useSetRoomId()
  const router = useRouter()

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, isFailed?: boolean) => {
      if (isFailed) router.push("/")
      else setRoomId(roomIdFromServer)
    }

    socket.on("joined", handleJoined)

    return () => {
      socket.off("joined", handleJoined)
    }
  }, [router, setRoomId])

  if (!room.id) {
    const dynamicRoomId = router.query.rooomId?.toString()
    if (dynamicRoomId) socket.emit("join_room", dynamicRoomId)
    return <p>No room Id</p>
  }
  
  return (
    <RoomContextProvider>
      <div className='relative h-full w-full overflow-hidden'>
        <Toolbar />
        <Canvas />
        <MousePosition />
        <MouseRender />
      </div>
    </RoomContextProvider>
  )
}

export default Room
