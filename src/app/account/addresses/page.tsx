"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Plus, Loader2, AlertCircle } from "lucide-react";
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
  company: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

interface AddressFormErrors {
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
}

// Validation helpers
const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value.trim()) {
    return `${fieldName} is required`;
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
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) {
    return undefined; // Phone is optional for addresses
  }
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return "Please enter a valid phone number (10-15 digits)";
  }
  return undefined;
};

const validateZip = (zip: string): string | undefined => {
  if (!zip.trim()) {
    return "Pincode is required";
  }
  // Indian pincode: 6 digits
  const digitsOnly = zip.replace(/\D/g, "");
  if (digitsOnly.length !== 6) {
    return "Please enter a valid 6-digit pincode";
  }
  return undefined;
};

const validateAddress = (address: string, fieldName: string): string | undefined => {
  if (!address.trim()) {
    return `${fieldName} is required`;
  }
  if (address.trim().length < 5) {
    return `${fieldName} must be at least 5 characters`;
  }
  if (address.trim().length > 200) {
    return `${fieldName} must be less than 200 characters`;
  }
  return undefined;
};

const emptyFormData: AddressFormData = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  zip: "",
  country: "India",
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
      company: address.company || "",
      phone: address.phone || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      province: address.province || "",
      zip: address.zip || "",
      country: address.country || "India",
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

  const handleSave = async (validatedData: AddressFormData) => {
    if (!accessToken) return;

    setIsSaving(true);
    try {
      // Format phone for Shopify (E.164 format)
      let formattedPhone = validatedData.phone;
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

      const addressData = {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        company: validatedData.company.trim() || null,
        phone: formattedPhone || null,
        address1: validatedData.address1.trim(),
        address2: validatedData.address2.trim() || null,
        city: validatedData.city.trim(),
        province: validatedData.province.trim(),
        zip: validatedData.zip.trim(),
        country: validatedData.country.trim(),
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
                        {/* Company Chip (if exists) */}
                        {address.company && (
                          <div className="mb-2">
                            <span className="inline-flex items-center justify-center h-7 px-2 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-[12px] text-[#737373]">
                              {address.company}
                            </span>
                          </div>
                        )}
                        <p className="text-[16px] font-semibold text-[#0A0A0A] leading-[1.5]">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-[16px] text-[#737373] leading-[1.5]">
                          {fullAddress}
                        </p>
                        {address.phone && (
                          <p className="text-[14px] text-[#737373]">
                            {address.phone}
                          </p>
                        )}
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
          <AnimatePresence>
            {!isCreating && !editingId && (
              <motion.div
                key="add-address-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-6"
              >
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
          </AnimatePresence>

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
  onSave: (data: AddressFormData) => void;
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
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form
  const validateForm = useCallback((): AddressFormErrors => {
    const newErrors: AddressFormErrors = {};

    newErrors.firstName = validateName(formData.firstName, "First name");
    newErrors.lastName = validateName(formData.lastName, "Last name");
    newErrors.phone = validatePhone(formData.phone);
    newErrors.address1 = validateAddress(formData.address1, "Address line 1");
    // address2 is optional, no validation needed
    newErrors.city = validateRequired(formData.city, "City");
    newErrors.province = validateRequired(formData.province, "State/province");
    newErrors.zip = validateZip(formData.zip);
    newErrors.country = validateRequired(formData.country, "Country");

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof AddressFormErrors] === undefined) {
        delete newErrors[key as keyof AddressFormErrors];
      }
    });

    return newErrors;
  }, [formData]);

  const handleBlur = (field: keyof AddressFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateForm();
    setErrors(validationErrors);
  };

  const getFieldError = (field: keyof AddressFormErrors): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      address1: true,
      address2: true,
      city: true,
      province: true,
      zip: true,
      country: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave(formData);
  };

  const inputClass = (field: keyof AddressFormErrors) =>
    `w-full h-[48px] px-3 rounded-[10px] border bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 transition-all ${
      getFieldError(field)
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        : "border-[#E5E5E5] focus:border-[#3478F6] focus:ring-[#3478F6]/20"
    }`;

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
            onClick={handleSubmit}
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
        {/* First Name */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            First name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            onBlur={() => handleBlur("firstName")}
            placeholder="First name"
            className={inputClass("firstName")}
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

        {/* Last Name */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Last name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            onBlur={() => handleBlur("lastName")}
            placeholder="Last name"
            className={inputClass("lastName")}
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

        {/* Company (optional) */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Company <span className="text-[#A3A3A3]">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            placeholder="Company name"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Phone number <span className="text-[#A3A3A3]">(optional)</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            onBlur={() => handleBlur("phone")}
            placeholder="+91 XXXXX XXXXX"
            className={inputClass("phone")}
          />
          {getFieldError("phone") && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[12px] text-red-500">
                {getFieldError("phone")}
              </span>
            </div>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="block text-[14px] text-[#737373] mb-2">
            Address line 1<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.address1}
            onChange={(e) =>
              setFormData({ ...formData, address1: e.target.value })
            }
            onBlur={() => handleBlur("address1")}
            placeholder="Street address, apartment, suite, etc."
            className={inputClass("address1")}
          />
          {getFieldError("address1") && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[12px] text-red-500">
                {getFieldError("address1")}
              </span>
            </div>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <label className="block text-[14px] text-[#737373] mb-2">
            Address line 2 <span className="text-[#A3A3A3]">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.address2}
            onChange={(e) =>
              setFormData({ ...formData, address2: e.target.value })
            }
            placeholder="Area, landmark"
            className="w-full h-[48px] px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[16px] text-[#0A0A0A] placeholder-[#A3A3A3] focus:border-[#3478F6] focus:outline-none focus:ring-2 focus:ring-[#3478F6]/20 transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            City<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            onBlur={() => handleBlur("city")}
            placeholder="City"
            className={inputClass("city")}
          />
          {getFieldError("city") && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[12px] text-red-500">
                {getFieldError("city")}
              </span>
            </div>
          )}
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            State/province<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value })
            }
            onBlur={() => handleBlur("province")}
            placeholder="State"
            className={inputClass("province")}
          />
          {getFieldError("province") && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[12px] text-red-500">
                {getFieldError("province")}
              </span>
            </div>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Pincode<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.zip}
            onChange={(e) =>
              setFormData({ ...formData, zip: e.target.value })
            }
            onBlur={() => handleBlur("zip")}
            placeholder="XXXXXX"
            maxLength={6}
            className={inputClass("zip")}
          />
          {getFieldError("zip") && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[12px] text-red-500">
                {getFieldError("zip")}
              </span>
            </div>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-[14px] text-[#737373] mb-2">
            Country<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            onBlur={() => handleBlur("country")}
            placeholder="Country"
            className={inputClass("country")}
          />
          {getFieldError("country") && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[12px] text-red-500">
                {getFieldError("country")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
