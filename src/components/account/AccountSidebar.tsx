"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserCircle, MapPin, Package, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface AccountSidebarProps {
  activeTab: "profile" | "addresses" | "orders";
  customerName: string;
  onTabClick?: () => void;
}

const tabs = [
  {
    id: "profile" as const,
    label: "Profile information",
    href: "/account",
    icon: UserCircle,
  },
  {
    id: "addresses" as const,
    label: "Manage addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    id: "orders" as const,
    label: "Past orders",
    href: "/account/orders",
    icon: Package,
  },
];

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const tabVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  hover: { x: 4 },
  tap: { scale: 0.98 },
};

export default function AccountSidebar({
  activeTab,
  customerName,
  onTabClick,
}: AccountSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-8"
    >
      {/* User Greeting */}
      <motion.div
        variants={fadeInUp}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <motion.p 
          className="font-display text-[20px] lg:text-[24px] text-black leading-none"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Hello,
        </motion.p>
        <motion.p 
          className="font-display font-bold text-[28px] lg:text-[36px] text-black leading-none"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {customerName}
        </motion.p>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.nav variants={fadeInUp} className="flex flex-col gap-3">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.div
              key={tab.id}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              whileHover={!isActive ? "hover" : undefined}
              whileTap="tap"
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={tab.href}
                onClick={onTabClick}
                className={`flex items-center gap-3 h-[54px] px-4 rounded-[33px] transition-all duration-200 ${
                  isActive
                    ? "bg-[rgba(52,120,246,0.08)] border border-[rgba(52,120,246,0.2)]"
                    : "hover:bg-[rgba(0,0,0,0.03)] border border-transparent"
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-[#3478F6]" : "text-[#737373]"
                  }`}
                />
                <span
                  className={`text-[16px] leading-[1.5] tracking-[0.32px] font-medium transition-colors ${
                    isActive ? "text-[#3478F6]" : "text-[#737373]"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Logout Button */}
      <motion.div 
        variants={fadeInUp} 
        className="mt-4 pt-4 border-t border-[#E5E5E5]"
      >
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4, backgroundColor: "rgba(220, 38, 38, 0.05)" }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-3 text-[#C31102] rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[16px] font-medium">Sign out</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
