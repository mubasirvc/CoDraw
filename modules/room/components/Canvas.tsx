import { CANVAS_SIZE } from '@/common/constants'
import useViewPortSize from '@/common/hooks/useViewPortSize'
import { useMotionValue, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import { useDraw } from '../hooks/useCanvas'
import { socket } from '@/common/lib/socket'
import { CtxOptions } from '@/common/types/socketTypes'
import { drawFromSocket } from '../helpers/drawFromSocke'
import MiniMap from './MiniMap'

const Canvas = () => {
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

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const copyCanvasToSmall = () => {
    if (canvasRef.current) {
      minCanvasRef.current?.getContext("2d")?.drawImage(canvasRef.current, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height)
    }
  }

  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing } = useDraw(ctx, draging, -x.get(), -y.get(), copyCanvasToSmall)

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
    let movesToDrawLater: [number, number][] = []
    let optionsToUseLater: CtxOptions = {
      lineColor: "",
      lineWidth: 0,
    }

    socket.on("socket_draw", (movesToDraw, socketOptions) => {
      if (ctx && !drawing) {
        drawFromSocket(movesToDraw, socketOptions, ctx, copyCanvasToSmall)
      } else {
        movesToDrawLater = movesToDraw
        optionsToUseLater = socketOptions
      }
    })

    return () => {
      socket.off("socket_draw")

      if (movesToDrawLater.length && ctx) {
        drawFromSocket(movesToDrawLater, optionsToUseLater, ctx, copyCanvasToSmall)
      }
    }
  }, [drawing, ctx])
  return (
    <div className='relative h-full w-full overflow-hidden'>
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
        onTouchMove={(e) => {handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}}
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
