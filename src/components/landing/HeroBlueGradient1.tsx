import BlueGradientBox from "@/assets/icons/blueGradientBox";
import { motion } from "framer-motion";

export default function HeroBlueGradient1({ progress }: { progress: number }) {
  const currentScale = 1.2 - (progress * 0.45); // Shrinks from 1.2 to 0.75

  return (
    <motion.div
      initial={{ scale: 1.2, x: "-50%" }}
      animate={{ scale: currentScale, x: "-50%" }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="w-[1360px] h-[600px] md:h-[622px] overflow-hidden absolute left-1/2 top-0 md:top-[10%]"
      style={{
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        // Safari-compatible mask with proper vendor prefixing
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
        // Ensure proper transform origin for Safari
        transformOrigin: 'top center',
        WebkitTransformOrigin: 'top center',
        // Force GPU acceleration for smoother Safari animation
        willChange: 'transform',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      <BlueGradientBox progress={progress} />
    </motion.div>
  );
}