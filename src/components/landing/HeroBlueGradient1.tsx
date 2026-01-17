import BlueGradientBox from "@/assets/icons/blueGradientBox";

export default function HeroBlueGradient1({ progress }: { progress: number }) {
  return (
    <div className="absolute top-0 left-0 w-[100dvw] h-[100dvh] pt-[72px] pb-[100px] px-[24px]">
      <div className="w-[100dvw] h-[100dvh] overflow-hidden mx-auto my-auto" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
        <BlueGradientBox progress={progress} />
      </div>
    </div>
  );
}