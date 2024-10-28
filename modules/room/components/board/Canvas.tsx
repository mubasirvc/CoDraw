import { CANVAS_SIZE } from '@/common/constants'
import useViewPortSize from '@/common/hooks/useViewPortSize'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import { socket } from '@/common/lib/socket'
import { useMovesHandlers } from '../../hooks/useMoveHandlers'
import MiniMap from './MiniMap'
import { useBoardPosition } from '../../hooks/useBoardPosition'
import { useSocketDraw } from '../../hooks/useSocketDraw'
import { useDraw } from '../../hooks/useDraw'
import { useRefs } from '../../hooks/useRefs'

const Canvas = () => {
  const { undoRef, canvasRef, redoRef } = useRefs()

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()
  const [draging, setDraging] = useState(false)
  const [movedMiniMap, setmovedMiniMap] = useState(false)

  const { width, height } = useViewPortSize()

  const { x, y } = useBoardPosition()
  const { handleUndo, handleRedo } = useMovesHandlers()

  useKeyPressEvent("Controll", (e) => {
    if (e.ctrlKey && !draging) {
      setDraging(true)
    }
  })


  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing, } = useDraw(draging)

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

    const undoBtn = undoRef.current
    const redoBtn = redoRef.current

    undoBtn?.addEventListener("click", handleUndo)
    redoBtn?.addEventListener("click", handleRedo)

    return () => {
      window.removeEventListener("keyup", handleKeyUp)
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
      <MiniMap
        dragging={draging}
        setMovedMiniMap={setmovedMiniMap}
      />
    </div>
  )
}

export default Canvas
