"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Package,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/about", label: "About us" },
];

// Cubic bezier easing
const easeOutExpo = "easeOut" as const;

// Animation variants with bounce effect
const navVariants = {
  hidden: { opacity: 0, y: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      mass: 1,
      bounce: 0.4,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
      delay: 0.3 + i * 0.08,
    },
  }),
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo, delay: 0.1 },
  },
};

const actionVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
      delay: 0.5 + i * 0.08,
    },
  }),
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    scale: 0.98,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      mass: 1,
      bounce: 0.3,
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easeOutExpo,
      delay: i * 0.05,
    },
  }),
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: -15,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 18,
      mass: 0.8,
      bounce: 0.35,
    },
  },
};

// Scroll-based navigation visibility variants with bounce effect
const scrollNavVariants = {
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
      mass: 1,
      bounce: 0.5,
    },
  },
  hidden: {
    y: -120,
    opacity: 0,
    scale: 0.95,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 20,
      mass: 0.8,
      bounce: 0.3,
    },
  },
};

// List/Menu icon SVG component
const ListIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.1875 3.5H11.8125M2.1875 7H11.8125M2.1875 10.5H11.8125"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Minimum scroll distance before triggering hide/show

  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === "/";

  const {
    isAuthenticated,
    customer,
    logout,
    isLoading: isAuthLoading,
  } = useAuth();
  const { totalQuantity, toggleCart } = useCart();

  // Scroll direction detection for nav visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;

      // Update hasScrolled state for initial animation vs scroll animation
      if (currentScrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }

      // Only trigger if scroll difference exceeds threshold
      if (Math.abs(scrollDifference) < scrollThreshold) {
        return;
      }

      // Scrolling down - hide nav
      if (scrollDifference > 0 && currentScrollY > 100) {
        setIsNavVisible(false);
        // Close mobile menu when hiding nav
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }
      // Scrolling up - show nav
      else if (scrollDifference < 0) {
        setIsNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Navigation Container - Floating pill design */}
      <motion.div
        initial="visible"
        animate={isNavVisible ? "visible" : "hidden"}
        variants={scrollNavVariants}
        className="fixed top-0 left-0 right-0 z-50 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pt-2 xs:pt-3 sm:pt-4"
      >
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={navVariants}
          className="max-w-[1400px] mx-auto bg-white border border-black/[0.08] rounded-[32px] xs:rounded-[36px] sm:rounded-[40px] md:rounded-[44px] px-3 xs:px-4 sm:px-5 md:px-8 lg:px-10 py-2.5 xs:py-3 md:py-3.5 lg:py-4"
        >
          <div
            className={`flex items-center justify-between relative ${isLandingPage ? "min-h-[24px] xs:min-h-[26px] sm:min-h-[28px] md:min-h-[30px]" : ""}`}
          >
            {/* Left Navigation - Desktop (hidden on landing page) */}

            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 md:w-[240px] lg:w-[280px] xl:w-[325px]">
              {navLinks.map((link, index) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(link.href + "/");
                return (
                  <motion.div
                    key={`${link.href}-${index}`}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                  >
                    <Link
                      href={link.href}
                      className={`relative text-sm lg:text-base leading-none transition-colors whitespace-nowrap ${
                        isActive
                          ? "text-black font-bold decoration-solid"
                          : "text-black/60 font-normal hover:text-black"
                      }`}
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Left Logo - Mobile */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              className="md:hidden flex items-center"
            >
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/logo-nav-mobile.svg"
                    alt="Optimist"
                    width={95}
                    height={19}
                    className="h-[16px] xs:h-[17px] sm:h-[19px] w-auto"
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Center Logo - Desktop */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center"
            >
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/logo-nav.svg"
                    alt="Optimist"
                    width={149}
                    height={30}
                    className="h-[24px] lg:h-[27px] xl:h-[30px] w-auto"
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Right Actions - Desktop (hidden on landing page) */}
            {!isLandingPage && false && (
              <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 justify-end md:w-[240px] lg:w-[280px] xl:w-[325px]">
                {/* Cart */}
                <motion.button
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={actionVariants}
                  onClick={toggleCart}
                  className="flex items-center gap-1.5 lg:gap-2 text-black/60 hover:text-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative w-5 h-5 lg:w-6 lg:h-6">
                    <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                    <AnimatePresence>
                      {totalQuantity > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                          className="absolute -top-2 -right-2 w-3.5 h-3.5 lg:w-4 lg:h-4 flex items-center justify-center text-[8px] lg:text-[9px] font-bold bg-optimist-blue-primary text-white rounded-full"
                        >
                          {totalQuantity > 99 ? "99+" : totalQuantity}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-sm lg:text-base leading-none font-normal">
                    Cart
                  </span>
                </motion.button>

                {/* Account / Login Button */}
                {isAuthenticated ? (
                  <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={actionVariants}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-[40px] border border-black/[0.15] text-black/60 hover:text-black hover:bg-black/5 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-5 h-5 lg:w-6 lg:h-6" />
                      <span className="text-sm lg:text-base leading-none font-normal truncate max-w-[80px] lg:max-w-[100px]">
                        {customer?.firstName || "Account"}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={dropdownVariants}
                            className="absolute right-0 top-full mt-2 w-48 lg:w-52 xl:w-56 bg-white border border-black/[0.12] rounded-lg lg:rounded-xl shadow-lg z-50"
                          >
                            <div className="px-3 lg:px-4 py-2.5 lg:py-3 border-b border-black/[0.12]">
                              <p className="text-xs lg:text-sm font-medium text-black truncate">
                                {customer?.firstName} {customer?.lastName}
                              </p>
                              <p className="text-[10px] lg:text-xs text-black/60 truncate">
                                {customer?.email}
                              </p>
                            </div>
                            <div className="py-1.5 lg:py-2">
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  href="/account"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                >
                                  <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                  My Account
                                </Link>
                              </motion.div>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  href="/account/orders"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                >
                                  <Package className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                  Order History
                                </Link>
                              </motion.div>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  href="/account/addresses"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                >
                                  <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                  Addresses
                                </Link>
                              </motion.div>
                            </div>
                            <div className="border-t border-black/[0.12] py-1.5 lg:py-2">
                              <motion.button
                                onClick={handleLogout}
                                className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-1.5 lg:py-2 w-full text-xs lg:text-sm text-red-500 hover:bg-red-50 transition-colors"
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                Sign Out
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  !isAuthLoading && (
                    <motion.div
                      custom={1}
                      initial="hidden"
                      animate="visible"
                      variants={actionVariants}
                    >
                      <Link
                        href="/login"
                        className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-[40px] border border-black/[0.15] text-black/60 hover:text-black hover:bg-black/5 transition-all"
                      >
                        <motion.span
                          className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <User className="w-5 h-5 lg:w-6 lg:h-6" />
                          <span className="text-sm lg:text-base leading-none font-normal">
                            Login
                          </span>
                        </motion.span>
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            )}

            {/* Mobile Menu Button (hidden on landing page) */}
            {!isLandingPage && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-[40px] border border-black/[0.15] text-black/60 hover:text-black hover:bg-black/5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xs xs:text-sm leading-none font-normal">
                  Menu
                </span>
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-black/60"
                    >
                      <ListIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>

          {/* Mobile Navigation Menu (hidden on landing page) */}
          {!isLandingPage && (
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={mobileMenuVariants}
                  className="md:hidden overflow-hidden mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-black/[0.08]"
                >
                  <div className="space-y-0.5 xs:space-y-1">
                    {navLinks.map((link, index) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname === link.href ||
                            pathname.startsWith(link.href + "/");
                      return (
                        <motion.div
                          key={`${link.href}-${index}`}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base rounded-lg transition-colors ${
                              isActive
                                ? "text-black font-bold bg-black/5 decoration-solid"
                                : "text-black/60 font-normal hover:text-black hover:bg-black/5"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}

                    <motion.button
                      custom={navLinks.length}
                      initial="hidden"
                      animate="visible"
                      variants={mobileItemVariants}
                      onClick={() => {
                        toggleCart();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 xs:gap-3 w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base font-normal rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5" />
                      Cart
                      {totalQuantity > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto px-1.5 xs:px-2 py-0.5 text-[10px] xs:text-xs font-bold bg-optimist-blue-primary text-white rounded-full"
                        >
                          {totalQuantity}
                        </motion.span>
                      )}
                    </motion.button>

                    {isAuthenticated ? (
                      <>
                        <motion.div
                          custom={navLinks.length + 1}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                          className="h-px bg-black/10 my-1.5 xs:my-2"
                        />
                        <motion.div
                          custom={navLinks.length + 2}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                        >
                          <Link
                            href="/account"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base font-normal rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                          >
                            My Account
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={navLinks.length + 3}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                        >
                          <Link
                            href="/account/orders"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base font-normal rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                          >
                            Order History
                          </Link>
                        </motion.div>
                        <motion.button
                          custom={navLinks.length + 4}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base font-normal rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          whileTap={{ scale: 0.98 }}
                        >
                          Sign Out
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.div
                          custom={navLinks.length + 1}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                          className="h-px bg-black/10 my-1.5 xs:my-2"
                        />
                        <motion.div
                          custom={navLinks.length + 2}
                          initial="hidden"
                          animate="visible"
                          variants={mobileItemVariants}
                        >
                          <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base font-normal rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                          >
                            <User className="w-4 h-4 xs:w-5 xs:h-5" />
                            Login
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.nav>
      </motion.div>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default Navigation;
