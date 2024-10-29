import React from 'react'
import ColorPicker from './ColorPicker'
import LineWidthPicker from './LineWidthPicker'
import { HiOutlineDownload } from 'react-icons/hi'
import ShapeSelector from './ShapeSelector'
import { useRefs } from '../../hooks/useRefs'
import Router from 'next/router'
import { CANVAS_SIZE } from '@/common/constants'
import { ImExit } from "react-icons/im";
import ImageChoser from './ImageChoser'
import UndoRedoBtn from './UndoRedoBtn'
import ModePicker from './ModePicker'

const Toolbar = () => {
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
    <div
      className="absolute left-10 mt-56  z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white 2xl:grid-cols-1"
      style={{ transform: "translateY(-50%" }}
    >
      <UndoRedoBtn />
      <div className='h-px w-full bg-white' />
      <ColorPicker />
      <ShapeSelector />
      <LineWidthPicker />
      <ModePicker />
      <ImageChoser />
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
