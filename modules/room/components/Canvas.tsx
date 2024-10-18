import { CANVAS_SIZE } from '@/common/constants'
import useViewPortSize from '@/common/hooks/useViewPortSize'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import { socket } from '@/common/lib/socket'
import { drawAllMoves } from '../helpers/canvas.helper'
import MiniMap from './MiniMap'
import { useBoardPosition } from '../hooks/useBoardPosition'
import { useRoom } from '@/common/recoil/room'
import { useSocketDraw } from '../hooks/useSocketDraw'
import { useDraw } from '../hooks/useDraw'

const Canvas = () => {
  const room = useRoom()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const minCanvasRef = useRef<HTMLCanvasElement>(null)

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()
  const [draging, setDraging] = useState(false)
  const [movedMiniMap, setmovedMiniMap] = useState(false)

  const { width, height } = useViewPortSize()

  useKeyPressEvent("Controll", (e) => {
    if (e.ctrlKey && !draging) {
      setDraging(true)
    }
  })

  const { x, y } = useBoardPosition()

  const copyCanvasToSmall = () => {
    if (canvasRef.current && minCanvasRef.current) {
      const smallCtx = minCanvasRef.current.getContext("2d")
      if (smallCtx) {
        smallCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height)
        smallCtx.drawImage(canvasRef.current, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height)
      }
    }
  }

  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing, handleUndo } = useDraw(ctx, draging)
  useSocketDraw(ctx, drawing)

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d")
    if (newCtx) setCtx(newCtx)

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && draging) {
        setDraging(false)
      }
    }

    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [draging])

  useEffect(() => {
    if(ctx) socket.emit("joined_room")
  }, [ctx])

  useEffect(() => {
    if(ctx){
      drawAllMoves(ctx, room)
      copyCanvasToSmall()
    }
  }, [ctx, room])


  return (
    <div className='relative h-full w-full overflow-hidden'>
      <button className='top-0 absolute' onClick={handleUndo}>undo</button>
      <motion.canvas
        className={`bg-zinc-300 ${draging && 'cursor-move'}`}
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        style={{ x, y }}
        drag={draging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}

        onMouseDown={(e) => { handleStartDrawing(e.clientX, e.clientY) }}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => { handleDraw(e.clientX, e.clientY) }}
        onTouchStart={(e) => { handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => { handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}
      />
      <MiniMap
        ref={minCanvasRef}
        dragging={draging}
        setMovedMiniMap={setmovedMiniMap}
      />
    </div>
  )
}

export default Canvas
