import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiRectangle } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag } from "react-icons/cg";
import { useClickAway } from "react-use";
import { Shape } from "@/common/types/socketTypes";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animation";
import { useOptions } from "@/common/redux/options";
import Tooltip from "./Tooltip";

const ShapeSelector = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const handleShapeChange = (shape: Shape) => {
    setOptions({
      ...options,
      shape,
    });
    setOpened(false);
  };

  return (
    <div className="relative inline-block " ref={ref}>
      <Tooltip title="shape">
        <button
          className=" w-8 h-8 flex justify-center items-center hover:bg-[#3C3C3C] rounded-full"
          onClick={() => setOpened((prev) => !prev)}
          disabled={options.mode === "select"}
        >
          {options.shape === "circle" && <BsCircle />}
          {options.shape === "rect" && <BiRectangle />}
          {options.shape === "line" && <CgShapeZigzag />}
        </button>
      </Tooltip>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute transform px-2 gap-1 mt-5 z-10 flex border-[#3C3C3C] bg-[#252526] rounded-lg border p-1"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <Tooltip title="line">
              <button
                className={`${options.shape === "line" && "text-green-400  " } hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center `}
                onClick={() => handleShapeChange("line")}
              >
                <CgShapeZigzag />
              </button>
            </Tooltip>
            <Tooltip title="rectangle">
              <button
                className={`${options.shape === "rect" && "text-green-400 "} hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center ` }
                onClick={() => handleShapeChange("rect")}
              >
                <BiRectangle />
              </button>
            </Tooltip>
            <Tooltip title="circle">
              <button
                className={`${options.shape === "circle" && "text-green-400 "} hover:bg-[#3C3C3C] rounded-full w-8 h-8 flex items-center justify-center ` }
                onClick={() => handleShapeChange("circle")}
              >
                <BsCircle />
              </button>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;
