import { socket } from '@/common/lib/socket'
import { useSetRoomId } from '@/common/recoil/room'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'

const NameInput = () => {
  const [name, setName] = useState('')
  const setAtomRoomId = useSetRoomId()
  const router = useRouter()
  const roomId = (router.query.roomId || "").toString()

  useEffect(() => {
    if (!roomId) return

    socket.emit("check_room", roomId)

    socket.on("room_exists", exists => {
      console.log(exists, 'room exists');

      if (exists) router.push('/')

    })

    return () => {
      socket.off("room_exists")
    }
  }, [roomId, router])

  useEffect(() => {
    const handlelJoinedRoom = (roomId: string, isFailed?: boolean) => {
      if (isFailed) router.push("/")
      else setAtomRoomId(roomId)
    }

    socket.on("joined", handlelJoinedRoom)

    return () => {
      socket.off("joined", handlelJoinedRoom)
    }

  }, [router, setAtomRoomId])

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket.emit("join_room", roomId, name)
  }

  return (
    <form onSubmit={handleJoinRoom} className='flex flex-col items-center'>
      <h1 className='mt-24 text-xl font-extrabold leading-tight'>
        CoDraw
      </h1>
      <h3 className='text-2xl'> Real time whiteboard</h3>
      <div className='mt-10 flex flex-col gap-2'>
        <label htmlFor="name" className='self-start font-bold leading-tight'>
          Enter name
        </label>
        <input
          className='rounded-xl border p-5 py-1'
          id='name'
          placeholder='Enter name'
          value={name}
          onChange={(e) => setName(e.target.value?.slice(0, 15))}
          type="text"
        />
      </div>
      <button type='submit'> Enter room</button>
    </form>
  )
}

export default NameInput
