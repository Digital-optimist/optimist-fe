"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import ASSETS from "@/lib/assets";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
};

const dropIn = {
  initial: { opacity: 0, y: -50, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const gridCellVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() * 0.8,
      duration: 0.4,
    },
  }),
};

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, register } = useAuth();
  const { showToast } = useToast();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, authLoading, router]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await register(email, password, firstName.trim(), lastName.trim());
      showToast("Account created successfully!", "success");
      router.push("/account");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setErrors({ general: message });
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 border-3 border-[#3478F6]/20 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-3 border-transparent border-t-[#3478F6] rounded-full animate-spin" />
          </div>
          <p className="text-[#737373] text-sm animate-pulse">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Section - Product Showcase (Desktop Only) */}
      <div className="hidden lg:block lg:w-[55%] p-[50px_0_40px_50px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col py-[5%] justify-center h-full rounded-[44px] relative overflow-hidden"
          style={{
            minHeight: "calc(100vh - 100px)",
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${ASSETS.desktopMobileGradient}')`,
            }}
          />

          <div className="flex flex-col gap-5 mx-auto justify-center">
            {/* Logo */}
            <motion.div
              variants={dropIn}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              <Image
                src="/icons/optimist-logo.svg"
                alt="Optimist"
                width={52}
                height={73}
                className="brightness-0 invert mx-auto"
              />
            </motion.div>

            {/* Titles */}
            <div className="flex flex-col text-center z-[10]">
              <motion.h1
                variants={fadeInLeft}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.7, delay: 0.3 }}
                className="font-display font-bold leading-none"
                style={{ fontSize: "72px", color: "#FFFCDC" }}
              >
                Cools more.
              </motion.h1>
              <motion.h1
                variants={fadeInRight}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.7, delay: 0.4 }}
                className="font-display font-bold leading-none mt-2"
                style={{ fontSize: "72px", color: "#FFFCDC" }}
              >
                Uses less.
              </motion.h1>
            </div>
          </div>

          {/* AC Image with float animation */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="rounded-[24px] w-[80%] z-[10] h-[220px] mx-auto"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={ASSETS.heroAc}
                alt="Optimist AC"
                width={686}
                height={184}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Badges */}
          <motion.div
            className="flex flex-row gap-5 items-center mx-auto z-[10]"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* ISEER Badge */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-[9px] backdrop-blur-[1.5px] rounded-[20px]"
            >
              <Image
                src={ASSETS.fiveStarRating}
                alt="ISEER Rating"
                width={69}
                height={55}
                className="object-contain"
              />
              <div
                className="flex flex-col gap-[9px]"
                style={{ color: "#FFFFFF" }}
              >
                <span className="font-display font-bold text-[25px] leading-none">
                  Highest ISEER
                </span>
                <span className="font-display text-[19px] leading-none">
                  In India
                </span>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="h-[55px] w-px bg-white/30"
            />

            {/* Rating Badge */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-[9px] backdrop-blur-[1.5px] rounded-[20px]"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.4588 9.26612L16.24 12.9064L17.5253 18.3505C17.5962 18.646 17.578 18.9559 17.4729 19.2411C17.3677 19.5263 17.1804 19.7739 16.9346 19.9526C16.6889 20.1314 16.3956 20.2333 16.0919 20.2455C15.7883 20.2577 15.4878 20.1796 15.2285 20.0211L10.4941 17.1074L5.7569 20.0211C5.49761 20.1787 5.19749 20.256 4.89434 20.2434C4.59118 20.2308 4.29854 20.1287 4.05327 19.9501C3.808 19.7715 3.62106 19.5243 3.51599 19.2396C3.41093 18.955 3.39243 18.6456 3.46283 18.3505L4.75283 12.9064L0.534082 9.26612C0.304674 9.06785 0.138762 8.80639 0.0570658 8.51438C-0.0246303 8.22238 -0.0184894 7.91278 0.0747213 7.62425C0.167932 7.33571 0.344082 7.08103 0.581172 6.89202C0.818262 6.703 1.10578 6.58802 1.40783 6.56143L6.93908 6.11518L9.07283 0.951432C9.18833 0.670011 9.3849 0.42929 9.63755 0.259874C9.89021 0.0904583 10.1875 0 10.4917 0C10.7959 0 11.0933 0.0904583 11.3459 0.259874C11.5986 0.42929 11.7951 0.670011 11.9106 0.951432L14.0435 6.11518L19.5747 6.56143C19.8774 6.58703 20.1657 6.70137 20.4037 6.89013C20.6416 7.07888 20.8186 7.33366 20.9124 7.62255C21.0062 7.91143 21.0126 8.22157 20.9309 8.5141C20.8492 8.80664 20.683 9.06856 20.4531 9.26706L20.4588 9.26612Z"
                  fill="#F8D300"
                />
              </svg>

              <div
                className="flex flex-col gap-[9px]"
                style={{ color: "#FFFFFF" }}
              >
                <span className="font-display font-bold text-[25px] leading-none">
                  4.8 rated
                </span>
                <span className="font-display text-[19px] leading-none">
                  by early users
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className="flex-1 flex flex-col min-h-screen relative bg-white">
        {/* Mobile Header with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:hidden relative"
        >
          <div className="h-[221px] w-full rounded-bl-[22px] rounded-br-[22px] relative overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${ASSETS.loginMobileGradient}')`,
              }}
            />

            {/* Logo */}
            <div className="absolute top-[84px] left-1/2 -translate-x-1/2">
              <Image
                src="/icons/optimist-logo.svg"
                alt="Optimist"
                width={26}
                height={36}
                className="brightness-0 invert opacity-90"
              />
            </div>

            {/* Title */}
            <div className="absolute top-[129px] left-1/2 -translate-x-1/2 text-center w-full px-4">
              <h1 className="font-display font-semibold text-[32px] text-[#FFFCDC] leading-[1.25] tracking-[-0.64px]">
                Create your account
              </h1>
              <p className="font-display text-[16px] text-[#FFFCDC]/60 leading-[1.5] tracking-[0.32px] mt-1">
                Join the Optimist family
              </p>
            </div>
          </div>
        </motion.div>

        {/* Desktop Pattern Background */}
        <div className="hidden lg:block absolute top-0 right-0 w-[80%] h-[520px] overflow-hidden z-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(4)].map((_, rowIdx) => (
              <div key={rowIdx} className="flex">
                {[...Array(8)].map((_, colIdx) => {
                  const isBlue =
                    (rowIdx === 0 && (colIdx === 0 || colIdx === 4)) ||
                    (rowIdx === 1 && colIdx === 2) ||
                    (rowIdx === 2 && colIdx === 5) ||
                    (rowIdx === 3 && colIdx === 2);
                  return (
                    <motion.div
                      key={colIdx}
                      custom={rowIdx * 8 + colIdx}
                      variants={gridCellVariants}
                      initial="initial"
                      animate="animate"
                      className={`w-[97px] h-[97px] rounded-[12px] ${
                        isBlue
                          ? "border-2 border-[rgba(52,120,246,0.5)] bg-gradient-to-b from-[rgba(52,120,246,0.25)] to-transparent"
                          : "border border-[#E5E5E5] bg-white"
                      }`}
                      style={
                        isBlue
                          ? {
                              animation: "pulse-glow 2s ease-in-out infinite",
                              animationDelay: `${colIdx * 0.3}s`,
                            }
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 28%, transparent 0%, white 46%)",
            }}
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0 relative z-10">
          <motion.div
            className="w-full max-w-[454px]"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Desktop Title */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="hidden lg:block text-center mb-8"
            >
              <h1
                className="font-semibold text-[32px] leading-[1.25] tracking-[-0.64px]"
                style={{ color: "#0A0A0A" }}
              >
                Create your <span style={{ color: "#3478F6" }}>account</span>
              </h1>
              <p
                className="text-[16px] leading-[1.5] tracking-[0.32px] mt-4"
                style={{ color: "#737373" }}
              >
                Join the Optimist family
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
                  >
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name Fields */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                {/* First Name */}
                <div>
                  <label className="block text-[14px] text-[#525252] leading-[1.5] tracking-[0.28px] mb-1">
                    First Name
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className={`flex items-center gap-3 h-[48px] px-3 rounded-[8px] border transition-all duration-300 ${
                      errors.firstName
                        ? "border-red-500 bg-white"
                        : "border-[#E5E5E5] bg-white hover:border-[#A3A3A3] focus-within:border-[#3478F6] focus-within:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)]"
                    }`}
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <User className="w-5 h-5 text-[#737373] shrink-0" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="flex-1 text-[14px] lg:text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] leading-[1.5] tracking-[0.28px] lg:tracking-[0.32px] bg-transparent outline-none"
                      disabled={isSubmitting}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {errors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.firstName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-[14px] text-[#525252] leading-[1.5] tracking-[0.28px] mb-1">
                    Last Name
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className={`flex items-center gap-3 h-[48px] px-3 rounded-[8px] border transition-all duration-300 ${
                      errors.lastName
                        ? "border-red-500 bg-white"
                        : "border-[#E5E5E5] bg-white hover:border-[#A3A3A3] focus-within:border-[#3478F6] focus-within:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)]"
                    }`}
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <User className="w-5 h-5 text-[#737373] shrink-0" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="flex-1 text-[14px] lg:text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] leading-[1.5] tracking-[0.28px] lg:tracking-[0.32px] bg-transparent outline-none"
                      disabled={isSubmitting}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {errors.lastName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.lastName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                <label className="block text-[14px] text-[#525252] leading-[1.5] tracking-[0.28px] mb-1">
                  Email
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className={`flex items-center gap-3 h-[48px] px-3 rounded-[8px] border transition-all duration-300 ${
                    errors.email
                      ? "border-red-500 bg-white"
                      : "border-[#E5E5E5] bg-white hover:border-[#A3A3A3] focus-within:border-[#3478F6] focus-within:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)]"
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Mail className="w-5 h-5 text-[#737373] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johnyenglish@gmail.com"
                    className="flex-1 text-[14px] lg:text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] leading-[1.5] tracking-[0.28px] lg:tracking-[0.32px] bg-transparent outline-none"
                    disabled={isSubmitting}
                  />
                </motion.div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                <label className="block text-[14px] text-[#525252] leading-[1.5] tracking-[0.28px] mb-1">
                  Password
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className={`flex items-center gap-3 h-[48px] px-3 rounded-[8px] border transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 bg-white"
                      : "border-[#E5E5E5] bg-white hover:border-[#A3A3A3] focus-within:border-[#3478F6] focus-within:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)]"
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Lock className="w-5 h-5 text-[#737373] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="flex-1 text-[14px] lg:text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] leading-[1.5] tracking-[0.28px] lg:tracking-[0.32px] bg-transparent outline-none"
                    disabled={isSubmitting}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#737373] hover:text-[#525252] transition-colors shrink-0"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </motion.button>
                </motion.div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                <label className="block text-[14px] text-[#525252] leading-[1.5] tracking-[0.28px] mb-1">
                  Confirm Password
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className={`flex items-center gap-3 h-[48px] px-3 rounded-[8px] border transition-all duration-300 ${
                    errors.confirmPassword
                      ? "border-red-500 bg-white"
                      : "border-[#E5E5E5] bg-white hover:border-[#A3A3A3] focus-within:border-[#3478F6] focus-within:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)]"
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Lock className="w-5 h-5 text-[#737373] shrink-0" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="flex-1 text-[14px] lg:text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] leading-[1.5] tracking-[0.28px] lg:tracking-[0.32px] bg-transparent outline-none"
                    disabled={isSubmitting}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#737373] hover:text-[#525252] transition-colors shrink-0"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </motion.button>
                </motion.div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Create Account Button */}
              <motion.button
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                type="submit"
                disabled={isSubmitting}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -10px rgba(52, 120, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-[48px] lg:h-[52px] rounded-[36px] flex items-center justify-center text-[#FFFCDC] font-display font-semibold text-[14px] lg:text-[16px] leading-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                  boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </motion.button>

              {/* Divider */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#E5E5E5" }}
                />
                <span
                  className="text-[12px] lg:text-[16px] leading-[1.5] tracking-[0.24px] lg:tracking-[0.32px]"
                  style={{ color: "#737373" }}
                >
                  Or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#E5E5E5" }}
                />
              </motion.div>

              {/* Sign In Link */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p
                  className="text-[14px] lg:text-[16px] leading-[1.5] tracking-[0.28px] lg:tracking-[0.32px]"
                  style={{ color: "#737373" }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold underline decoration-solid transition-all duration-300 hover:text-[#1265FF]"
                    style={{ color: "#3478F6" }}
                  >
                    Sign In
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
