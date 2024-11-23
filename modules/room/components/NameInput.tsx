import { socket } from '@/common/lib/socket'
import { useSetRoomId } from '@/common/redux/room'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const NameInput = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const setAtomRoomId = useSetRoomId()
  const router = useRouter()
  const roomId = (router.query.roomId || "").toString()

  useEffect(() => {
    if (!roomId) return

    socket.emit("check_room", roomId)

    socket.on("room_exists", exists => {
      console.log(exists, 'room exists');

      if (!exists) {
        toast.error(`Room doesnt exist!`, {
          position: "top-center",
          theme: 'dark',
          className: "text-sm",
        })
        router.push("/")
      }
    })

    return () => {
      socket.off("room_exists")
    }
  }, [roomId, router])

  useEffect(() => {
    const handlelJoinedRoom = (roomId: string, isFailed?: boolean) => {
      if (isFailed) {
        toast.error(`Room doesnt exist!`, {
          position: "top-center",
          theme: 'dark',
          className: "text-sm",
        })
        router.push("/")
      }

      else setAtomRoomId(roomId)
    }

    socket.on("joined", handlelJoinedRoom)

    return () => {
      socket.off("joined", handlelJoinedRoom)
    }

  }, [router, setAtomRoomId])

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    socket.emit("join_room", roomId, name)
  }

  return (
    <div
      className="relative flex flex-1 h-screen w-full flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-r from-blue-50/50 via-indigo-50 to-blue-50/50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 overflow-hidden"
    >
      <form onSubmit={handleJoinRoom} className='flex justify-center items-center my-auto'>
        <div className="bg-white w-96 pb-10  rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="mt-5">
              <div>
                <div className="grid gap-y-4">
                  <div>
                    <div className="relative">
                      <label htmlFor="username" className="block text-start text-sm font-bold ml-1 mb-2 dark:text-white">Username</label>
                      <input
                        onChange={(e) => setName(e.target.value?.slice(0, 15))}
                        placeholder='Enter username'
                        type="text"
                        id="username"
                        name="username"
                        value={name}
                        className="py-2 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      />
                    </div>
                  </div>
                  {loading ? <p className='text-white ml-3 text-sm flex items-center'>Creating new room...</p> : (
                    <button
                      type="submit"
                      className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                      Join room
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NameInput
