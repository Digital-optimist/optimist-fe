"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import {
  submitFeedbackForm,
  type FeedbackFormRatings,
} from "@/lib/shopify";
import { useToast } from "@/components/ui/Toast";
import { StarRating } from "./StarRating";

// =============================================================================
// Types & Constants
// =============================================================================

type Step = "intro" | "delivery" | "installation" | "comments" | "success";

interface FeedbackErrors {
  phone?: string;
  delivery?: string;
  installation?: string;
  general?: string;
}

const PHONE_REGEX = /^[6-9]\d{9}$/;

const INITIAL_RATINGS: FeedbackFormRatings = {
  deliveryOnTime: 0,
  packagingCondition: 0,
  deliveryOverall: 0,
  installationOnTime: 0,
  installationProfessional: 0,
  installationNeat: 0,
  technicianExplained: 0,
  installationOverall: 0,
};

const DELIVERY_QUESTIONS: {
  key: keyof FeedbackFormRatings;
  label: string;
}[] = [
  { key: "deliveryOnTime", label: "Was the AC delivered on time?" },
  { key: "packagingCondition", label: "Was the AC packaging in good condition?" },
  { key: "deliveryOverall", label: "How was your overall delivery experience?" },
];

const INSTALLATION_QUESTIONS: {
  key: keyof FeedbackFormRatings;
  label: string;
}[] = [
  { key: "installationOnTime", label: "Did the installation start on time?" },
  {
    key: "installationProfessional",
    label: "How professional was the installation team?",
  },
  {
    key: "installationNeat",
    label: "Was the installation done neatly and properly?",
  },
  {
    key: "technicianExplained",
    label: "Did the technician explain the AC, remote and app clearly?",
  },
  {
    key: "installationOverall",
    label: "How was your overall installation experience?",
  },
];

const stepTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

// =============================================================================
// Page
// =============================================================================

export default function FeedbackFormClient() {
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [phone, setPhone] = useState("");
  const [ratings, setRatings] = useState<FeedbackFormRatings>(INITIAL_RATINGS);
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setRating = (key: keyof FeedbackFormRatings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      delivery: undefined,
      installation: undefined,
    }));
  };

  const deliveryComplete = DELIVERY_QUESTIONS.every((q) => ratings[q.key] > 0);
  const installationComplete = INSTALLATION_QUESTIONS.every(
    (q) => ratings[q.key] > 0,
  );

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.trim();
    if (!PHONE_REGEX.test(clean)) {
      setErrors({ phone: "Please enter a valid 10-digit Indian mobile number" });
      return;
    }
    setErrors({});
    setCurrentStep("delivery");
  };

  const handleDeliveryNext = () => {
    if (!deliveryComplete) {
      setErrors({ delivery: "Please rate all three questions to continue" });
      return;
    }
    setErrors({});
    setCurrentStep("installation");
  };

  const handleInstallationNext = () => {
    if (!installationComplete) {
      setErrors({ installation: "Please rate all five questions to continue" });
      return;
    }
    setErrors({});
    setCurrentStep("comments");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await submitFeedbackForm({
        phone,
        ratings,
        comments: comments.trim(),
      });
      if (!result.success) {
        setErrors({ general: result.error || "Failed to submit feedback" });
        showToast(result.error || "Failed to submit feedback", "error");
        return;
      }
      setCurrentStep("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrors({ general: message });
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep === "delivery") setCurrentStep("intro");
    else if (currentStep === "installation") setCurrentStep("delivery");
    else if (currentStep === "comments") setCurrentStep("installation");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Back link (hidden on intro + success) */}
        <AnimatePresence>
          {currentStep !== "intro" && currentStep !== "success" && (
            <motion.button
              type="button"
              onClick={handleBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 text-[14px] text-[#737373] hover:text-[#0A0A0A] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentStep === "intro" && (
            <motion.section
              key="intro"
              variants={stepTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h1
                className="font-display font-bold text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.15] tracking-[-0.5px]"
                style={{ color: "#0A0A0A" }}
              >
                Thank you for choosing{" "}
                <span style={{ color: "#3478F6" }}>Optimist.</span>
              </h1>
              <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.6] text-[#525252] max-w-xl">
                We&apos;d love your quick feedback on delivery and installation
                experience so we can continuously improve. This form takes about
                2 minutes.
              </p>

              <form onSubmit={handleStart} className="mt-8 space-y-2 max-w-md">
                <label
                  htmlFor="phone"
                  className="block text-[14px] font-medium text-[#525252] tracking-[0.28px]"
                >
                  Your phone number<span className="text-[#3478F6]"> *</span>
                </label>
                <div
                  className={`flex items-center h-[52px] rounded-[10px] border transition-all duration-200 bg-white ${
                    errors.phone
                      ? "border-red-500"
                      : "border-[#E5E5E5] hover:border-[#A3A3A3] focus-within:border-[#3478F6] focus-within:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)]"
                  }`}
                >
                  <span className="pl-4 pr-2 text-[15px] text-[#737373] border-r border-[#E5E5E5] mr-3 h-full flex items-center">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      if (errors.phone) setErrors({});
                    }}
                    placeholder="9876543210"
                    autoComplete="tel-national"
                    className="flex-1 h-full text-[15px] text-[#0A0A0A] placeholder-[#A3A3A3] bg-transparent outline-none pr-4"
                  />
                </div>
                <AnimatePresence>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] text-red-500"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <PrimaryButton type="submit">
                    Start
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </div>
              </form>
            </motion.section>
          )}

          {currentStep === "delivery" && (
            <motion.section
              key="delivery"
              variants={stepTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2
                className="font-display font-bold text-[24px] sm:text-[30px] leading-[1.2] tracking-[-0.3px]"
                style={{ color: "#0A0A0A" }}
              >
                Delivery{" "}
                <span className="text-[#737373] font-normal text-[18px] sm:text-[22px]">
                  (Page 1/3)
                </span>
              </h2>

              <div className="mt-8 space-y-8">
                {DELIVERY_QUESTIONS.map((q) => (
                  <Question
                    key={q.key}
                    label={q.label}
                    value={ratings[q.key]}
                    onChange={(v) => setRating(q.key, v)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              <AnimatePresence>
                {errors.delivery && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 text-[13px] text-red-500"
                  >
                    {errors.delivery}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-10">
                <PrimaryButton
                  type="button"
                  onClick={handleDeliveryNext}
                  disabled={!deliveryComplete}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
              </div>
            </motion.section>
          )}

          {currentStep === "installation" && (
            <motion.section
              key="installation"
              variants={stepTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2
                className="font-display font-bold text-[24px] sm:text-[30px] leading-[1.2] tracking-[-0.3px]"
                style={{ color: "#0A0A0A" }}
              >
                Installation{" "}
                <span className="text-[#737373] font-normal text-[18px] sm:text-[22px]">
                  (Page 2/3)
                </span>
              </h2>

              <div className="mt-8 space-y-8">
                {INSTALLATION_QUESTIONS.map((q) => (
                  <Question
                    key={q.key}
                    label={q.label}
                    value={ratings[q.key]}
                    onChange={(v) => setRating(q.key, v)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              <AnimatePresence>
                {errors.installation && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 text-[13px] text-red-500"
                  >
                    {errors.installation}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-10">
                <PrimaryButton
                  type="button"
                  onClick={handleInstallationNext}
                  disabled={!installationComplete}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
              </div>
            </motion.section>
          )}

          {currentStep === "comments" && (
            <motion.section
              key="comments"
              variants={stepTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2
                className="font-display font-bold text-[24px] sm:text-[30px] leading-[1.2] tracking-[-0.3px]"
                style={{ color: "#0A0A0A" }}
              >
                Anything we could have done better?{" "}
                <span className="text-[#737373] font-normal text-[18px] sm:text-[22px]">
                  (Page 3/3)
                </span>
              </h2>

              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={isSubmitting}
                maxLength={1000}
                placeholder="Share any details that could help us serve you better (optional)"
                rows={5}
                className="mt-6 w-full px-4 py-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[15px] text-[#0A0A0A] placeholder-[#A3A3A3] resize-y leading-[1.5] outline-none transition-all duration-200 hover:border-[#A3A3A3] focus:border-[#3478F6] focus:shadow-[0_4px_20px_-5px_rgba(52,120,246,0.25)] disabled:opacity-60"
              />
              <div className="mt-1 text-right text-[12px] text-[#A3A3A3]">
                {comments.length}/1000
              </div>

              <AnimatePresence>
                {errors.general && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-[13px] text-red-500"
                  >
                    {errors.general}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-8">
                <PrimaryButton
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </PrimaryButton>
              </div>
            </motion.section>
          )}

          {currentStep === "success" && (
            <motion.section
              key="success"
              variants={stepTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3478F6] flex items-center justify-center mb-6"
              >
                <Check
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  strokeWidth={3}
                />
              </motion.div>
              <h2
                className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.2] tracking-[-0.4px]"
                style={{ color: "#0A0A0A" }}
              >
                Your response has been recorded.
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.6] text-[#525252] max-w-xl">
                Our team reviews every delivery and installation experience
                carefully so we can keep improving Optimist service.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function Question({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const labelId = useId();
  return (
    <div>
      <p
        id={labelId}
        className="text-[15px] sm:text-[16px] leading-[1.5] text-[#0A0A0A] mb-3"
      >
        {label}
        <span className="text-[#3478F6]" aria-hidden="true">
          {" "}
          *
        </span>
      </p>
      <StarRating
        value={value}
        onChange={onChange}
        disabled={disabled}
        labelledBy={labelId}
      />
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0 10px 30px -10px rgba(52, 120, 246, 0.5)",
            }
      }
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className="inline-flex items-center justify-center gap-2 h-[48px] px-7 rounded-[36px] text-[#FFFCDC] font-display font-semibold text-[15px] leading-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background:
          "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
        boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
      }}
    >
      {children}
    </motion.button>
  );
}
