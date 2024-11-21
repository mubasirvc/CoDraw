import React from 'react'
import UndoRedoBtn from './UndoRedoBtn';
import ColorPicker from './ColorPicker';
import LineWidthPicker from './LineWidthPicker';
import ShapeSelector from './ShapeSelector';
import ModeChoser from './ModeChoser';
import RightToolbar from './RightToolbar';
import ImageChoser from './ImageChoser';
import DrawBg from './DrawBg';

const Toolbar = () => {
  return (
    <div className='flex justify-center'>
      <div className="top-3 fixed w-auto rounded-lg border-[#3C3C3C] bg-[#252526] py-2 px-3 h-auto border flex items-center justify-center flex-wrap text-[#D4D4D4]">
        <UndoRedoBtn />
        <ImageChoser />
        <div className='border mx-3 opacity-30 h-6'/>
        <div className='flex gap-2'>
        <ColorPicker />
        <LineWidthPicker />
        <ShapeSelector />
        <ModeChoser />
        <DrawBg />
        </div>
        <div className='border mx-3 opacity-30 h-6'/>
        <RightToolbar />
      </div>
    </div>
  )
}

export default Toolbar

