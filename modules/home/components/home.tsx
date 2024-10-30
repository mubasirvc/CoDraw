import { socket } from '@/common/lib/socket'
import { useSetRoomId } from '@/common/recoil/room'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'

const Home = () => {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const setAtomRoomId = useSetRoomId()

  const router = useRouter()

  useEffect(() => {
    socket.on("created", (roomId) => {
      setAtomRoomId(roomId)
      router.push(roomId)
    })

    const handlelJoinedRoom = (roomId: string, isFailed?: boolean) => {
      if (!isFailed) {
        setAtomRoomId(roomId)
        router.push(roomId)
      }
      //handle modal for room not found
      else console.log('failed to  join room');
    }

    socket.on("joined", handlelJoinedRoom)

    return () => {
      socket.off("created")
      socket.off("joined", handlelJoinedRoom)
    }
  }, [router, setAtomRoomId, router, roomId])
  
  useEffect(() => {
    socket.emit("leave_room")
    setAtomRoomId("")
  }, [setAtomRoomId])

  const handleCreateRoom = () => {
    socket.emit("create_room", username)
  }

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(roomId) socket.emit("join_room", roomId, username)
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='mt-24 text-xl font-extrabold leading-tight'>
        CoDraw
      </h1>
      <h3 className='text-2xl'> Real time whiteboard</h3>
      <div className='mt-10 flex flex-col gap-2'>
        <label htmlFor="username" className='self-start font-bold leading-tight'>
          Enter Username
        </label>
        <input
          className='rounded-xl border p-5 py-1'
          id='username'
          placeholder='Enter username'
          value={username}
          onChange={(e) => setUsername(e.target.value.slice(0, 15))}
          type="text"
        />
      </div>

      <form className='flex flex-col items-center gap-3'
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
      <p className='my-3'>or</p>
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
