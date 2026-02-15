"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { ASSETS } from "@/lib/assets";

// LinkedIn icon component
function LinkedInIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V24C0 24.5304 0.210714 25.0391 0.585786 25.4142C0.960859 25.7893 1.46957 26 2 26H24C24.5304 26 25.0391 25.7893 25.4142 25.4142C25.7893 25.0391 26 24.5304 26 24V2C26 1.46957 25.7893 0.960859 25.4142 0.585786C25.0391 0.210714 24.5304 0 24 0ZM9 19C9 19.2652 8.89464 19.5196 8.70711 19.7071C8.51957 19.8946 8.26522 20 8 20C7.73478 20 7.48043 19.8946 7.29289 19.7071C7.10536 19.5196 7 19.2652 7 19V11C7 10.7348 7.10536 10.4804 7.29289 10.2929C7.48043 10.1054 7.73478 10 8 10C8.26522 10 8.51957 10.1054 8.70711 10.2929C8.89464 10.4804 9 10.7348 9 11V19ZM8 9C7.70333 9 7.41332 8.91203 7.16665 8.7472C6.91997 8.58238 6.72771 8.34811 6.61418 8.07403C6.50065 7.79994 6.47094 7.49834 6.52882 7.20736C6.5867 6.91639 6.72956 6.64912 6.93934 6.43934C7.14912 6.22956 7.41639 6.0867 7.70736 6.02882C7.99834 5.97094 8.29994 6.00065 8.57403 6.11418C8.84811 6.22771 9.08238 6.41997 9.2472 6.66665C9.41203 6.91332 9.5 7.20333 9.5 7.5C9.5 7.89782 9.34196 8.27936 9.06066 8.56066C8.77936 8.84196 8.39782 9 8 9ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20C18.7348 20 18.4804 19.8946 18.2929 19.7071C18.1054 19.5196 18 19.2652 18 19V14.5C18 13.837 17.7366 13.2011 17.2678 12.7322C16.7989 12.2634 16.163 12 15.5 12C14.837 12 14.2011 12.2634 13.7322 12.7322C13.2634 13.2011 13 13.837 13 14.5V19C13 19.2652 12.8946 19.5196 12.7071 19.7071C12.5196 19.8946 12.2652 20 12 20C11.7348 20 11.4804 19.8946 11.2929 19.7071C11.1054 19.5196 11 19.2652 11 19V11C11.0012 10.7551 11.0923 10.5191 11.256 10.3369C11.4197 10.1546 11.6446 10.0388 11.888 10.0114C12.1314 9.98392 12.3764 10.0468 12.5765 10.188C12.7767 10.3292 12.918 10.539 12.9738 10.7775C13.6502 10.3186 14.4389 10.0526 15.2552 10.0081C16.0714 9.96368 16.8844 10.1424 17.6067 10.5251C18.329 10.9078 18.9335 11.48 19.3551 12.1803C19.7768 12.8806 19.9997 13.6825 20 14.5V19Z"
        fill="#FFFCDC"
      />
    </svg>
  );
}

// Instagram icon component
function InstagramIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 0H7C5.14409 0.00198528 3.36477 0.740121 2.05245 2.05245C0.740121 3.36477 0.00198528 5.14409 0 7V19C0.00198528 20.8559 0.740121 22.6352 2.05245 23.9476C3.36477 25.2599 5.14409 25.998 7 26H19C20.8559 25.998 22.6352 25.2599 23.9476 23.9476C25.2599 22.6352 25.998 20.8559 26 19V7C25.998 5.14409 25.2599 3.36477 23.9476 2.05245C22.6352 0.740121 20.8559 0.00198528 19 0ZM13 19C11.8133 19 10.6533 18.6481 9.66658 17.9888C8.67988 17.3295 7.91085 16.3925 7.45672 15.2961C7.0026 14.1997 6.88378 12.9933 7.11529 11.8295C7.3468 10.6656 7.91824 9.59647 8.75736 8.75736C9.59647 7.91824 10.6656 7.3468 11.8295 7.11529C12.9933 6.88378 14.1997 7.0026 15.2961 7.45672C16.3925 7.91085 17.3295 8.67988 17.9888 9.66658C18.6481 10.6533 19 11.8133 19 13C18.9983 14.5908 18.3657 16.116 17.2408 17.2408C16.116 18.3657 14.5908 18.9983 13 19ZM20.5 7C20.2033 7 19.9133 6.91203 19.6666 6.7472C19.42 6.58238 19.2277 6.34811 19.1142 6.07403C19.0007 5.79994 18.9709 5.49834 19.0288 5.20736C19.0867 4.91639 19.2296 4.64912 19.4393 4.43934C19.6491 4.22956 19.9164 4.0867 20.2074 4.02882C20.4983 3.97094 20.7999 4.00065 21.074 4.11418C21.3481 4.22771 21.5824 4.41997 21.7472 4.66664C21.912 4.91332 22 5.20333 22 5.5C22 5.89782 21.842 6.27936 21.5607 6.56066C21.2794 6.84196 20.8978 7 20.5 7ZM17 13C17 13.7911 16.7654 14.5645 16.3259 15.2223C15.8864 15.8801 15.2616 16.3928 14.5307 16.6955C13.7998 16.9983 12.9956 17.0775 12.2196 16.9231C11.4437 16.7688 10.731 16.3878 10.1716 15.8284C9.61216 15.269 9.2312 14.5563 9.07686 13.7804C8.92252 13.0044 9.00173 12.2002 9.30448 11.4693C9.60723 10.7384 10.1199 10.1136 10.7777 9.67412C11.4355 9.2346 12.2089 9 13 9C14.0609 9 15.0783 9.42143 15.8284 10.1716C16.5786 10.9217 17 11.9391 17 13Z"
        fill="#FFFCDC"
      />
    </svg>
  );
}

// X (Twitter) icon component
function XIcon() {
  return (
    <svg
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8755 23.4813C21.7894 23.6381 21.6628 23.7689 21.5089 23.8602C21.355 23.9514 21.1794 23.9997 21.0005 24H15.0005C14.8322 23.9999 14.6666 23.9574 14.5191 23.8764C14.3716 23.7953 14.247 23.6783 14.1567 23.5362L9.09549 15.5825L1.74049 23.6725C1.56119 23.8651 1.3132 23.9793 1.05029 23.9903C0.787384 24.0012 0.530739 23.9082 0.336001 23.7312C0.141264 23.5542 0.02413 23.3076 0.00999402 23.0448C-0.00414193 22.7821 0.08586 22.5243 0.260487 22.3275L7.98174 13.8275L0.156736 1.5375C0.0603634 1.3863 0.00641404 1.21198 0.000537388 1.03278C-0.00533926 0.853574 0.0370728 0.676088 0.123333 0.518902C0.209593 0.361717 0.336528 0.230615 0.490846 0.139325C0.645164 0.0480342 0.821188 -8.70794e-05 1.00049 1.18294e-07H7.00049C7.16879 5.21628e-05 7.33435 0.0425814 7.48185 0.123647C7.62934 0.204713 7.75398 0.321693 7.84424 0.46375L12.9055 8.4175L20.2605 0.3275C20.4398 0.134898 20.6878 0.0207293 20.9507 0.00974476C21.2136 -0.0012398 21.4702 0.0918457 21.665 0.26882C21.8597 0.445794 21.9768 0.692393 21.991 0.955153C22.0051 1.21791 21.9151 1.47565 21.7405 1.6725L14.0192 10.1663L21.8442 22.4638C21.9401 22.615 21.9935 22.7892 21.999 22.9682C22.0045 23.1472 21.9619 23.3244 21.8755 23.4813Z"
        fill="#FFFCDC"
      />
    </svg>
  );
}

// YouTube icon component
function YouTubeIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.4653 6.8C25.2133 5.84 24.4533 5.08 23.4933 4.82667C21.48 4.33333 13 4.33333 13 4.33333C13 4.33333 4.52 4.33333 2.50667 4.82667C1.54667 5.08 0.786667 5.84 0.534667 6.8C0.0413333 8.81333 0.0413333 13 0.0413333 13C0.0413333 13 0.0413333 17.1867 0.534667 19.2C0.786667 20.16 1.54667 20.92 2.50667 21.1733C4.52 21.6667 13 21.6667 13 21.6667C13 21.6667 21.48 21.6667 23.4933 21.1733C24.4533 20.92 25.2133 20.16 25.4653 19.2C25.9587 17.1867 25.9587 13 25.9587 13C25.9587 13 25.9587 8.81333 25.4653 6.8ZM10.4 17.0667V8.93333L17.1333 13L10.4 17.0667Z"
        fill="#FFFCDC"
      />
    </svg>
  );
}

const navLinksCol1 = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/products", label: "Products" },
];

const navLinksCol2 = [
  { href: "/contact-us", label: "Contact us" },
  { href: "/blogs", label: "Blogs" },
  { href: "/faq", label: "FAQ's" },
];

const socialLinks = [
  { href: "https://x.com/optimist_AC", icon: XIcon, label: "X" },
  {
    href: "https://www.instagram.com/optimist.ac?igsh=ajZtaG1xN3ZhZ3Jl&utm_source=qr",
    icon: InstagramIcon,
    label: "Instagram",
  },
  {
    href: "http://www.youtube.com/@optimistAC",
    icon: YouTubeIcon,
    label: "YouTube",
  },
];

// Phone validation helper
function isValidPhone(phone: string): boolean {
  // Indian phone: 10 digits, optionally with +91 prefix
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Easing
const easeOutExpo = "easeOut" as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

const linkHoverVariants = {
  hover: { x: 4, transition: { duration: 0.2 } },
};

const socialHoverVariants = {
  hover: { scale: 1.15, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { submitPhone, isLoading, openModal, showSuccess } = useWaitlist();

  const isContentInView = useInView(contentRef, { once: true, amount: 0.2 });
  const isImageInView = useInView(imageRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    // Call the API
    const success = await submitPhone(phone);
    if (success) {
      setPhone("");
      // Open modal and show success view
      openModal();
      showSuccess();
    }
  };

  return (
    <footer ref={footerRef} className="relative overflow-hidden">
      {/* Blue Cool Background */}
      <div
        className="absolute inset-0 "
        style={{ backdropFilter: "blur(200px)" }}
      >
        <Image
          src={ASSETS.blueCoolBackground}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-12 md:pt-16 pb-6 md:pb-12">
        {/* Top Section - Links & Newsletter */}
        <motion.div
          ref={contentRef}
          initial="hidden"
          animate={isContentInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-0 md:mb-4"
        >
          {/* Column 1 - Nav Links */}
          <motion.nav variants={itemVariants} className="flex flex-col gap-4">
            {navLinksCol1.map((link, index) => (
              <motion.div
                key={link.href}
                variants={linkHoverVariants}
                whileHover="hover"
              >
                <Link
                  href={link.href}
                  className="text-base md:text-[16px] text-[#FFFCDC] hover:text-white transition-colors inline-block"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Column 2 - Nav Links */}
          {/* <motion.nav variants={itemVariants} className="flex flex-col gap-4">
            {navLinksCol2.map((link, index) => (
              <motion.div
                key={link.href}
                variants={linkHoverVariants}
                whileHover="hover"
              >
                <Link
                  href={link.href}
                  className="text-[14px] md:text-[16px] text-[#FFFCDC] hover:text-white transition-colors inline-block"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav> */}

          {/* Column 3 - Social Links */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-1"
          >
            <p className="text-base text-[#FFFCDC] mb-4">Social links</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center text-[#FFFCDC] hover:opacity-80 transition-all"
                  variants={socialHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div />
          {/* Column 4 - Newsletter */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-2"
          >
            <p className="text-xs uppercase tracking-wider text-[#FFFCDC] mb-4">
              JOIN THE WAITLIST
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-3">
                <motion.input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(null);
                  }}
                  placeholder="enter your phone number"
                  disabled={isLoading}
                  className={`w-full md:flex-1 px-4 py-3 bg-optimist-dark border rounded-full text-[#FFFCDC] placeholder:text-[#FFFCDC]/50 focus:outline-none focus:border-optimist-blue-primary transition-colors ${
                    error ? "border-red-500" : "border-optimist-border"
                  } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="btn-buy-now w-full md:w-auto md:px-6 py-3 rounded-full text-[#FFFCDC] font-semibold text-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Submitting...
                    </span>
                  ) : (
                    "Join the Waitlist"
                  )}
                </motion.button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm pl-4"
                >
                  {error}
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom Section - Family Image with Logo */}
        <motion.div
          ref={imageRef}
          initial="hidden"
          animate={isImageInView ? "visible" : "hidden"}
          variants={imageVariants}
          className="relative mt-8 md:mt-10"
        >
          <motion.div
            className="relative w-full aspect-[15/9] md:aspect-[22/9] rounded-[24px] md:rounded-[50px] overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            {/* Family Image */}
            <Image
              src={ASSETS.family}
              alt="Happy family enjoying comfort"
              fill
              className="object-cover z-0 brightness-[0.8]"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />

            {/* Blue Gradient Overlay - higher z-index than family image */}

            {/* Logo Overlay */}
            <motion.div
              className="absolute inset-0 z-20 flex items-end justify-center pb-10 md:pb-10 px-4 md:px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isImageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Image
                src={ASSETS.frame48095518}
                alt="Optimist"
                width={800}
                height={150}
                className="w-[80%] md:w-[70%] lg:w-[60%] h-auto object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
