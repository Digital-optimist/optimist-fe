// Storefront announcement bar — an infinite horizontal marquee in the optimist
// logo blue, linking out to the current promo. Update MESSAGE / HREF to change
// it; the message repeats across the bar and the whole bar is clickable.
const MESSAGE = "Prime Day Deal: ₹34,990 on Amazon";
const HREF =
  "https://www.amazon.in/Optimist-Inverter-Cooling-Fastest-Indicator/dp/B0GQ35RNHT";

// Repeat the message enough times that a single track is wider than any realistic
// viewport, keeping the two-track loop seamless (no gap) even on ultrawide screens.
const REPEATS = 8;

function MarqueeTrack() {
  return (
    <ul className="announcement-track flex shrink-0 items-center">
      {Array.from({ length: REPEATS }).map((_, i) => (
        // px-[22px] on every item → a uniform 44px gap between messages, even
        // across the seam where the two tracks meet.
        <li key={i} className="px-[22px]">
          {MESSAGE}
        </li>
      ))}
    </ul>
  );
}

// Height/type per breakpoint: 44px + 14px on mobile, 56px + 16px on desktop.
export function AnnouncementBar() {
  return (
    <div
      className="announcement-bar w-full overflow-hidden bg-optimist-blue-hero text-white select-none"
      style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
    >
      <a
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        // The visible marquee repeats the message many times; the label states it
        // once so screen readers announce a single, clear link.
        aria-label={`${MESSAGE} — shop on Amazon`}
        className="block cursor-pointer"
      >
        <div
          className="flex h-11 md:h-14 items-center whitespace-nowrap text-sm md:text-base font-medium leading-none"
          aria-hidden="true"
        >
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </a>
    </div>
  );
}

export default AnnouncementBar;
