import { socket } from '@/common/lib/socket'
import { Message } from '@/common/types/socketTypes'
import React from 'react'

const ChatMessage = ({ userId, msg, username, color }: Message) => {
  const me = socket.id === userId

  return (
    <div className={`text-[#D4D4D4] my-2 flex gap-2 text-clip ${me && 'justify-end text-right'}`}>
      {!me && (
        <h5 style={{ color }} className='font-semibold rounded-full bg-[#3C3C3C] w-7 h-7 flex justify-center items-center'>
          {username[0]}
        </h5>
      )}
      <p style={{ wordBreak: 'break-all' }}>{msg}</p>
    </div>
  )
}

export default ChatMessage
