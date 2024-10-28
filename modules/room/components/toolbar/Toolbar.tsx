import React, { RefObject } from 'react'
import ColorPicker from './ColorPicker'
import LineWidthPicker from './LineWidthPicker'
import { BsFillChatFill, BsFillImageFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineDownload } from 'react-icons/hi'
import Eraser from './Eraser'
import { FaUndo } from 'react-icons/fa'
import ShapeSelector from './ShapeSelector'
import { useRefs } from '../../hooks/useRefs'
import Router from 'next/router'
import { CANVAS_SIZE } from '@/common/constants'
import { ImExit } from "react-icons/im";
import ImageChoser from './ImageChoser'

const Toolbar = () => {
  const { undoRef, canvasRef } = useRefs()

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
    <div
      className="absolute left-10 mt-56  z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white 2xl:grid-cols-1"
      style={{ transform: "translateY(-50%" }}
    >
      <button className='text-xl' ref={undoRef}>
        <FaUndo />
      </button>
      <div className='h-px w-full bg-white' />
      <ColorPicker />
      <ShapeSelector />
      <LineWidthPicker />
      <Eraser />
      <ImageChoser />
      <button className='text-xl'>
        <BsThreeDots />
      </button>
      <button className='text-xl'>
        <BsFillChatFill />
      </button>
      <button className="btn-icon text-2xl" onClick={handleDownload}>
        <HiOutlineDownload />
      </button>
      <button className="btn-icon text-xl" onClick={handleExit}>
          <ImExit />
        </button>
    </div>
  )
}

export default Toolbar
