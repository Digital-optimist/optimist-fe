"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Paperclip, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { submitContactForm } from "@/lib/shopify";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types & Constants
// =============================================================================

type ContactReason =
  | "service_support"
  | "warranty"
  | "orders"
  | "product_enquiry"
  | "bulk_enquiry"
  | "feedback";

interface FormData {
  reason: ContactReason | "";
  fullName: string;
  mobileNumber: string;
  email: string;
  cityPincode: string;
  serialNumber: string;
  orderId: string;
  message: string;
  attachedFile: File | null;
  consent: boolean;
}

interface FormErrors {
  reason?: string;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  cityPincode?: string;
  message?: string;
  consent?: string;
  general?: string;
}

const CONTACT_REASONS: { value: ContactReason; label: string }[] = [
  { value: "service_support", label: "Service Support" },
  { value: "warranty", label: "Warranty" },
  { value: "orders", label: "Orders" },
  { value: "product_enquiry", label: "Product Enquiry" },
  { value: "bulk_enquiry", label: "Bulk Enquiry" },
  { value: "feedback", label: "Feedback" },
];

// Reasons that require serial number field
const SERIAL_NUMBER_REASONS: ContactReason[] = [
  "service_support",
  "warranty",
  "orders",
];

// Reasons that require order ID field
const ORDER_ID_REASONS: ContactReason[] = ["orders"];

// =============================================================================
// Success Modal Component
// =============================================================================

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-3xl p-6 sm:p-8 md:p-12 w-full max-w-[450px] sm:max-w-[520px] flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Check Circle Icon */}
            <motion.div
              className="w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-full bg-[#3478F6] flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4,
                    ease: "easeOut",
                  }}
                />
              </svg>
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="flex flex-col gap-2 text-center text-[#212121]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <h2 className="font-display text-2xl sm:text-3xl md:text-[40px] font-bold leading-none">
                Message sent!
              </h2>
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                We&apos;ll get back to you soon
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// Custom Dropdown Component
// =============================================================================

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-white border rounded-lg text-left flex items-center justify-between transition-all ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                option.value === value
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// File Upload Component
// =============================================================================

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

function FileUpload({ file, onFileChange, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      onFileChange(selectedFile);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
        disabled={disabled}
      />

      {file ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <Paperclip className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700 truncate flex-1">
            {file.name}
          </span>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Paperclip className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-blue-500 font-medium">
            Attach image
          </span>
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Contact Form Component
// =============================================================================

interface ContactFormProps {
  onSuccess: () => void;
}

function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    reason: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    cityPincode: "",
    serialNumber: "",
    orderId: "",
    message: "",
    attachedFile: null,
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if conditional fields should be shown
  const showSerialNumber =
    formData.reason &&
    SERIAL_NUMBER_REASONS.includes(formData.reason as ContactReason);
  const showOrderId =
    formData.reason &&
    ORDER_ID_REASONS.includes(formData.reason as ContactReason);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.reason) {
      newErrors.reason = "Please select a reason for contact";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.cityPincode.trim()) {
      newErrors.cityPincode = "City/Pincode is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    if (!formData.consent) {
      newErrors.consent = "Please agree to be contacted";
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
      // Get reason label for submission
      const reasonLabel =
        CONTACT_REASONS.find((r) => r.value === formData.reason)?.label ||
        formData.reason;

      // Submit to Google Sheets (with optional file upload to Google Drive)
      const result = await submitContactForm({
        reason: reasonLabel,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email || undefined,
        cityPincode: formData.cityPincode,
        serialNumber: formData.serialNumber || undefined,
        orderId: formData.orderId || undefined,
        message: formData.message,
        attachedFile: formData.attachedFile,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit form");
      }

      // On success - call the callback and reset form
      onSuccess();

      // Reset form
      setFormData({
        reason: "",
        fullName: "",
        mobileNumber: "",
        email: "",
        cityPincode: "",
        serialNumber: "",
        orderId: "",
        message: "",
        attachedFile: null,
        consent: false,
      });
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.reason &&
    formData.fullName &&
    formData.mobileNumber &&
    formData.cityPincode &&
    formData.message &&
    formData.consent;

  return (
    <form onSubmit={handleSubmit} className="">
      {/* General Error */}
      {errors.general && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.fullName
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number<span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="flex items-center px-4 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
              <span className="text-gray-600 font-medium">+91</span>
            </div>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                updateField("mobileNumber", value);
              }}
              placeholder="Enter 10-digit mobile number"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 bg-white border rounded-r-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
                errors.mobileNumber
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.mobileNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
          )}
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address{" "}
            <span className="text-gray-400 font-normal">(recommended)</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@company.com"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* City / Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.cityPincode}
            onChange={(e) => updateField("cityPincode", e.target.value)}
            placeholder="Enter your city"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.cityPincode
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          {errors.cityPincode && (
            <p className="mt-1 text-sm text-red-500">{errors.cityPincode}</p>
          )}
        </div>

        {/* Reason for Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Reason to contact<span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={formData.reason}
            onChange={(value) => updateField("reason", value as ContactReason)}
            options={CONTACT_REASONS}
            placeholder="Select reason"
            error={errors.reason}
            disabled={isSubmitting}
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
          )}
        </div>

        {/* Product Serial Number (Conditional) */}
        {showSerialNumber && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Serial Number{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => updateField("serialNumber", e.target.value)}
              placeholder="Enter serial number"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Order ID (Conditional) */}
        {showOrderId && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Order ID{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.orderId}
              onChange={(e) => updateField("orderId", e.target.value)}
              placeholder="Enter your order ID"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Message<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Briefly describe your request"
              rows={4}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.message
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
            <div className="absolute bottom-[14px] right-2">
              <FileUpload
                file={formData.attachedFile}
                onFileChange={(file) => updateField("attachedFile", file)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
                disabled={isSubmitting}
                className="sr-only peer"
              />
              <div
                className={`w-5 h-5 border-2 rounded-md transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500 ${
                  errors.consent ? "border-red-400" : "border-gray-300"
                } group-hover:border-gray-400 peer-disabled:opacity-60`}
              />
              <svg
                className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-gray-600 text-sm leading-relaxed">
              You agree to our friendly privacy policy.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-sm text-red-500 ml-8">{errors.consent}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full py-3.5 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-all ${
            isFormValid && !isSubmitting
              ? "bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
              : "bg-blue-400/50 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send message"
          )}
        </button>
      </div>
    </form>
  );
}

// =============================================================================
// Main Contact Page
// =============================================================================

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFormSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Animate left content
      tl.fromTo(
        leftContentRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8 },
      );

      // Animate form
      tl.fromTo(
        formRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8 },
        "-=0.6",
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#f5f5f5] pt-24 md:pt-28 lg:pt-32 pb-16 px-2 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main white container card */}
        <div className="bg-white rounded-[32px] p-8 px-4  md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Column - Heading & Info */}
            <div ref={leftContentRef} className="lg:sticky lg:top-32">
              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-blue-500">Get in touch</span>
                <br />
                <span className="text-gray-900">with our team</span>
              </h1>

              {/* Subtext */}
              <p className="text-gray-600 text-lg mb-12 max-w-md">
                Use the contact form to get in touch or email us at{" "}
                <a
                  href="mailto:support@optimist.in"
                  className="text-blue-500 font-medium hover:underline"
                >
                  support@optimist.in
                </a>
                . We'll get back to you asap.
              </p>

              {/* Trust Badge Card */}
              <div className="hidden lg:block">
                <div className="relative w-full max-w-md h-[400px] rounded-3xl overflow-hidden bg-blue-500/10">
                  {/* Text Overlay */}
                  <div className="absolute top-8 left-6 z-10">
                    <p className="text-4xl font-bold text-black/20 leading-tight">
                      Trusted by
                      <br />
                      2Cr+ people
                    </p>
                  </div>

                  {/* Image */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <Image
                      src={ASSETS.sleepingWoman}
                      alt="Happy customer"
                      width={432}
                      height={300}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div ref={formRef}>
              <ContactForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - rendered at page level for proper centering */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />
    </div>
  );
}
