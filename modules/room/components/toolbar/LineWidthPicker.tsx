import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from "react-use";
import { useOptions } from "@/common/recoil/options";

const LineWidthPicker = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="" ref={ref}>
      <button
        className="text-lg rounded-full bg-[#333333] p-2 w-10 h-10 flex justify-center items-center"
        onClick={() => setOpened(!opened)}
        disabled={options.mode === "select"}
      >
        <BsBorderWidth />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute mt-2 w-36"
            initial="from"
            animate="to"
            exit="from"
          >
            <input
              type="range"
              min={1}
              max={20}
              value={options.lineWidth}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  lineWidth: parseInt(e.target.value, 10),
                }))
              }
              className="h-4 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineWidthPicker;