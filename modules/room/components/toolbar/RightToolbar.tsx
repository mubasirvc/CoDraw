import { CANVAS_SIZE } from '@/common/constants'
import React from 'react'
import { HiOutlineDownload } from 'react-icons/hi'
import { ImExit } from 'react-icons/im'
import { IoIosShareAlt } from 'react-icons/io'
import { useRefs } from '../../hooks/useRefs'
import Router from 'next/router'

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
    <div className='flex'>
      <button
        className="w-10 h-10 flex justify-center items-center " onClick={() => { }}
      >
        <IoIosShareAlt />
      </button>
      <button
        className="w-10 h-10 flex justify-center items-center " onClick={handleDownload}
      >
        <HiOutlineDownload />
      </button>
      <button
        className="w-10 h-10 flex justify-center items-center " onClick={handleExit}
      >
        <ImExit />
      </button>
    </div>
  )
}

export default RightToolbar
