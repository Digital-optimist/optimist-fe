"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { AccountLayout } from "@/components/account";
import {
  customerAddressCreate,
  customerAddressUpdate,
  customerAddressDelete,
  type Address,
} from "@/lib/shopify";

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

interface AddressFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  addressType: "Home" | "Work";
}

const emptyFormData: AddressFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  zip: "",
  country: "India",
  addressType: "Home",
};

export default function AddressesPage() {
  const router = useRouter();
  const {
    customer,
    accessToken,
    isAuthenticated,
    isLoading: isAuthLoading,
    refreshCustomer,
  } = useAuth();
  const { showToast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>(emptyFormData);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const addresses = customer?.addresses.edges.map((e) => e.node) || [];

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      province: address.province || "",
      zip: address.zip || "",
      country: address.country || "India",
      addressType: "Home", // Default, would need to store this separately
    });
    setEditingId(address.id);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setFormData({
      ...emptyFormData,
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      phone: customer?.phone || "",
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!accessToken) return;

    setIsSaving(true);
    try {
      const addressData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        province: formData.province,
        zip: formData.zip,
        country: formData.country,
      };

      if (isCreating) {
        await customerAddressCreate(accessToken, addressData as Omit<Address, "id">);
        showToast("Address added successfully", "success");
      } else if (editingId) {
        await customerAddressUpdate(accessToken, editingId, addressData);
        showToast("Address updated successfully", "success");
      }
      await refreshCustomer();
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save address";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!accessToken) return;

    setIsDeleting(addressId);
    try {
      await customerAddressDelete(accessToken, addressId);
      showToast("Address deleted", "success");
      await refreshCustomer();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete address";
      showToast(message, "error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isAuthLoading) {
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

  return (
    <AccountLayout
      activeTab="addresses"
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
          className="pb-6 border-b border-[#E5E5E5]"
        >
          <h1 className="text-[24px] font-semibold text-[#0A0A0A] leading-[1.5]">
            Manage addresses
          </h1>
          <p className="text-[16px] text-[#737373] leading-[1.5]">
            Update your delivery address
          </p>
        </motion.div>

        {/* Address List */}
        <motion.div variants={fadeInUp} className="divide-y divide-[#E5E5E5]">
          {addresses.map((address, index) => {
            const isEditing = editingId === address.id;
            const fullAddress = [
              address.address1,
              address.address2,
              address.city,
              address.province,
              address.zip,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <div key={address.id} className="py-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AddressForm
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSave}
                        onCancel={resetForm}
                        isSaving={isSaving}
                        title="Edit address"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        {/* Address Type Chip */}
                        <div className="mb-2">
                          <span className="inline-flex items-center justify-center h-7 px-2 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-[12px] text-[#737373]">
                            {index === 0 ? "Home" : "Work"}
                          </span>
                        </div>
                        <p className="text-[16px] font-semibold text-[#0A0A0A] leading-[1.5]">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-[16px] text-[#737373] leading-[1.5]">
                          {fullAddress}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-5 shrink-0">
                        <button
                          onClick={() => handleDelete(address.id)}
                          disabled={isDeleting === address.id}
                          className="flex items-center gap-2 text-[#C31102] hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                          {isDeleting === address.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                          <span className="text-[16px] font-semibold">
                            Delete
                          </span>
                        </button>
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex items-center gap-2 text-[#0A0A0A] hover:opacity-70 transition-opacity"
                        >
                          <Pencil className="w-5 h-5" />
                          <span className="text-[16px] font-semibold">Edit</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* New Address Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="py-6"
              >
                <AddressForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSave}
                  onCancel={resetForm}
                  isSaving={isSaving}
                  title="Add new address"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Address Button */}
          {!isCreating && !editingId && (
            <motion.div variants={fadeInUp} className="py-6">
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 text-[#3478F6] hover:opacity-70 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[16px] font-medium underline">
                  Add address
                </span>
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {addresses.length === 0 && !isCreating && (
            <motion.div
              variants={fadeInUp}
              className="py-12 text-center"
            >
              <p className="text-[#737373] mb-4">No addresses saved yet</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium"
                style={{
                  background:
                    "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                  boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
                }}
              >
                <Plus className="w-5 h-5" />
                Add your first address
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AccountLayout>
  );
}

// Address Form Component
interface AddressFormProps {
  formData: AddressFormData;
  setFormData: (data: AddressFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  title: string;
}

function AddressForm({
  formData,
  setFormData,
  onSave,
  onCancel,
  isSaving,
  title,
}: AddressFormProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-[16px] font-semibold text-[#3478F6]">{title}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#0A0A0A] text-[14px] font-medium hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-full text-white text-[14px] font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            style={{
              background:
                "linear-gradient(176.74deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
              boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
            }}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Full name
          </label>
          <input
            type="text"
            value={`${formData.firstName} ${formData.lastName}`.trim()}
            onChange={(e) => {
              const parts = e.target.value.split(" ");
              setFormData({
                ...formData,
                firstName: parts[0] || "",
                lastName: parts.slice(1).join(" ") || "",
              });
            }}
            placeholder="Full name"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Phone number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="block text-[14px] text-[#737373] mb-2">
            Address line 1
          </label>
          <input
            type="text"
            value={formData.address1}
            onChange={(e) =>
              setFormData({ ...formData, address1: e.target.value })
            }
            placeholder="Street address, apartment, suite, etc."
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <label className="block text-[14px] text-[#737373] mb-2">
            Address line 2
          </label>
          <input
            type="text"
            value={formData.address2}
            onChange={(e) =>
              setFormData({ ...formData, address2: e.target.value })
            }
            placeholder="Area, landmark (optional)"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            State/province
          </label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value })
            }
            placeholder="State"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Pincode
          </label>
          <input
            type="text"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            placeholder="XXXXXX"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Country
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder="Country"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>
      </div>

      {/* Address Type */}
      <div>
        <label className="block text-[14px] text-[#737373] mb-3">
          Address type
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="addressType"
              checked={formData.addressType === "Home"}
              onChange={() => setFormData({ ...formData, addressType: "Home" })}
              className="w-5 h-5 text-[#3478F6] border-[#E5E5E5] focus:ring-[#3478F6]"
            />
            <span className="text-[16px] text-[#0A0A0A]">Home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="addressType"
              checked={formData.addressType === "Work"}
              onChange={() => setFormData({ ...formData, addressType: "Work" })}
              className="w-5 h-5 text-[#3478F6] border-[#E5E5E5] focus:ring-[#3478F6]"
            />
            <span className="text-[16px] text-[#0A0A0A]">Work</span>
          </label>
        </div>
      </div>
    </div>
  );
}
