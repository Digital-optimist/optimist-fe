import BlueGradientBox from "@/assets/icons/blueGradientBox";

export default function HeroBlueGradient1({ progress, isMobile }: { progress: number; isMobile: boolean }) {
  if (isMobile) {
    // Mobile: Blue gradient is 70vh tall, vertically centered (15vh from top)
    return (
      <div
        className="w-full overflow-hidden absolute left-0"
        style={{
          height: '60vh',
          top: '8vh',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
        }}
      >
        <div
          className="w-[1360px] h-full absolute left-1/2 top-0"
          style={{
            transform: 'translateX(-50%)',
          }}
        >
          <BlueGradientBox progress={0} />
        </div>
      </div>
    );
  }

  // Desktop: Gradient fills the card container, bars animate on scroll
  // The card container (parent) already has the rounded corners and dimensions
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        // Force GPU acceleration for smoother animation
        willChange: 'contents',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Scale SVG to fill container while maintaining animation behavior */}
      <div 
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: '1360px',
          transform: 'translateX(-50%)',
        }}
      >
        <BlueGradientBox progress={progress} />
      </div>
    </div>
  );
}