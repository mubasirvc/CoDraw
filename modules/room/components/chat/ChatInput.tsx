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
        className='w-full rounded-s-xl border border-zinc-300 p-5 py-1 h-10'
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button className='h-full w-10 border-2 border-l-0 rounded-r-xl' type='submit'>
        <FiSend className='pl-2 text-2xl'/>
      </button>
    </form>
  )
}

export default ChatInput
