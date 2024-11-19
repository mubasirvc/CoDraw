import React from 'react'
import { LuRedo, LuUndo } from "react-icons/lu";
import UndoRedoBtn from './UndoRedoBtn';
import ColorPicker from './ColorPicker';
import LineWidthPicker from './LineWidthPicker';
import ShapeSelector from './ShapeSelector';
import ModeChoser from './ModeChoser';
import RightToolbar from './RightToolbar';
import ImageChoser from './ImageChoser';


const Toolbar = () => {
  return (
    <div className='flex justify-center'>
      <div className="top-1 fixed w-auto rounded-lg border-[#3C3C3C] bg-[#252526] py-1 px-2 h-auto border flex items-center justify-center flex-wrap text-[#D4D4D4]">
        <UndoRedoBtn />
        <ImageChoser />
        <div className='border mx-2 opacity-30 h-6'/>
        <ColorPicker />
        <LineWidthPicker />
        <ShapeSelector />
        <ModeChoser />
        <div className='border mx-2 opacity-30 h-6'/>
        <RightToolbar />
      </div>
    </div>
  )
}

export default Toolbar

