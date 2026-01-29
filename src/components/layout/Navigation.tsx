"use client";

import { useState } from "react";
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
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ASSETS } from "@/lib/assets";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/about", label: "About us" },
];

// Cubic bezier easing
const easeOutExpo = "easeOut" as const;

// Animation variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
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
    transition: { duration: 0.3, ease: easeOutExpo },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, ease: easeOutExpo },
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
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Determine if we're on the landing page
  const isLandingPage = pathname === "/";

  const {
    isAuthenticated,
    customer,
    logout,
    isLoading: isAuthLoading,
  } = useAuth();
  const { totalQuantity, toggleCart } = useCart();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // White header for non-landing pages
  if (!isLandingPage) {
    return (
      <>
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={navVariants}
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/[0.12]"
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Left Navigation - Desktop */}
              <div className="hidden md:flex items-center gap-8 w-[325px]">
                {navLinks.map((link, index) => {
                  // For home, exact match; for others, check if pathname starts with the link
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
                        className={`relative text-base transition-colors ${
                          isActive
                            ? "text-black font-bold underline underline-offset-4"
                            : "text-black/60 font-medium hover:text-black"
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
                <Link href="/" className="flex items-center group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={ASSETS.logo}
                      alt="Optimist"
                      width={120}
                      height={32}
                      className="h-6 w-auto invert"
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
                <Link href="/" className="flex items-center group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={ASSETS.logo}
                      alt="Optimist"
                      width={150}
                      height={40}
                      className="h-8 w-auto invert"
                    />
                  </motion.div>
                </Link>
              </motion.div>

              {/* Right Actions */}
              <div className="flex items-center gap-6 justify-end w-[325px]">
                {/* Cart */}
                <motion.button
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={actionVariants}
                  onClick={toggleCart}
                  className="hidden md:flex items-center gap-2 text-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base font-normal">Cart</span>
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
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
                          className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-optimist-blue-primary text-white rounded-full"
                        >
                          {totalQuantity > 99 ? "99+" : totalQuantity}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Account / Login Button */}
                {isAuthenticated ? (
                  <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={actionVariants}
                    className="relative hidden md:block"
                  >
                    <motion.button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-black/[0.15] text-black hover:bg-black/5 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-base font-normal">
                        {customer?.firstName || "My Account"}
                      </span>
                      <User className="w-5 h-5" />
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
                            className="absolute right-0 top-full mt-2 w-56 bg-white border border-black/[0.12] rounded-xl shadow-lg z-50"
                          >
                            <div className="px-4 py-3 border-b border-black/[0.12]">
                              <p className="text-sm font-medium text-black truncate">
                                {customer?.firstName} {customer?.lastName}
                              </p>
                              <p className="text-xs text-black/60 truncate">
                                {customer?.email}
                              </p>
                            </div>
                            <div className="py-2">
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  href="/account"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                >
                                  <User className="w-4 h-4" />
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
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                >
                                  <Package className="w-4 h-4" />
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
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                                >
                                  <MapPin className="w-4 h-4" />
                                  Addresses
                                </Link>
                              </motion.div>
                            </div>
                            <div className="border-t border-black/[0.12] py-2">
                              <motion.button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-500 hover:bg-red-50 transition-colors"
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <LogOut className="w-4 h-4" />
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
                        className="hidden md:flex items-center gap-2.5 px-6 py-3 rounded-full border border-black/[0.15] text-black hover:bg-black/5 transition-all"
                      >
                        <motion.span
                          className="flex items-center gap-2.5"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-base font-normal">
                            My Account
                          </span>
                          <User className="w-5 h-5" />
                        </motion.span>
                      </Link>
                    </motion.div>
                  )
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.15] text-black hover:bg-black/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm font-medium">Menu</span>
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu - White Theme */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={mobileMenuVariants}
                className="md:hidden bg-white border-t border-black/[0.12] overflow-hidden"
              >
                <div className="px-4 py-4 space-y-1">
                  {navLinks.map((link, index) => {
                    // For home, exact match; for others, check if pathname starts with the link
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
                          className={`block px-4 py-3 text-base rounded-lg transition-colors ${
                            isActive
                              ? "text-black font-bold bg-black/5 underline underline-offset-4"
                              : "text-black/60 font-medium hover:text-black hover:bg-black/5"
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
                    className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                    {totalQuantity > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto px-2 py-0.5 text-xs font-bold bg-optimist-blue-primary text-white rounded-full"
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
                        className="h-px bg-black/10 my-2"
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
                          className="block px-4 py-3 text-base font-medium rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
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
                          className="block px-4 py-3 text-base font-medium rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
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
                        className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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
                        className="h-px bg-black/10 my-2"
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
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                        >
                          <User className="w-5 h-5" />
                          Login
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Cart Drawer */}
        <CartDrawer />
      </>
    );
  }

  // Dark header for landing page
  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-3xl backdrop-saturate-200 border-y border-white/[0.15] shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(255,255,255,0.08)] before:absolute before:inset-x-0 before:top-0 before:h-[50%] before:bg-gradient-to-b before:from-white/[0.12] before:to-transparent before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[50%] after:bg-gradient-to-t after:from-white/[0.06] after:to-transparent after:pointer-events-none"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-8 w-[325px]">
              {/* {navLinks.map((link, index) => {
                // For home, exact match; for others, check if pathname starts with the link
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
                      className={`relative text-base transition-colors ${
                        isActive
                          ? "text-[#FFFCDC] font-bold underline underline-offset-4"
                          : "text-[#FFFCDC]/60 font-medium hover:text-[#FFFCDC]"
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
              })} */}
            </div>

            {/* Left Logo - Mobile */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              className="md:hidden flex items-center"
            >
              <Link href="/" className="flex items-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={ASSETS.logo}
                    alt="Optimist"
                    width={120}
                    height={32}
                    className="h-6 w-auto"
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
              <Link href="/" className="flex items-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={ASSETS.logo}
                    alt="Optimist"
                    width={150}
                    height={40}
                    className="h-8 w-auto"
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 justify-end w-[325px]">
              {/* <motion.button
                custom={0}
                initial="hidden"
                animate="visible"
                variants={actionVariants}
                onClick={toggleCart}
                className="hidden md:flex items-center gap-2 text-[#FFFCDC] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base font-normal">Cart</span>
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
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
                        className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-optimist-blue-primary text-white rounded-full"
                      >
                        {totalQuantity > 99 ? "99+" : totalQuantity}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

          
              {isAuthenticated ? (
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={actionVariants}
                  className="relative hidden md:block"
                >
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#FFFCDC]/20 text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base font-normal">
                      {customer?.firstName || "My Account"}
                    </span>
                    <User className="w-5 h-5" />
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
                          className="absolute right-0 top-full mt-2 w-56 bg-black/60 backdrop-blur-3xl backdrop-saturate-200 border border-white/[0.15] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(255,255,255,0.08)] z-50"
                        >
                          <div className="px-4 py-3 border-b border-[#FFFCDC]/20">
                            <p className="text-sm font-medium text-[#FFFCDC] truncate">
                              {customer?.firstName} {customer?.lastName}
                            </p>
                            <p className="text-xs text-[#FFFCDC]/60 truncate">
                              {customer?.email}
                            </p>
                          </div>
                          <div className="py-2">
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                href="/account"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                              >
                                <User className="w-4 h-4" />
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
                                className="flex items-center gap-3 px-4 py-2 text-sm text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                              >
                                <Package className="w-4 h-4" />
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
                                className="flex items-center gap-3 px-4 py-2 text-sm text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                              >
                                <MapPin className="w-4 h-4" />
                                Addresses
                              </Link>
                            </motion.div>
                          </div>
                          <div className="border-t border-[#FFFCDC]/20 py-2">
                            <motion.button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <LogOut className="w-4 h-4" />
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
                      className="hidden md:flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#FFFCDC]/20 text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-all"
                    >
                      <motion.span
                        className="flex items-center gap-2.5"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-base font-normal">My Account</span>
                        <User className="w-5 h-5" />
                      </motion.span>
                    </Link>
                  </motion.div>
                )
              )}

          
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFFCDC]/20 text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm font-medium">Menu</span>
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button> */}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Dark Theme */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="md:hidden bg-black/50 backdrop-blur-3xl backdrop-saturate-200 border-t border-white/[0.12] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, index) => {
                  // For home, exact match; for others, check if pathname starts with the link
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
                        className={`block px-4 py-3 text-base rounded-lg transition-colors ${
                          isActive
                            ? "text-[#FFFCDC] font-bold bg-[#FFFCDC]/5 underline underline-offset-4"
                            : "text-[#FFFCDC]/60 font-medium hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5"
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
                  className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                  {totalQuantity > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto px-2 py-0.5 text-xs font-bold bg-optimist-blue-primary text-white rounded-full"
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
                      className="h-px bg-[#FFFCDC]/10 my-2"
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
                        className="block px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
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
                        className="block px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
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
                      className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
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
                      className="h-px bg-[#FFFCDC]/10 my-2"
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
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]/60 hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Login
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default Navigation;
