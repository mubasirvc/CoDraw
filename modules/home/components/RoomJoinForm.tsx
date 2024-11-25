import { FC, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { socket } from '@/common/lib/socket'

const RoomJoinForm = ({ roomIdError, setRoomIdError }: { roomIdError: string; setRoomIdError: (val: string) => void }) => {
  const [open, setOpen] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateRoom = () => {
    setLoading(true)
    socket.emit("create_room", username)
  }

  const handleJoinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRoomIdError('')

    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-orange-600 w-44 dark:bg-gray-800 rounded-xl text-white dark:text-gray-300 font-medium px-4 py-3 sm:mt-5 mt-4 hover:bg-orange-500 dark:hover:bg-gray-600 transition"
      >
        Get started
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white  rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
                <div className="p-4 sm:p-7">
                  <div className="mt-5">
                    <div>
                      <div className="grid gap-y-4">
                        <div>
                          <div className="relative">
                            <label htmlFor="username" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Username</label>
                            <input
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder='Enter username'
                              type="text"
                              id="username"
                              name="username"
                              value={username}
                              className="py-2 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="my-2  text-sm text-gray-600 dark:text-gray-400">
                            Want to to join an Existing room?
                          </p>
                          <div className="relative">
                            <label htmlFor="room-id" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Room id</label>
                            <input
                              onChange={(e) => { setRoomId(e.target.value), setRoomIdError('') }}
                              placeholder='Enter room id'
                              type="text"
                              id="room-id"
                              value={roomId}
                              name="room-id"
                              className="py-2 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            />
                          </div>
                          {roomIdError && <p className="text-xs text-red-600 mt-2">{roomIdError}</p>}
                        </div>

                        <div className='flex gap-2 justify-end'>
                          <button
                            type="button"
                            data-autofocus
                            onClick={() => setOpen(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            Cancel
                          </button>
                          {loading ? <p className='text-white ml-3 text-sm flex items-center'>Creating new room...</p> : (
                            <button
                              type="button"
                              onClick={(e) => roomId ? handleJoinRoom(e) : handleCreateRoom()}
                              className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div >
      </Dialog >
    </>
  )
}

export default RoomJoinForm