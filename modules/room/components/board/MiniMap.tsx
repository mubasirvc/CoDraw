import { CANVAS_SIZE } from "@/common/constants";
import useViewPortSize from "@/common/hooks/useViewPortSize";
import { useMotionValue, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import { useRefs } from "../../hooks/useRefs";

const MiniMap = ({ dragging, setMovedMiniMap }: { dragging: boolean, setMovedMiniMap: Dispatch<SetStateAction<boolean>> }) => {
  const { x, y } = useBoardPosition()

  const { miniMapRef } = useRefs()
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useViewPortSize()

  const minX = useMotionValue(0)
  const minY = useMotionValue(0)

  useEffect(() => {
    minX.on('change', newX => {
      if (!dragging) x.set(-newX * 10)
    })
    minX.on('change', newY => {
      if (!dragging) y.set(-newY * 10)
    })

    return () => {
      minX.clearListeners()
      minY.clearListeners()
    }
  }, [x, y, minX, minY, dragging])

  return (
    <div className="absolute right-10 top-10 z-50 bg-zinc-400"
      ref={containerRef}
      style={{
        width: CANVAS_SIZE.width / 10,
        height: CANVAS_SIZE.height / 10,
      }}
    >
      <canvas
        ref={miniMapRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      />
      <motion.div
        className="absolute top-0 left-0 cursor-grab border-2 border-red-200"
        style={{
          width: width / 10,
          height: height / 10,
          x: minX,
          y: minY,
        }}
        animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
        transition={{ duration: 0 }}
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => setMovedMiniMap((prev) => !prev)}
        onDragEnd={() => setMovedMiniMap((prev: boolean) => !prev)}
      >
      </motion.div>
    </div>
  )
}


export default MiniMap
