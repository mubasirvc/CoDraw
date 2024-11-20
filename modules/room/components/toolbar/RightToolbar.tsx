import { CANVAS_SIZE } from '@/common/constants'
import React from 'react'
import { HiOutlineDownload } from 'react-icons/hi'
import { ImExit } from 'react-icons/im'
import { IoIosShareAlt } from 'react-icons/io'
import { useRefs } from '../../hooks/useRefs'
import Router from 'next/router'
import Tooltip from './Tooltip'

const RightToolbar = () => {
  const { canvasRef } = useRefs()

  const handleExit = () => Router.push("/");

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext("2d");

    if (tempCtx && canvasRef.current) {
      tempCtx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click();
  };

  return (
    <div className='flex gap-2'>
      <Tooltip title="share">
        <button
          className="w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full" onClick={() => { }}
        >
          <IoIosShareAlt />
        </button>
      </Tooltip>
      <Tooltip title="download">
        <button
          className="w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full " onClick={handleDownload}
        >
          <HiOutlineDownload />
        </button>
      </Tooltip>
      <Tooltip title="exit">
        <button
          className="w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full " onClick={handleExit}
        >
          <ImExit />
        </button>
      </Tooltip>
    </div>
  )
}

export default RightToolbar
