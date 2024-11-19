import { CANVAS_SIZE } from '@/common/constants'
import { useViewportSize } from '@/common/hooks/useViewPortSize'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { socket } from '@/common/lib/socket'
import { useMovesHandlers } from '../../hooks/useMoveHandlers'
import MiniMap from './MiniMap'
import { useBoardPosition } from '../../hooks/useBoardPosition'
import { useSocketDraw } from '../../hooks/useSocketDraw'
import { useDraw } from '../../hooks/useDraw'
import { useRefs } from '../../hooks/useRefs'
import { useCtx } from '../../hooks/useCtx'
import { BsArrowsMove } from 'react-icons/bs'
import Audio from '../toolbar/MyAudio'

const Canvas = () => {
  // const [inputVisible, setInputVisible] = useState(false);
  // const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  // const [text, setText] = useState("");
  // const [isTyping, setIsTyping] = useState(false);

  const { undoRef, canvasRef, redoRef } = useRefs()
  const [draging, setDraging] = useState(true)
  const { width, height } = useViewportSize()
  const { x, y } = useBoardPosition()
  const ctx = useCtx()
  const inputRef = useRef<HTMLInputElement>(null);


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

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newText = e.target.value;
  //   setText(newText); // Update the state with the current value
  //   drawTextToCanvas(newText);
  // };
  
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Backspace") {
  //     setText((prev) => prev.slice(0, -1)); // Remove the last character on Backspace
  //     drawTextToCanvas(text.slice(0, -1));
  //     e.preventDefault(); // Prevent default backspace behavior in the input
  //   }
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Backspace") {
  //     setText((prev) => {
  //       const updatedText = prev.slice(0, -1); // Remove the last character
  //       drawTextToCanvas(updatedText); // Redraw text on canvas after removing the character
  //       return updatedText;
  //     });
  //   }
  // };


  // const drawTextToCanvas = (text: string) => {

  //   if (ctx) {
  //     // Clear the canvas before redrawing

  //     // Set font style and text properties
  //     ctx.font = "22px Arial";
  //     ctx.fillStyle = "black";

  //     // Draw the text on the canvas
  //     ctx.fillText(text, inputPosition.x, inputPosition.y);
  //   }
  // };
  // console.log(text, 'text', isTyping, 'istyp', inputVisible);


  return (
    <div className='relative h-full w-full overflow-hidden  bg-[#1E1E1E]'>
      <motion.canvas
        className={`top-0 z-10 ${draging && "cursor-move"}`}
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

        // onMouseDown={(e) => { handleStartDrawing(e.clientX, e.clientY, setInputPosition, setInputVisible, setText, setIsTyping) }}
        // onMouseUp={handleEndDrawing}
        // onMouseMove={(e) => { handleDraw(e.clientX, e.clientY, e.shiftKey) }}
        // onTouchStart={(e) => { handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY, setInputPosition, setInputVisible, setText, setIsTyping) }}
        // onTouchEnd={handleEndDrawing}
        // onTouchMove={(e) => { handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}

        onMouseDown={(e) => { handleStartDrawing(e.clientX, e.clientY) }}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => { handleDraw(e.clientX, e.clientY, e.shiftKey) }}
        onTouchStart={(e) => { handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => { handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }}
      />

      {/* {inputVisible && (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            position: "absolute",
            left: inputPosition.x,
            top: inputPosition.y - 16,  // Position above canvas text baseline
            backgroundColor: "transparent",
            color: "transparent",       // Hide text color
            caretColor: "black",        // Show only the caret
            border: "none",
            outline: "none",
            width: "auto",
            pointerEvents: "auto",
            zIndex: 100,
          }}
        />
      )} */}



      {/* <MiniMap dragging={draging} /> */}

      <button
        className={`fixed bottom-14 left-5 z-10 rounded-xl md:bottom-5 ${draging ? "bg-green-500" : "bg-zinc-300 text-black"
          } p-3 text-lg text-white`}
        onClick={() => setDraging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </div>
  )
}

export default Canvas
