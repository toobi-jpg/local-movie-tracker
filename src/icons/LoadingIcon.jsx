import { useLottie } from "lottie-react";
import { motion } from "motion/react";
import Loader from "../assets/Loader.json";

export default function LoadingIcon({ className }) {
  const options = {
    animationData: Loader,
    loop: true,
  };

  const style = {
    scale: 2.5,
  };

  const { View } = useLottie(options, style);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      id="loading-icon"
      className={className}
    >
      {View}
    </motion.div>
  );
}
