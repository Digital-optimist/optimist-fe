/**
 * S3 Assets Configuration
 * All static assets are stored in the S3 bucket configured via environment variable
 */

const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";

/**
 * Get the full URL for an asset stored in S3
 * @param path - The asset path (e.g., "hero_ac.png" or "hands/Live Energy Meter.png")
 * @returns Full S3 URL
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  // Encode spaces and special characters in path
  const encodedPath = cleanPath.split("/").map(encodeURIComponent).join("/");
  return `${S3_BUCKET_URL}/${encodedPath}`;
}

// Pre-defined asset paths for type safety and easier refactoring
export const ASSETS = {
  // AC Product Images
  ac1: getAssetUrl("AC1.png"),
  ac2: getAssetUrl("AC2.png"),
  ac3: getAssetUrl("AC3.png"),
  heroAc: getAssetUrl("hero_ac.png"),
  mainAcMobile: getAssetUrl("MainACMobile.png"),
  desktop: getAssetUrl("desktop.png"),
  mobile: getAssetUrl("mobile.png"),
  optimistAcCompare: getAssetUrl("optimist-ac-compare.png"),
  marketAcCompare: getAssetUrl("market-ac-compare.png"),

  // Ratings & Stars
  fiveStarRating: getAssetUrl("5StarRating.png"),
  goldenStar: getAssetUrl("GoldenStar.png"),

  // Benefits Section
  b1: getAssetUrl("b1.png"),
  b2: getAssetUrl("b2.png"),
  b3: getAssetUrl("b3.png"),
  benefitsBg: getAssetUrl("7f1e6fdcab538721bd5209e2c306b0ab004ed70a.png"),

  // Engineered Section
  e1: getAssetUrl("e1.png"),
  e2: getAssetUrl("e2.png"),
  e3: getAssetUrl("e3.png"),
  e4: getAssetUrl("e4.png"),
  lightningBlue: getAssetUrl("LightningBlue.png"),
  lightningWhite: getAssetUrl("LightningWhite.png"),

  // Ellipses & Backgrounds
  ellipse1: getAssetUrl("Ellipse 1.png"),
  ellipse6512: getAssetUrl("Ellipse 6512.png"),
  ellipse6513: getAssetUrl("Ellipse 6513.png"),
  blueCoolBackground: getAssetUrl("BlueCoolBackground.png"),
  brownBgRemote: getAssetUrl("BrownBgRemote.png"),

  // Decorative
  optimistTree: getAssetUrl("OptimistTree.png"),
  leafSwaying: getAssetUrl("Leaf Swaying.gif"),
  family: getAssetUrl("Family.png"),
  frame48095518: getAssetUrl("Frame 48095518.png"),
  confetti: getAssetUrl("Confetti.json"),

  // Logo & Branding
  logo: getAssetUrl("logo (2).png"),
  favicon: getAssetUrl("Favicon_Optimist_32px X 32px.png"),

  // Badges & Features
  image24225: getAssetUrl("image 24225.png"),
  badge41d: getAssetUrl("41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png"),

  // Testimonials (if used)
  ananyaRao: getAssetUrl("AnanyaRao.png"),
  kunalShah: getAssetUrl("KunalShah.png"),
  rohanMehta: getAssetUrl("RohanMehta.png"),

  // Hand Images (Optimist App Section)

    filterTracking: getAssetUrl("Filter tracking.png"),
    gasLevelIndicator: getAssetUrl("Gas level indicator.png"),
    liveEnergyMeter: getAssetUrl("Live Energy Meter.png"),
    projectedMonthlyBills: getAssetUrl("Projected Monthly Bills.png"),
    scheduling: getAssetUrl("Scheduling.png"),
    serviceAssistance: getAssetUrl("Service assistance.png"),
  

  // Icons

    calendar: getAssetUrl("calendar.svg"),
    filter: getAssetUrl("filter.svg"),
    gastank: getAssetUrl("gastank.svg"),
    headset: getAssetUrl("headset.svg"),
    scroll: getAssetUrl("scroll.svg"),
    thermometer: getAssetUrl("thermometer.svg"),
  

  // Videos
  videos: {
    pointersAnimation: getAssetUrl("PointersAnimation.mp4"),
    productCardAnimation: getAssetUrl("ProductCardAnimation.mp4"),
    treeCool: getAssetUrl("TreeCool.mp4"),
  },
} as const;

export default ASSETS;
