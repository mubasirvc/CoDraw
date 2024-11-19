import { socket } from '@/common/lib/socket'
import React, { FormEvent, useState } from 'react'
import { FiSend } from "react-icons/fi";

const ChatInput = () => {
  const [msg, setMsg] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket.emit("send_msg", msg)
    setMsg('')
  }

  return (
    <form className='flex w-full items-center' onSubmit={handleSubmit}>
      <input
        className="w-full rounded-s-xl text-[#D4D4D4] bg-[#3C3C3C] p-5 py-1 h-10 border border-transparent focus:border-[#D4D4D4] outline-none transition-colors duration-200"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button
        className="flex justify-center items-center text-[#D4D4D4] h-full w-12 border-l border-gray-600 bg-[#3C3C3C] rounded-r-xl transition-colors duration-200 hover:bg-[#505050] hover:text-white"
        type="submit"
      >
        <FiSend className="text-md transition-transform duration-200 hover:scale-110" />
      </button>

    </form>
  )
}

export default ChatInput
