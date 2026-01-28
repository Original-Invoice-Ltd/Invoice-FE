"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const BusinessProfilePage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    registeredAddress: "",
    emailAddress: "",
    phoneNumber: "",
    businessType: "",
    businessRegistrationNumber: "",
    country: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement business profile update API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert("Business profile updated successfully!");
    } catch (error) {
      console.error("Error updating business profile:", error);
      alert("Failed to update business profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
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
              placeholder="Enter full name"
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
                name="registeredAddress"
                value={formData.registeredAddress}
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
                    <path d="M18.3333 5.00001C18.3333 4.08334 17.5833 3.33334 16.6667 3.33334H3.33333C2.41667 3.33334 1.66667 4.08334 1.66667 5.00001M18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41667 16.6667 1.66667 15.9167 1.66667 15V5.00001M18.3333 5.00001L10 10.8333L1.66667 5.00001" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
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

            {/* Business Name (Second Field) */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName2"
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
                  <option key={type} value={type}>
                    {type}
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
                placeholder="Enter business name"
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
              <option value="">Select business type</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
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
              disabled={isLoading}
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