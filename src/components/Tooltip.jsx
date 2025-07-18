import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const Tooltip = ({ children, text, position = "right", className }) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipPositionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute py-1 px-2 bg-black/50 backdrop-blur-sm text-[0.6rem] rounded border border-white/10 shadow-lg whitespace-nowrap
                    ${tooltipPositionClasses[position]} ${className}`}
          >
            {text}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Tooltip;
