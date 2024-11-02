import React from 'react'
import RightToolbar from './RightToolbar'
import MidToolbar from './MidToolbar'
import LeftToolbar from './LeftToolbar'

const Toolbar = () => {
  return (
    <div className=' w-full fixed gap-5 flex justify-between items-center top-2 px-3 z-50'>
      <LeftToolbar />
      <MidToolbar />
      <RightToolbar />
    </div>
  )
}

export default Toolbar
