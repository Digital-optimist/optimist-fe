import BlueGradientBox from "@/assets/icons/blueGradientBox";
import { motion } from "framer-motion";

export default function HeroBlueGradient1({ progress }: { progress: number }) {
  const currentScale = 1.2 - (progress * 0.45); // Shrinks from 1.1 to 0.8

  return (
    // <div className="absolute mx-auto border-test w-[100dvw] h-[100dvh]">
    <motion.div
      initial={{ scale: 1.2 }}
      animate={{ scale: currentScale }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="w-[1360px] h-[600px] md:h-[622px] overflow-hidden absolute left-1/2 -translate-x-1/2 top-0 md:top-[10%]"
      style={{
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
      }}
    >
      <BlueGradientBox progress={progress} />
    </motion.div>
    // </div>
  );
}