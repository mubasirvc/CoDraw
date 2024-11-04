import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsPencilFill } from "react-icons/bs";
import { useClickAway } from "react-use";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animation";
import { FaEraser } from "react-icons/fa";
import { AiOutlineSelect } from "react-icons/ai";
import { useOptions } from "@/common/redux/options";


const ModeChoser = () => {
  const [options, setOptions] = useOptions();

  const drewingBtnRef = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(drewingBtnRef, () => setOpened(false));

  const handleModeChange = (mode: 'draw' | 'eraser' | 'select') => {
    setOptions({
      ...options,
      mode,
    });

    setOpened(false);
  };

  return (
    <div className="" ref={drewingBtnRef}>
      <button
        className="text-lg rounded-full bg-[#333333] p-2 w-10 h-10 flex justify-center items-center"
        onClick={() => setOpened((prev) => !prev)}
      >
        {options.mode === "draw" && <BsPencilFill />}
        {options.mode === "eraser" && <FaEraser />}
        {options.mode === "select" && <AiOutlineSelect />}
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute mt-3 z-10 flex gap-3 rounded-lg border bg-zinc-900 p-2 md:border-0"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <button
              className={`text-xl ${options.mode === "draw" && "text-green-400"}`}
              onClick={() => handleModeChange('draw')}
            >
              <BsPencilFill />
            </button>

            <button
              className={`text-xl ${options.mode === "eraser" && "text-green-400"}`}
              onClick={() => handleModeChange('eraser')}
            >
              <FaEraser />
            </button>
            <button
              className={`text-2xl ${options.mode === "select" && "text-green-400"}`}
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
