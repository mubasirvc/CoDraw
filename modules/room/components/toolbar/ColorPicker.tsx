import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";
import { useClickAway } from "react-use";

import { useOptions } from "@/common/recoil/options/options.hooks";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animation";

// import { EntryAnimation } from "../../animations/Entry.animations";

const ColorPicker = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="h-6 w-6 rounded-full border-2 border-white transition-all hover:scale-125 active:scale-100"
        style={{backgroundColor: options.lineColor}}
        onClick={() => setOpened(!opened)}
      >
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-10 mt-24 sm:left-14"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            {/* <h2 className="ml-3 font-semibold text-black dark:text-white">
              Line color
            </h2>
            <RgbaColorPicker
              color={options.lineColor}
              onChange={(e) => {
                setOptions({
                  ...options,
                  lineColor: e,
                });
              }}
              className="mb-5"
            />
            <h2 className="ml-3 font-semibold text-black dark:text-white">
              Fill color
            </h2>
            <RgbaColorPicker
              color={options.fillColor}
              onChange={(e) => {
                setOptions({
                  ...options,
                  fillColor: e,
                });
              }}
            /> */}
            <HexColorPicker
              color={options.lineColor}
              onChange={(e) => setOptions((prev) => ({ ...prev, lineColor: e }))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;