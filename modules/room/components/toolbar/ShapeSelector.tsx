import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiRectangle } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag } from "react-icons/cg";
import { useClickAway } from "react-use";
import { Shape } from "@/common/types/socketTypes";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animation";
import { useOptions } from "@/common/redux/options";

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
    <div className="relative inline-block" ref={ref}>
      <button
        className=" w-10 h-10 flex justify-center items-center"
        onClick={() => setOpened((prev) => !prev)}
        disabled={options.mode === "select"}
      >
        {options.shape === "circle" && <BsCircle />}
        {options.shape === "rect" && <BiRectangle />}
        {options.shape === "line" && <CgShapeZigzag />}
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute transform mt-3 z-10 flex gap-4 rounded-lg border bg-[#333] p-3 md:border-0"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <button
              className={`${options.shape === "line" && "text-green-400"}`}
              onClick={() => handleShapeChange("line")}
            >
              <CgShapeZigzag />
            </button>

            <button
              className={`${options.shape === "rect" && "text-green-400"}`}
              onClick={() => handleShapeChange("rect")}
            >
              <BiRectangle />
            </button>

            <button
              className={`${options.shape === "circle" && "text-green-400"}`}
              onClick={() => handleShapeChange("circle")}
            >
              <BsCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;
