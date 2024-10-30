import { CANVAS_SIZE } from '@/common/constants'
import { useViewportSize } from '@/common/hooks/useViewPortSize'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { socket } from '@/common/lib/socket'
import { useMovesHandlers } from '../../hooks/useMoveHandlers'
import MiniMap from './MiniMap'
import { useBoardPosition } from '../../hooks/useBoardPosition'
import { useSocketDraw } from '../../hooks/useSocketDraw'
import { useDraw } from '../../hooks/useDraw'
import { useRefs } from '../../hooks/useRefs'
import { useCtx } from '../../hooks/useCtx'
import { BsArrowsMove } from 'react-icons/bs'

const Canvas = () => {
  const { undoRef, canvasRef, redoRef } = useRefs()
  const [draging, setDraging] = useState(true)
  const { width, height } = useViewportSize()
  const { x, y } = useBoardPosition()
  const ctx = useCtx()

  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing, clearOnYourMove } = useDraw(draging)

  useSocketDraw(drawing)

  const { handleUndo, handleRedo } = useMovesHandlers(clearOnYourMove)

  useEffect(() => {
    setDraging(false)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setDraging(e.ctrlKey)
    }

    window.addEventListener("keyup", handleKey)
    window.addEventListener("keydown", handleKey)

    const undoBtn = undoRef.current
    const redoBtn = redoRef.current

    undoBtn?.addEventListener("click", handleUndo)
    redoBtn?.addEventListener("click", handleRedo)

    return () => {
      window.removeEventListener("keyup", handleKey)
      window.removeEventListener("keydown", handleKey)
      undoBtn?.removeEventListener("click", handleUndo)
      undoBtn?.removeEventListener("click", handleRedo)
    }
  }, [draging, handleUndo, undoRef, canvasRef, redoRef, handleRedo])

  useEffect(() => {
    if (ctx) socket.emit("joined_room")
  }, [ctx])


  return (
    <div className='relative h-full w-full overflow-hidden'>
      <motion.canvas
        className={`z-10 bg-zinc-300 ${draging && 'cursor-move'}`}
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
        onMouseMove={(e) => { handleDraw(e.clientX, e.clientY, e.shiftKey) }}
        onTouchStart={(e) => { handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => { handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}
      />
      <MiniMap dragging={draging} />
      <button
        className={`absolute bottom-14 right-5 z-10 rounded-xl md:bottom-5 ${draging ? "bg-green-500" : "bg-zinc-300 text-black"
          } p-3 text-lg text-white`}
        onClick={() => setDraging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </div>
  )
}

export default Canvas
