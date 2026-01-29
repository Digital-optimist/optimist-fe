"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";
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
  dateOfBirth: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

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
        dateOfBirth: "",
      });
    }
  }, [customer]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // Reset form data to original values
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        dateOfBirth: "",
      });
    }
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement customer update API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("Profile updated successfully", "success");
      setIsEditing(false);
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast("Image must be less than 1MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          {/* Profile Photo */}
          <div className="flex flex-col sm:flex-row sm:items-center py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0">
              Your photo
            </label>
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#E5E5E5]">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#737373] text-lg font-semibold">
                    {formData.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white border border-[#E5E5E5] shadow-[0px_4px_8px_-5px_rgba(0,0,0,0.15)] text-[#0A0A0A] text-[14px] font-medium hover:shadow-lg transition-all"
                  >
                    Choose
                  </button>
                  <span className="text-[14px] text-[#737373]">
                    JPG or PNG. 1MB max
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col sm:flex-row sm:items-center py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0">
              Full name
            </label>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="First name"
                    className="flex-1 h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Last name"
                    className="flex-1 h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
                  />
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
          <div className="flex flex-col sm:flex-row sm:items-center py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0">
              Email
            </label>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
                />
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
          <div className="flex flex-col sm:flex-row sm:items-center py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0">
              Phone number
            </label>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
                />
              ) : (
                <div className="h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white/50 flex items-center">
                  <span className="text-[16px] text-[#0A0A0A]">
                    {formData.phone || "Not set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col sm:flex-row sm:items-center py-6 gap-4">
            <label className="text-[16px] font-medium text-[#737373] w-full sm:w-[200px] lg:w-[300px] shrink-0">
              Date of birth
            </label>
            <div className="flex-1">
              {isEditing ? (
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full h-[48px] px-3 pr-10 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373] pointer-events-none" />
                </div>
              ) : (
                <div className="relative h-[48px] px-3 pr-10 rounded-[10px] border border-[#E5E5E5] bg-white/50 flex items-center">
                  <span className="text-[16px] text-[#0A0A0A]">
                    {formData.dateOfBirth
                      ? new Date(formData.dateOfBirth).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Not set"}
                  </span>
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AccountLayout>
  );
}
