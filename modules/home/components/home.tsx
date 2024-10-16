import { socket } from '@/common/lib/socket'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'

const Home = () => {
  const [roomId, setRoomId] = useState('')

  const router = useRouter()

  useEffect(() => {
    socket.on("created", (roomId) => {
      router.push(roomId)
    })

    socket.on("joined", (roomId, isFailed) => {
      if (!isFailed) router.push(roomId)
      else console.log('failed to  join room');
    })

    return () => {
      socket.off("created")
      socket.off("joined")
    }

  }, [router])

  const handleCreateRoom = () => {
    socket.emit("create_room")
  }

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket.emit("join_room", roomId)
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='mt-24 text-xl font-extrabold leading-tight'>
        CoDraw
      </h1>
      <h3 className='text-2xl'> Real time whiteboard</h3>

      <form className='mt-8 flex flex-col items-center gap-2'
        onSubmit={handleJoinRoom}>
        <label htmlFor="room-id" className='self-start font-bold leading-tight'>
          Enter room id
        </label>
        <input
          className='rounded-xl border p-5 py-1'
          id='root-id'
          placeholder='Enter room id'
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
        />
        <button type='submit'> Join</button>
      </form>
      <div className='mt-8 flex flex-col items-center gap-2'>
        <h5 className='self-start font-bold leading-tight '>
          Create new room
        </h5>
        <button onClick={handleCreateRoom}> Create room</button>
      </div>
    </div>
  )
}

export default Home
