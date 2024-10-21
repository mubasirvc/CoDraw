import React from 'react'
import ColorPicker from './ColorPicker'
import LineWidthPicker from './LineWidthPicker'
import { BsFillChatFill, BsFillImageFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineDownload } from 'react-icons/hi'

const Toolbar = () => {
  return (
    <div 
    className="absolute left-10 mt-56  z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white 2xl:grid-cols-1"
    style={{ transform: "translateY(-50%" }}
    >
      <ColorPicker />
      <LineWidthPicker />
      <button className='text-xl'>
        <BsFillChatFill />
      </button>
      <button className='text-xl'>
        <BsFillImageFill />
      </button>
      <button className='text-xl'>
        <BsThreeDots />
      </button>
      <button className='text-xl'>
        <HiOutlineDownload />
      </button>
      <button className='text-xl'>
        <BsFillChatFill />
      </button>
    </div>
  )
}

export default Toolbar
