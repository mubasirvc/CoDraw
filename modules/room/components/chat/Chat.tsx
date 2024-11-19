import { socket } from '@/common/lib/socket';
import { Message } from '@/common/types/socketTypes';
import React, { useEffect, useRef, useState } from 'react';
import { useList } from 'react-use';
import { motion } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";
import { DEFAULT_EASE } from '@/common/constants';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { MdOutlineMarkChatUnread, MdOutlineChatBubbleOutline } from "react-icons/md";
import { useRoom } from '@/common/redux/room';

const Chat = () => {
  const { users } = useRoom();
  const msgListRef = useRef<HTMLDivElement>(null);

  const [newMsg, setNewMsg] = useState(false);
  const [opened, setOpened] = useState(false);
  const [msgs, setMsgs] = useList<Message>([]);

  useEffect(() => {
    const handleNewMsg = (userId: string, msg: string) => {
      const user = users.get(userId);

      setMsgs.push({
        userId,
        msg,
        id: msgs.length + 1,
        username: user?.name || "Anonymous",
        color: user?.color || "#000"
      });

      msgListRef.current?.scroll({ top: msgListRef.current?.scrollHeight });

      if (!opened) setNewMsg(true);
    };

    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("new_msg", handleNewMsg);
    };
  }, [setMsgs, msgs, opened, users]);

  return (
    <motion.div
      className={`${opened ? 'h-[80%]' : 'h-14 w-14'} fixed right-5 bottom-2 z-50 flex flex-col overflow-hidden transition-all`}
      animate={{
        height: opened ? "80%" : "3.5rem",
        width: opened ? "25%" : "3.5rem",
        borderRadius: "0.5rem",
      }}
      transition={{ ease: DEFAULT_EASE, duration: 0.3 }}
    >
      <button
        className={`flex ${opened ? 'text-[#D4D4D4] justify-between w-full border-b-0' : 'justify-center'} cursor-pointer items-center gap-1 border border-[#3C3C3C] bg-[#252526] py-2 px-2 font-semibold text-white`}
        onClick={() => {
          setOpened((prev) => !prev);
          setNewMsg(false);
        }}
        style={{
          borderRadius: opened ? "0.5rem 0.5rem 0 0" : "0.5rem",
        }}
      >
        <motion.div
          animate={{ rotate: opened ? 180 : 0 }}
          transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
        >
          <FaChevronUp className='opacity-80 text-sm' />
        </motion.div>
        {opened && 'Chat'}
        {opened ? (
          <>
            <div className="flex items-center gap-2 text-2xl text-[#D4D4D4]">
              {newMsg ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                >
                  <MdOutlineMarkChatUnread className='text-green-400' />
                </motion.div>
              ) : (
                <MdOutlineChatBubbleOutline />
              )}
            </div>
          </>
        ) : (
          newMsg ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
            >
              <MdOutlineMarkChatUnread className='text-green-400 text-xl' />
            </motion.div>
          ) : (
            <MdOutlineChatBubbleOutline className='text-xl' />
          )
        )}
      </button>

      {opened && (
        <div className="flex flex-1 flex-col justify-between border border-[#3C3C3C] bg-[#252526] p-3 rounded-b-md">
          <div className={`flex-1 overflow-y-scroll pr-2`} ref={msgListRef}>
            {msgs.map((msg) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
          </div>
          <ChatInput />
        </div>
      )}
    </motion.div>
  );
};

export default Chat;
