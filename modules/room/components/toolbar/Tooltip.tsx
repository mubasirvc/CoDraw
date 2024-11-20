import React, { ReactNode } from 'react'

const Tooltip = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="relative group">
      {children}
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 text-xs py-1 font-small text-[#D4D4D4] bg-[#3C3C3C] rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity"
      >
        {title}
      </div>
    </div>
  )
}

export default Tooltip
