"use client";

import { ReactNode, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UserCircle, MapPin, Package } from "lucide-react";
import { useState } from "react";
import AccountSidebar from "./AccountSidebar";
import ASSETS from "@/lib/assets";

interface AccountLayoutProps {
  children: ReactNode;
  activeTab: "profile" | "addresses" | "orders";
  customerName?: string;
}

// Mobile tab configuration
const mobileTabs = [
  {
    id: "profile" as const,
    label: "Profile",
    href: "/account",
    icon: UserCircle,
  },
  {
    id: "addresses" as const,
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    id: "orders" as const,
    label: "Orders",
    href: "/account/orders",
    icon: Package,
  },
];

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AccountLayout({
  children,
  activeTab,
  customerName = "User",
}: AccountLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-28">
      {/* Header Banner - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-[120px] sm:h-[160px] lg:h-[200px] w-full overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(175.684deg, #1265FF 23.025%, #69CDEB 77.173%, #46F5A0 106.14%)",
        }}
      >
        {/* Banner Text */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute left-[16px] sm:left-[24px] lg:left-[80px] top-1/2 -translate-y-1/2 font-display font-bold text-[24px] sm:text-[32px] lg:text-[48px] text-white leading-[1.15] max-w-[180px] sm:max-w-[260px] lg:max-w-[450px]"
        >
          The weather&apos;s in good hands.
        </motion.p>

        {/* Decorative Star Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-[16px] sm:right-[40px] lg:right-[80px] top-1/2 -translate-y-1/2 w-[90px] sm:w-[130px] lg:w-[180px] h-[90px] sm:h-[130px] lg:h-[180px]"
        >
          <Image
            src={ASSETS.clipPathGroup}
            alt="Decorative"
            width={180}
            height={180}
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Mobile Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="lg:hidden flex items-center gap-2 px-4 sm:px-6 py-4 overflow-x-auto scrollbar-hide"
      >
        {mobileTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[rgba(52,120,246,0.1)] border border-[rgba(52,120,246,0.3)]"
                  : "bg-[#F5F5F5] border border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-[#3478F6]" : "text-[#737373]"
                }`}
              />
              <span
                className={`text-[14px] font-medium ${
                  isActive ? "text-[#3478F6]" : "text-[#737373]"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </motion.div>

      {/* Main Content Area */}
      <div className="relative flex px-4 sm:px-6 lg:px-20">
        {/* Mobile Menu Toggle - Full Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#3478F6] text-white shadow-lg flex items-center justify-center hover:bg-[#2563eb] transition-colors"
          style={{
            boxShadow: "0 4px 20px rgba(52, 120, 246, 0.4)",
          }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - Desktop */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block w-[260px] xl:w-[300px] min-h-[calc(100vh-230px)] border-r border-[#E5E5E5] pr-6 xl:pr-8 py-10 flex-shrink-0"
        >
          <AccountSidebar
            activeTab={activeTab}
            customerName={customerName}
            onTabClick={() => {}}
          />
        </motion.aside>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 px-4 py-6 shadow-xl overflow-y-auto"
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5]">
                <span className="text-[18px] font-semibold text-[#0A0A0A]">
                  Account Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#737373]" />
                </button>
              </div>
              <AccountSidebar
                activeTab={activeTab}
                customerName={customerName}
                onTabClick={() => setIsMobileMenuOpen(false)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 pl-0 lg:pl-8 xl:pl-12 py-6 lg:py-10 w-full max-w-full lg:max-w-[900px]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
