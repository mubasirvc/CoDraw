import React from 'react'
import ColorPicker from './ColorPicker'
import LineWidthPicker from './LineWidthPicker'
import ShapeSelector from './ShapeSelector'
import ModeChoser from './ModeChoser'

const MidToolbar = () => {

  return (
    <div
      className="flex gap-2 items-center justify-between text-white z-50"
    >
      <ColorPicker />
      <LineWidthPicker />
      <ShapeSelector />
      <ModeChoser />
    </div>
  )
}

export default MidToolbar
