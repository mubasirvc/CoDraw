import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickAway } from "react-use";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animation";
import { BsPaletteFill } from "react-icons/bs";
import { useOptions } from "@/common/redux/options";
import ColorPicker from "react-best-gradient-color-picker";

const GradientColorPicker = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="" ref={ref}>
      <button
        className="w-4 h-4 flex justify-center items-center mx-2"
        disabled={options.mode === "select"}
        onClick={() => setOpened(!opened)}
      >
        <img src="/images/color-wheel.png" alt="colorpicker" />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute pl-0 m-0 mt-3 flex"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <ColorPicker
              hideInputs
              hideControls	
              width={220}
              height={220}
              value={rgbaToCssString(options.lineColor)}
              onChange={(color) => {
                setOptions({
                  ...options,
                  lineColor: cssStringToRgba(color),
                });
              }}
              className="mb-5"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Converts an RgbaColor object to a CSS string.
 */
function rgbaToCssString(color: { r: number; g: number; b: number; a: number }): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

/**
 * Converts a CSS color string to an RgbaColor object.
 */
function cssStringToRgba(color: string): { r: number; g: number; b: number; a: number } {
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d?.?\d+)?\)/);
  if (rgbaMatch) {
    const [, r, g, b, a = '1'] = rgbaMatch;
    return { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) };
  }
  throw new Error("Invalid color format");
}

export default GradientColorPicker;
