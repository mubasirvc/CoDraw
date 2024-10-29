import { socket } from '@/common/lib/socket'
import React, { FormEvent, useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'

const ChatInput = () => {
  const [msg, setMsg] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket.emit("send_msg", msg)
    setMsg('')
  }

  return (
    <form className='flex w-full items-center gap-1' onSubmit={handleSubmit}>
      <input
        className='w-full rounded-xl border border-zinc-300 p-5 py-1'
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button className='h-full w-10 bg-black' type='submit'>
        <AiOutlineSend />
      </button>
    </form>
  )
}

export default ChatInput