import { socket } from '@/common/lib/socket'
import { Message } from '@/common/types/socketTypes'
import React from 'react'

const ChatMessage = ({ userId, msg, username, color }: Message) => {
  const me = socket.id === userId

  return (
    <div className={`text-[#D4D4D4] my-2 gap-2 flex text-clip ${me && 'justify-end text-right'}`}>
      {!me && (
        <div>
          <div className='rounded-full bg-[#3C3C3C] w-7 h-7 flex justify-center items-center'>
            <p style={{ color }} className=' text-sm mb-1'>
              {username[0]}
            </p>
          </div>
        </div>
      )}
      <p className={`${me ? 'bg-[#3C3C3C] ml-5' : 'border bg-[#D4D4D4] text-[#000] mr-3'} text-xs px-2 p-1 rounded-xl`} style={{ wordBreak: 'break-all' }}>{msg}</p>
    </div>
  )
}

export default ChatMessage
