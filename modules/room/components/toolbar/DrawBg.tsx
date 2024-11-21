import React, { useState } from 'react'
import { PiDotsNine } from "react-icons/pi";
import { useCtx } from '../../hooks/useCtx';
import Tooltip from './Tooltip';

const DrawBg = () => {
  const [bg, setBg] = useState(false)

  const ctx = useCtx()

  const drawBackground = () => {
    setBg(true)

    if (ctx) {
      const dotSpacing = 25;
      const dotRadius = 1;
      ctx.fillStyle = "rgba(212, 212, 212, 0.5)";

      for (let y = 0; y < ctx?.canvas.height; y += dotSpacing) {
        for (let x = 0; x < ctx?.canvas.width; x += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  // const clearBackground = () => {
  //   if (ctx) {
  //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   }
  // };

  // const toggleBackground = () => {
  //   if (bg) {
  //     clearBackground();
  //   } else {
  //     drawBackground();
  //   }
  //   setBg(!bg); // Toggle the state
  // };

  return (
    <Tooltip title='background'>
      <button
        className={` hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center`}
        onClick={() => { !bg && drawBackground() }}
      >
        <PiDotsNine />
      </button>
    </Tooltip>
  )
}

export default DrawBg
