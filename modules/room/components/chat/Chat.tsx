import { socket } from '@/common/lib/socket'
import { useRoom } from '@/common/recoil/room'
import { Message } from '@/common/types/socketTypes'
import React, { use, useEffect, useRef, useState } from 'react'
import { useList } from 'react-use'
import { motion } from "framer-motion";
import { BsFillChatFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { DEFAULT_EASE } from '@/common/constants'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput' 

const Chat = () => {
  const { users } = useRoom()
  const msgListRef = useRef<HTMLDivElement>(null)

  const [newMsg, setNewMsg] = useState(false)
  const [opened, setOpened] = useState(false)
  const [msgs, setMsgs] = useList<Message>([])

  useEffect(() => {
    const handleNewMsg = (userId: string, msg: string) => {
      const user = users.get(userId)

      setMsgs.push({
        userId,
        msg,
        id: msgs.length + 1,
        username: user?.name || "Anonymous",
        color: user?.color || "#000"
      })

      msgListRef.current?.scroll({ top: msgListRef.current?.scrollHeight })

      if (!opened) setNewMsg(true)
    }

    socket.on("new_msg", handleNewMsg)

    return () => {
      socket.off("new_msg", handleNewMsg)
    }
  }, [setMsgs, msgs, opened, users])

  return (
    <motion.div
      className="absolute bottom-0 z-50 flex h-[300px] w-full flex-col overflow-hidden rounded-t-md sm:left-36 sm:w-[30rem]"
      animate={{ y: opened ? 0 : 260 }}
      transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
    >
      <button
        className="flex w-full cursor-pointer items-center justify-between bg-zinc-900 py-2 px-10 font-semibold text-white"
        onClick={() => {
          setOpened((prev) => !prev);
          setNewMsg(false);
        }}
      >
        <div className="flex items-center gap-2">
          <BsFillChatFill className="mt-[-2px]" />
          Chat
          {newMsg && (
            <p className="rounded-md bg-green-500 px-1 font-semibold text-green-900">
              New!
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: opened ? 0 : 180 }}
          transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.div>
      </button>
      <div className="flex flex-1 flex-col justify-between bg-white p-3">
        <div className="h-[190px] overflow-y-scroll pr-2" ref={msgListRef}>
          {msgs.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
        </div>
        <ChatInput />
      </div>
    </motion.div>
  )
}

export default Chat
