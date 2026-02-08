/**
 * S3 Assets Configuration
 * All static assets are stored in the S3 bucket configured via environment variable
 */
import favicon from "../../public/Favicon_Optimist_32px X 32px.png";

const S3_BUCKET_URL = "https://optimist-fe-assets.s3.amazonaws.com";

// Warn if the environment variable is not set

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
  return `${S3_BUCKET_URL || ""}/${encodedPath}`;
}

// Pre-defined asset paths for type safety and easier refactoring
export const ASSETS = {
  // AC Product Images
  ac1: getAssetUrl("AC1.png"),
  ac2: getAssetUrl("AC2.png"),
  ac3: getAssetUrl("AC3.png"),
  heroAc: getAssetUrl("hero_ac.png"),
  mainAcMobile: getAssetUrl("MainACMobile.png"),
  acTilt: getAssetUrl("/acTiltedAngle.png"),
  builtForAcDesktop: getAssetUrl("/ACTiltDesktop.png"),
  builtForAcMobile: getAssetUrl("/ACTiltMobile.png"),
  optimistAcCompare: getAssetUrl("optimist-ac-compare.png"),
  marketAcCompare: getAssetUrl("market-ac-compare.png"),
  comparisonShadowBg: getAssetUrl("comparison-shadow-bg.png"),
  comparisonTopGradient: getAssetUrl("comparison-top-gradient.png"),
  acComparison: getAssetUrl("acComparison.png"),
  team1: getAssetUrl("Team1.png"),
  team2: getAssetUrl("Team2.png"),
  team3: getAssetUrl("Team3.png"),
  team4: getAssetUrl("Team4.png"),

  // India Story Section
  indiaStoryDesert: getAssetUrl("india-story-desert.png"),
  indiaStorySleeping: getAssetUrl("india-story-sleeping.png"),
  indiaStoryValidated: getAssetUrl("india-story-validated.png"),

  // Warranty Section
  warrantyCard: getAssetUrl("/warranty-card.png"),
  warrantyCheck: getAssetUrl("/warranty-check.png"),

  // Recognition Section
  recognitionEllipse: "/recognition-ellipse.svg",
  recognitionStripes: "/recognition-stripes.svg",
  recognitionBgDesktop: getAssetUrl("/recognition-bg-desktop.png"),
  recognitionBgMobile: getAssetUrl("/recognition-bg-mobile.png"),
  laurelLeft: "/laurel-left.svg",
  laurelRight: "/laurel-right.svg",
  shieldSlash: "/shield-slash.svg",
  leafIcon: "/leaf.svg",
  hourglass: "/hourglass.svg",

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
  optimistMobile: getAssetUrl("optimistMobileLogo.png"),

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
  favicon: favicon,

  // Badges & Features
  image24225: getAssetUrl("image 24225.png"),
  badge41d: getAssetUrl("41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png"),
  piggy: getAssetUrl("piggy.png"),

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

  timeline1: getAssetUrl("Timeline1.png"),
  timeline2: getAssetUrl("Timeline2.png"),
  timeline3: getAssetUrl("Timeline3.png"),
  timeline4: getAssetUrl("Timeline4.png"),
  timeline5: getAssetUrl("Timeline5.png"),
  timeline6: getAssetUrl("Timeline6.png"),
  timeline7: getAssetUrl("Timeline7.png"),
  discussionVideo: getAssetUrl("C5488 (1).mp4"),

  // Icons
  starIcon: "/icons/star.svg",
  rocketLaunchIcon: "/icons/rocket-launch.svg",
  calendarCheckIcon: "/icons/calendar-check.svg",

  calendar: getAssetUrl("mobilerApp6.png"),
  filter: getAssetUrl("mobilerApp5.png"),
  gastank: getAssetUrl("mobilerApp4.png"),
  headset: getAssetUrl("mobilerApp3.png"),
  scroll: getAssetUrl("mobilerApp2.png"),
  thermometer: getAssetUrl("mobilerApp1.png"),

  // Videos
  videos: {
    pointersAnimation: getAssetUrl("PointerssAnimation.mp4"),
    productCardAnimation: getAssetUrl("ProductCardAnimation.mp4"),
    productCardAnimation2: getAssetUrl("ProductCardAnimation2.mp4"),
    productCardAnimationWhite: getAssetUrl("ProductCardAnimationWhite.webm"),
    productCardAnimationWhite2: getAssetUrl("ProductCardAnimationWhite2.mp4"),
    treeCool: getAssetUrl("TreeCool.mp4"),
    heroLeafVideo: getAssetUrl(
      "small-vecteezy_summer-concept-the-motion-of-leaves-sunlight-natural-shadow_9167357_small.mp4",
    ),
  },

  // About Page Assets
  aboutHero: getAssetUrl("about-hero.jpg"),
  futureTeam: getAssetUrl("future-team.png"),
  missionImage: getAssetUrl("mission-image.jpg"),
  teamFounderBg: getAssetUrl("team-founder-bg.png"),
  teamFounder: getAssetUrl("team-founder.png"),
  teamMember: getAssetUrl("team-member.png"),
  timelineImage: getAssetUrl("timeline-image.jpg"),
  urbanLadderLogo: getAssetUrl("urban-ladder-logo.png"),

  // Landing Page Assets
  rectangleBg: getAssetUrl("Rectangle 34625200.png"),
  shadowBg: getAssetUrl("Shadow #0011.png"),

  // Auth Page Assets
  loginMobileGradient: getAssetUrl("loginMobileGradient.png"),
  desktopMobileGradient: getAssetUrl("DesktopMobileGradient.png"),
  clipPathGroup: getAssetUrl("Clip path group.png"),
} as const;

export default ASSETS;
