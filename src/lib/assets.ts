const S3_BUCKET_URL = "https://optimist-fe-assets.s3.amazonaws.com";

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
  acTilt: getAssetUrl("/acTiltedAngle.png"),
  comparisonShadowBg: "/assets/products/comparison-shadow-bg.webp",
  comparisonShadowBgMobile: "/assets/products/comparison-shadow-bg-mobile.webp",
  acComparison: "/assets/products/acComparison.webp",
  team1: getAssetUrl("Team1.png"),
  team2: getAssetUrl("Team2.png"),
  team3: getAssetUrl("Team3.png"),
  team4: getAssetUrl("Team4.png"),

  // Warranty Section
  warrantyCard: "/assets/products/warranty-card.webp",
  warrantyCheck: "/assets/proof/checkmark.webp",

  // Recognition Section
  shieldSlash: "/icons/shield-slash.svg",
  leafIcon: getAssetUrl("leaf.png"),
  hourglass: getAssetUrl("hourglass.png"),

  // Hero Section
  acHeroDesktop: getAssetUrl("ACHeroDesktop.png"),
  acHeroMobile: getAssetUrl("ACHeroMobile.png"),
  heroDesktopBg: getAssetUrl("Herodesktopbg.png"),
  heroMobileBg: getAssetUrl("Heromobilebg.png"),

  // Benefits Section
  benf2Ass1: getAssetUrl("Benf2Ass1.png"),
  benf2Ass2: getAssetUrl("Benf2Ass2.png"),
  benf3Ass1: getAssetUrl("Benf3Ass1.png"),
  benf3Ass2: getAssetUrl("Benf3Ass2.png"),

  // Supporters Section
  iitLogo: getAssetUrl("iit-logo.png"),
  ceptUniversity: getAssetUrl("cept-university.png"),
  iihs: getAssetUrl("iihs.png"),
  accelLogo: getAssetUrl("accel.png"),
  sparrowLogo: getAssetUrl("sparrow.png"),
  spectrumImpact: getAssetUrl("spectrum-impact.png"),
  arkamVentures: getAssetUrl("arkam-ventures.png"),

  // Blog Section
  clipPathGroup2: getAssetUrl("Clip path group2.png"),

  // Contact Us
  contactUsBg: "/assets/contactUs.webp",

  // Ratings & Stars
  fiveStarRating: getAssetUrl("5StarRating.png"),
  goldenStar: getAssetUrl("GoldenStar.png"),

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

  // Decorative
  family: "/assets/Family.webp",
  // Logo — produced by scripts/optimize-images.mjs from the S3 source PNG.
  // Was 85 KiB at 4896×976; the local WebP is ~5 KiB at 800×160 and is
  // sized for the largest display slot (Footer at 60% of 1440 px). Lazy-
  // loaded by next/image (loading="lazy" is set at the call site).
  frame48095518: "/assets/logo.webp",

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
  rocketLaunchIcon: "/icons/rocket-launch.svg",
  calendarCheckIcon: "/icons/calendar-check.svg",

  // Hero Badge Icons
  thermometerBadge: "/icons/thermometer-badge.webp",
  iseer5StarBadge: "/icons/iseer-5star-badge.webp",

  calendar: getAssetUrl("mobilerApp6.png"),
  filter: getAssetUrl("mobilerApp5.png"),
  gastank: getAssetUrl("mobilerApp4.png"),
  headset: getAssetUrl("mobilerApp3.png"),
  scroll: getAssetUrl("mobilerApp2.png"),
  thermometer: getAssetUrl("mobilerApp1.png"),

  // Videos
  videos: {
    pointersAnimation: getAssetUrl("PointerssAnimation.mp4"),
    pointersAnimationMobile: getAssetUrl("PointersAnimationMobile.mp4"),
    productCardAnimation2: getAssetUrl("ProductCardAnimation2.mp4"),
    treeCool: getAssetUrl("TreeCool.mp4"),
    heroLeafVideo: getAssetUrl(
      "small-vecteezy_summer-concept-the-motion-of-leaves-sunlight-natural-shadow_9167357_small.mp4",
    ),
  },

  // About Page Assets
  futureTeam: getAssetUrl("future-team.png"),
  missionImage: getAssetUrl("mission-image.jpg"),
  teamFounderBg: getAssetUrl("team-founder-bg.png"),

  // Auth Page Assets
  loginMobileGradient: getAssetUrl("loginMobileGradient.png"),
  desktopMobileGradient: getAssetUrl("DesktopMobileGradient.png"),
  accountDecorativeAsset: "/assets/accountDecorativeAsset.webp",

  // Proof Section
  proofCheckmark: "/assets/proof/checkmark.webp",
  proofCertifiedBadge: "/assets/proof/certified-badge.webp",
  proofSigmaCertificate: "/images/Frame 2085663005.webp",
  proofSaveEnergyBadge: "/assets/proof/save-energy-badge.webp",
  proofBeeLabel: "/assets/proof/bee-label.webp",

  // Inside Optimist Section
  insideOptimistAcUnit: "/assets/inside-optimist/ac-unit.webp",
  insideOptimistHeatExchanger: "/assets/inside-optimist/heat-exchanger.webp",
  insideOptimistCompressor: "/assets/inside-optimist/compressor.webp",
  insideOptimistExpansionValve: "/assets/inside-optimist/expansion-valve.webp",

  // Team Section
  teamLabPhoto: "/assets/team/team-lab-photo.webp",
  teamLabPhotoMobile: "/assets/team/team-mobile.webp",

  // Featured On Logos
  featuredAngelone: "/assets/featured/angelone.webp",
  featuredNews18: "/assets/featured/news18.webp",
  featuredPti: "/assets/featured/pti.webp",
  featuredInc42: "/assets/featured/inc42.webp",
  featuredRediff: "/assets/featured/rediff.png",
  featuredEntrackr: "/assets/featured/entrackr.png",
  featuredEntrepreneur: "/assets/featured/entrepreneur.webp",

  // Mobile App Section Assets
  mob1: "/assets/mob1.webp",
  mob2: "/assets/mob2.webp",
  mob3: "/assets/mob3.webp",
  mob4: "/assets/mob4.webp",
  mob5: "/assets/mob5.webp",
  mob6: "/assets/mob6.webp",
  info1: "/assets/info1.webp",
  info2: "/assets/info2.webp",
  info3: "/assets/info3.webp",
  info4: "/assets/info4.webp",
  mobileBg: "/assets/bgg.webp",
  circletick: "/assets/circletick.png",
  optimistImageAsset: "/assets/ACImageAsset.webp",
} as const;

export default ASSETS;
