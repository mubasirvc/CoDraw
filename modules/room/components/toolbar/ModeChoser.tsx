import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsPencilFill } from "react-icons/bs";
import { useClickAway } from "react-use";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animation";
import { FaEraser } from "react-icons/fa";
import { PiTextAaBold } from "react-icons/pi";
import { AiOutlineSelect } from "react-icons/ai";
import { useOptions } from "@/common/redux/options";
import Tooltip from "./Tooltip";


const ModeChoser = () => {
  const [options, setOptions] = useOptions();

  const drewingBtnRef = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(drewingBtnRef, () => setOpened(false));

  const handleModeChange = (mode: 'draw' | 'eraser' | 'select' | 'type') => {
    setOptions({
      ...options,
      mode,
    });

    setOpened(false);
  };

  return (
    <div className="" ref={drewingBtnRef}>
      <Tooltip title="mode">
        <button
          className="w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full"
          onClick={() => setOpened((prev) => !prev)}
        >
          {options.mode === "draw" && <BsPencilFill />}
          {options.mode === "eraser" && <FaEraser />}
          {options.mode === "select" && <AiOutlineSelect />}
          {options.mode === "type" && <PiTextAaBold />}
        </button>
      </Tooltip>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute mt-5 z-10 flex gap-1 px-2 p-1 border-[#3C3C3C] bg-[#252526] rounded-lg border"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <button
              className={`${options.mode === "draw" && "text-green-400"} hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center`}
              onClick={() => handleModeChange('draw')}
            >
              <BsPencilFill />
            </button>
            <button
              className={` ${options.mode === "type" && "text-green-400"} hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center`}
              onClick={() => handleModeChange('type')}
            >
              <PiTextAaBold />
            </button>

            <button
              className={` ${options.mode === "eraser" && "text-green-400"} hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center`}
              onClick={() => handleModeChange('eraser')}
            >
              <FaEraser />
            </button>
            <button
              className={` ${options.mode === "select" && "text-green-400"} hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center`}
              onClick={() => handleModeChange('select')}
            >
              <AiOutlineSelect />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModeChoser;
