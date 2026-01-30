"use client";

<<<<<<< HEAD
import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const BusinessProfilePage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    registeredAddress: "",
=======
import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { ApiClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import { ApiResponse } from "@/types/invoice";

interface BusinessProfileDto {
  businessName?: string;
  businessFullName?: string;
  registeredBusinessAddress?: string;
  emailAddress?: string;
  phoneNumber?: string;
  businessType?: string;
  country?: string;
  businessRegistrationNumber?: string;
  businessLogoUrl?: string;
}


const BusinessProfilePage = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: "",
    businessFullName: "",
    registeredBusinessAddress: "",
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    emailAddress: "",
    phoneNumber: "",
    businessType: "",
    businessRegistrationNumber: "",
<<<<<<< HEAD
    country: "",
=======
    country: ""
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Non-Profit Organization",
    "Other",
  ];

  const countries = [
    "Nigeria",
    "Ghana",
    "Kenya",
    "South Africa",
    "United States",
    "United Kingdom",
    "Canada",
    "Other",
  ];
=======
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const businessTypes = [
    { label: "Sole Proprietorship", value: "SOLE_PROPRIETORSHIP" },
    { label: "Partnership", value: "PARTNERSHIP" },
    { label: "Limited Liability Company (LLC)", value: "LIMITED_LIABILITY_COMPANY" },
    { label: "Corporation", value: "COPERATIONS" },
    { label: "Non-Profit Organization", value: "NON_PROFIT_ORGANIZATION" },
    { label: "Other", value: "OTHERS" },
  ] as const;

  const countries = [
    { label: "Nigeria", value: "NIGERIA" },
    { label: "Ghana", value: "GHANA" },
    { label: "Kenya", value: "KENYA" },
    { label: "South Africa", value: "SOUTH_AFRICA" },
    { label: "United States", value: "US" },
    { label: "United Kingdom", value: "UK" },
    { label: "Canada", value: "CANADA" },
    { label: "Other", value: "OTHERS" },
  ] as const;

  // Load existing business profile on component mount
  useEffect(() => {
    loadBusinessProfile();
  }, []);

  const loadBusinessProfile = async () => {
    try {
      setIsLoadingData(true);
      const response = await ApiClient.getBusinessProfile();
      console.log("Full API response:", response);

      if (response.status === 200 && response.data) {
        const apiResponse = response.data as ApiResponse<BusinessProfileDto>;
        const data = apiResponse.data;
        console.log("Business profile data:", data);

        if (data) {
          setFormData({
            businessName: data.businessName || "",
            businessFullName: data.businessFullName || "",
            registeredBusinessAddress: data.registeredBusinessAddress || "",
            emailAddress: data.emailAddress || "",
            phoneNumber: data.phoneNumber || "",
            businessType: data.businessType || "",
            businessRegistrationNumber: data.businessRegistrationNumber || "",
            country: data.country || "",
          });

          if (data.businessLogoUrl) {
            setExistingLogoUrl(data.businessLogoUrl);
            setLogoPreview(data.businessLogoUrl);
          }

        }
      }

    } catch (error) {
      console.error("Error loading business profile:", error);
      showError("Failed to load business profile. Please refresh the page.");
    } finally {
      setIsLoadingData(false);
    }
  };

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
<<<<<<< HEAD
=======
      if (file.size > 5 * 1024 * 1024) {
        showError("Logo file size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError("Please select a valid image file");
        return;
      }

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
<<<<<<< HEAD
    setLogoPreview(null);
=======
    setLogoPreview(existingLogoUrl);
  };

  const isFormValid = () => {
    return (
      formData.businessName.trim() !== "" &&
      formData.registeredBusinessAddress.trim() !== "" &&
      formData.emailAddress.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.businessType.trim() !== "" &&
      formData.country.trim() !== ""
    );
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const response = await ApiClient.uploadBusinessLogo(file);
      console.log("Logo upload response:", response);

      if (response.status === 200 && response.data) {
        // Try both possible response structures
        const logoUrl = response.data.uploadedLogoUrl || response.data.data?.uploadedLogoUrl;
        if (logoUrl) {
          return logoUrl;
        }
      }
      throw new Error(response.error || 'Logo upload failed');
    } catch (error) {
      console.error("Logo upload failed:", error);
      throw error;
    }
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
<<<<<<< HEAD

    try {
      // TODO: Implement business profile update API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert("Business profile updated successfully!");
    } catch (error) {
      console.error("Error updating business profile:", error);
      alert("Failed to update business profile. Please try again.");
=======
    if (formData.phoneNumber.length > 0 && !ApiClient.isValidPhone(formData.phoneNumber)) {
      setIsLoading(false);
      showError("Phone number must be in international format. Example: +234***********");
      return;
    }
    try {
      let businessLogoUrl = existingLogoUrl;
      let logoUploadFailed = false;

      if (logoFile) {
        try {
          businessLogoUrl = await uploadLogo(logoFile);
        } catch (error) {
          console.error("Logo upload failed:", error);
          logoUploadFailed = true;
          // Continue without logo URL - don't block profile save
        }
      }

      // Prepare business profile data (map UI fields to backend DTO)
      const businessProfileData: BusinessProfileDto = {
        businessName: formData.businessName,
        businessFullName: formData.businessFullName,
        registeredBusinessAddress: formData.registeredBusinessAddress,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
        businessType: formData.businessType,
        country: formData.country,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        businessLogoUrl: businessLogoUrl || undefined,
      };

      // Update business profile
      const response = await ApiClient.updateBusinessProfile(businessProfileData);

      if (response.status !== 200) {
        showError("Failed to update business profile, Please try again.");
        return;
      }

      await loadBusinessProfile();
      setLogoFile(null);
      if (logoUploadFailed) {
        showSuccess("Profile saved, but logo upload failed");
      } else {
        showSuccess("Business profile updated successfully");
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
<<<<<<< HEAD
    // Reset form or navigate back
    setFormData({
      businessName: "",
      registeredAddress: "",
      emailAddress: "",
      phoneNumber: "",
      businessType: "",
      businessRegistrationNumber: "",
      country: "",
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  return (
    <div className="p-6">
=======
    // Reload business profile from server to reset any unsaved changes
    loadBusinessProfile();
    setLogoFile(null); // Clear any selected file
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            <span className="ml-3 text-[#667085]">Loading business profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
<<<<<<< HEAD
              placeholder="Enter full name"
=======
              placeholder="Enter business name"
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
              className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
              required
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registered Address */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Registered Business Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
<<<<<<< HEAD
                name="registeredAddress"
                value={formData.registeredAddress}
=======
                name="registeredBusinessAddress"
                value={formData.registeredBusinessAddress}
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                onChange={handleInputChange}
                placeholder="Enter business address"
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2.5 pr-10 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
<<<<<<< HEAD
                    <path d="M18.3333 5.00001C18.3333 4.08334 17.5833 3.33334 16.6667 3.33334H3.33333C2.41667 3.33334 1.66667 4.08334 1.66667 5.00001M18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41667 16.6667 1.66667 15.9167 1.66667 15V5.00001M18.3333 5.00001L10 10.8333L1.66667 5.00001" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
=======
                    <path d="M18.3333 5.00001C18.3333 4.08334 17.5833 3.33334 16.6667 3.33334H3.33333C2.41667 3.33334 1.66667 4.08334 1.66667 5.00001M18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41667 16.6667 1.66667 15.9167 1.66667 15V5.00001M18.3333 5.00001L10 10.8333L1.66667 5.00001" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                required
              />
            </div>

<<<<<<< HEAD
            {/* Business Name (Second Field) */}
=======
            {/* Business Full Name (Owner's Name) */}
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
<<<<<<< HEAD
                name="businessName2"
=======
                name="businessFullName"
                value={formData.businessFullName}
                onChange={handleInputChange}
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                placeholder="Enter business name"
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
<<<<<<< HEAD
                  <option key={type} value={type}>
                    {type}
=======
                  <option key={type.value} value={type.value}>
                    {type.label}
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                  </option>
                ))}
              </select>
            </div>

            {/* Business Registration Number */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Business Registration Number (optional)
              </label>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
<<<<<<< HEAD
                placeholder="Enter business name"
=======
                placeholder="Enter registration number"
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent appearance-none bg-white"
              required
            >
<<<<<<< HEAD
              <option value="">Select business type</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
=======
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                </option>
              ))}
            </select>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Upload Business Logo
            </label>
            <p className="text-xs text-[#667085] mb-3">Max file size 5MB</p>
<<<<<<< HEAD
            
=======

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
            {logoPreview ? (
              <div className="relative w-32 h-32 border-2 border-dashed border-[#D0D5DD] rounded-lg flex items-center justify-center bg-[#F9FAFB]">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={120}
                  height={120}
                  className="object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-[#D0D5DD] rounded-lg flex flex-col items-center justify-center bg-[#F9FAFB] cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload size={24} className="text-[#667085] mb-2" />
                  <span className="text-xs text-[#667085] text-center">
                    Click to upload
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-[#D0D5DD] text-[#667085] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
<<<<<<< HEAD
              disabled={isLoading}
=======
              disabled={isLoading || !isFormValid()}
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfilePage;