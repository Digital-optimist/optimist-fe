"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { AccountLayout } from "@/components/account";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

// Validation helpers
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) {
    return undefined; // Phone is optional
  }
  // Remove all non-digits for validation
  const digitsOnly = phone.replace(/\D/g, "");
  // Accept 10 digits (Indian mobile) or 10-15 digits with country code
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return "Please enter a valid phone number (10-15 digits)";
  }
  return undefined;
};

const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  if (name.trim().length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return undefined;
};

// Format phone number for display
const formatPhoneDisplay = (phone: string): string => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
};

export default function AccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Initialize form data from customer
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  // Validate form
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    
    newErrors.firstName = validateName(formData.firstName, "First name");
    newErrors.lastName = validateName(formData.lastName, "Last name");
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    
    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });
    
    return newErrors;
  }, [formData]);

  // Validate on blur
  const handleBlur = (field: keyof ProfileFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateForm();
    setErrors(validationErrors);
  };

  // Check if form has changes
  const hasChanges = useCallback((): boolean => {
    if (!customer) return false;
    return (
      formData.firstName !== (customer.firstName || "") ||
      formData.lastName !== (customer.lastName || "") ||
      formData.email !== (customer.email || "") ||
      formData.phone !== (customer.phone || "")
    );
  }, [customer, formData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setErrors({});
    setTouched({});
  };

  const handleCancelClick = () => {
    // Reset form data to original values
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });
    }
    setErrors({});
    setTouched({});
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    // Validate all fields
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    });

    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      showToast("Please fix the errors before saving", "error");
      return;
    }

    // Check if there are any changes
    if (!hasChanges()) {
      showToast("No changes to save", "info");
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      // Format phone number for Shopify (E.164 format)
      let formattedPhone = formData.phone;
      if (formattedPhone) {
        const digits = formattedPhone.replace(/\D/g, "");
        if (digits.length === 10) {
          formattedPhone = `+91${digits}`;
        } else if (digits.length === 12 && digits.startsWith("91")) {
          formattedPhone = `+${digits}`;
        } else if (!formattedPhone.startsWith("+")) {
          formattedPhone = `+${digits}`;
        }
      }

      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formattedPhone || undefined,
      });

      showToast("Profile updated successfully", "success");
      setIsEditing(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      showToast(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to show field error
  const getFieldError = (field: keyof FormErrors): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  if (isLoading) {
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

  if (!isAuthenticated || !customer) {
    return null;
  }

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  return (
    <AccountLayout
      activeTab="profile"
      customerName={customer.firstName || "User"}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5E5] gap-4"
        >
          <div>
            <h1 className="text-[24px] font-semibold text-[#0A0A0A] leading-[1.5]">
              Personal Info
            </h1>
            <p className="text-[16px] text-[#737373] leading-[1.5]">
              Update your personal details
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit-buttons"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={handleCancelClick}
                    disabled={isSaving}
                    className="px-4 py-3 rounded-full border border-[#E5E5E5] text-[#0A0A0A] text-[14px] font-medium hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className="px-4 py-3 rounded-full text-white text-[14px] font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                    style={{
                      background:
                        "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                      boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
                    }}
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save changes
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="view-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleEditClick}
                  className="px-4 py-3 rounded-full bg-white border border-[#E5E5E5] shadow-[0px_4px_8px_-5px_rgba(0,0,0,0.15)] text-[#3478F6] text-[14px] font-medium hover:shadow-lg transition-all"
                >
                  Edit details
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Profile Fields */}
        <motion.div variants={fadeInUp} className="divide-y divide-[#E5E5E5]">
          {/* Full Name */}
          <div className="flex flex-col sm:flex-row sm:items-start py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0 pt-3">
              Full name
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        onBlur={() => handleBlur("firstName")}
                        placeholder="First name"
                        className={`w-full h-[48px] px-3 rounded-[10px] border bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 transition-all ${
                          getFieldError("firstName")
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-[#E5E5E5] focus:border-[#3478F6] focus:ring-[#3478F6]/20"
                        }`}
                      />
                      {getFieldError("firstName") && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span className="text-[12px] text-red-500">
                            {getFieldError("firstName")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        onBlur={() => handleBlur("lastName")}
                        placeholder="Last name"
                        className={`w-full h-[48px] px-3 rounded-[10px] border bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 transition-all ${
                          getFieldError("lastName")
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-[#E5E5E5] focus:border-[#3478F6] focus:ring-[#3478F6]/20"
                        }`}
                      />
                      {getFieldError("lastName") && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span className="text-[12px] text-red-500">
                            {getFieldError("lastName")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white/50 flex items-center">
                  <span className="text-[16px] text-[#0A0A0A]">
                    {fullName || "Not set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-start py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0 pt-3">
              Email
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter your email"
                    className={`w-full h-[48px] px-3 rounded-[10px] border bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 transition-all ${
                      getFieldError("email")
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#E5E5E5] focus:border-[#3478F6] focus:ring-[#3478F6]/20"
                    }`}
                  />
                  {getFieldError("email") && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[12px] text-red-500">
                        {getFieldError("email")}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white/50 flex items-center">
                  <span className="text-[16px] text-[#0A0A0A]">
                    {formData.email || "Not set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col sm:flex-row sm:items-start py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0 pt-3">
              Phone number
            </label>
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onBlur={() => handleBlur("phone")}
                    placeholder="+91 XXXXX XXXXX"
                    className={`w-full h-[48px] px-3 rounded-[10px] border bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 transition-all ${
                      getFieldError("phone")
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-[#E5E5E5] focus:border-[#3478F6] focus:ring-[#3478F6]/20"
                    }`}
                  />
                  {getFieldError("phone") && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[12px] text-red-500">
                        {getFieldError("phone")}
                      </span>
                    </div>
                  )}
                  <p className="text-[12px] text-[#737373] mt-1">
                    Optional. Enter with country code (e.g., +91 for India)
                  </p>
                </div>
              ) : (
                <div className="h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white/50 flex items-center">
                  <span className="text-[16px] text-[#0A0A0A]">
                    {formatPhoneDisplay(formData.phone) || "Not set"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AccountLayout>
  );
}
