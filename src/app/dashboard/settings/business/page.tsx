"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, X, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import { ApiClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import { ApiResponse } from "@/types/invoice";
import { useTranslation } from "react-i18next";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import Link from "next/link";

interface BusinessProfileDto {
  id?: string;
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
  const { t } = useTranslation();
  const { hasAccess, getFeatureUpgradeMessage } = usePlanAccess();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfileDto[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'list'>('form');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessFullName: "",
    registeredBusinessAddress: "",
    emailAddress: "",
    phoneNumber: "",
    businessType: "",
    businessRegistrationNumber: "",
    country: "",

  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const businessTypes = [
    { label: t("sole_proprietorship"), value: "SOLE_PROPRIETORSHIP" },
    { label: t("partnership"), value: "PARTNERSHIP" },
    { label: t("limited_liability_company"), value: "LIMITED_LIABILITY_COMPANY" },
    { label: t("corporation"), value: "COPERATIONS" },
    { label: t("non_profit_organization"), value: "NON_PROFIT_ORGANIZATION" },
    { label: t("other"), value: "OTHERS" },
  ] as const;

  const countries = [
    { label: t("nigeria"), value: "NIGERIA" },
    { label: t("ghana"), value: "GHANA" },
    { label: t("kenya"), value: "KENYA" },
    { label: t("south_africa"), value: "SOUTH_AFRICA" },
    { label: t("united_states"), value: "US" },
    { label: t("united_kingdom"), value: "UK" },
    { label: t("canada"), value: "CANADA" },
    { label: t("other"), value: "OTHERS" },
  ] as const;

  // Load existing business profile on component mount
  useEffect(() => {
    loadBusinessProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadBusinessProfile = async () => {
    try {
      setIsLoadingData(true);
      
      // Mock data for demonstration - Premium users will see multiple profiles
      if (canAddBusinessProfile) {
        const mockProfiles: BusinessProfileDto[] = [
          {
            id: 'profile-1',
            businessName: 'Tech Solutions Ltd',
            businessFullName: 'Tech Solutions Limited',
            registeredBusinessAddress: '123 Innovation Drive, Lagos',
            emailAddress: 'contact@techsolutions.com',
            phoneNumber: '+2348012345678',
            businessType: 'LIMITED_LIABILITY_COMPANY',
            country: 'NIGERIA',
            businessRegistrationNumber: 'RC123456',
            businessLogoUrl: undefined,
          },
          {
            id: 'profile-2',
            businessName: 'Creative Agency Inc',
            businessFullName: 'Creative Agency Incorporated',
            registeredBusinessAddress: '456 Design Street, Abuja',
            emailAddress: 'hello@creativeagency.com',
            phoneNumber: '+2348087654321',
            businessType: 'COPERATIONS',
            country: 'NIGERIA',
            businessRegistrationNumber: 'RC789012',
            businessLogoUrl: undefined,
          },
          {
            id: 'profile-3',
            businessName: 'Global Consulting',
            businessFullName: 'Global Consulting Services',
            registeredBusinessAddress: '789 Business Avenue, Port Harcourt',
            emailAddress: 'info@globalconsulting.com',
            phoneNumber: '+2348098765432',
            businessType: 'PARTNERSHIP',
            country: 'NIGERIA',
            businessRegistrationNumber: 'RC345678',
            businessLogoUrl: undefined,
          },
        ];
        
        setBusinessProfiles(mockProfiles);
        setSelectedProfileId(mockProfiles[0].id);
        
        const firstProfile = mockProfiles[0];
        setFormData({
          businessName: firstProfile.businessName || "",
          businessFullName: firstProfile.businessFullName || "",
          registeredBusinessAddress: firstProfile.registeredBusinessAddress || "",
          emailAddress: firstProfile.emailAddress || "",
          phoneNumber: firstProfile.phoneNumber || "",
          businessType: firstProfile.businessType || "",
          businessRegistrationNumber: firstProfile.businessRegistrationNumber || "",
          country: firstProfile.country || "",
        });

        if (firstProfile.businessLogoUrl) {
          setExistingLogoUrl(firstProfile.businessLogoUrl);
          setLogoPreview(firstProfile.businessLogoUrl);
        }
        
        setIsLoadingData(false);
        return;
      }
      
      // Original API call for non-premium users
      const response = await ApiClient.getBusinessProfile();
      console.log("Full API response:", response);

      if (response.status === 200 && response.data) {
        const apiResponse = response.data as ApiResponse<BusinessProfileDto>;
        const data = apiResponse.data;
        console.log("Business profile data:", data);

        if (data) {
          // For now, treat single profile as array with one item
          // In future, API should return array of profiles
          const profile = {
            id: data.id || 'default',
            ...data
          };
          setBusinessProfiles([profile]);
          setSelectedProfileId(profile.id);
          
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
      showError(t("failed_load_business_profile"));
    } finally {
      setIsLoadingData(false);
    }
  };


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

      if (file.size > 5 * 1024 * 1024) {
        showError(t("logo_file_size_error"));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError(t("select_valid_image"));
        return;
      }

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let normalizedPhone = formData.phoneNumber.trim();
    if (normalizedPhone.length > 0) {
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '+234' + normalizedPhone.substring(1);
      }
      
      if (!ApiClient.isValidPhone(normalizedPhone)) {
        setIsLoading(false);
        showError(t("phone_international_format"));
        return;
      }
    }
    
    try {
      // For Premium users with mock data - simulate saving
      if (canAddBusinessProfile) {
        let businessLogoUrl = existingLogoUrl;
        
        if (logoFile) {
          // Simulate logo upload
          businessLogoUrl = URL.createObjectURL(logoFile);
        }

        const profileData: BusinessProfileDto = {
          id: isAddingNew ? `profile-${Date.now()}` : selectedProfileId || undefined,
          businessName: formData.businessName,
          businessFullName: formData.businessFullName,
          registeredBusinessAddress: formData.registeredBusinessAddress,
          emailAddress: formData.emailAddress,
          phoneNumber: normalizedPhone,
          businessType: formData.businessType,
          country: formData.country,
          businessRegistrationNumber: formData.businessRegistrationNumber,
          businessLogoUrl: businessLogoUrl || undefined,
        };

        if (isAddingNew) {
          // Add new profile to the list
          setBusinessProfiles(prev => [...prev, profileData]);
          setSelectedProfileId(profileData.id!);
          setIsAddingNew(false);
          showSuccess(t("business_profile_created") || "Business profile created successfully");
        } else {
          // Update existing profile
          setBusinessProfiles(prev => 
            prev.map(p => p.id === selectedProfileId ? profileData : p)
          );
          showSuccess(t("business_profile_updated"));
        }
        
        setLogoFile(null);
        setIsLoading(false);
        return;
      }

      // Original API call for non-premium users
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
        phoneNumber: normalizedPhone,
        businessType: formData.businessType,
        country: formData.country,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        businessLogoUrl: businessLogoUrl || undefined,
      };

      // Update business profile
      const response = await ApiClient.updateBusinessProfile(businessProfileData);

      if (response.status !== 200) {
        showError(t("failed_update_business_profile"));
        return;
      }

      await loadBusinessProfile();
      setLogoFile(null);
      if (logoUploadFailed) {
        showSuccess(t("profile_saved_logo_failed"));
      } else {
        showSuccess(t("business_profile_updated"));
      }
    } catch (error) {
      showError(t("unexpected_error_occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {

    loadBusinessProfile();
    setLogoFile(null);
  };

  const handleAddNewProfile = () => {
    setIsAddingNew(true);
    setSelectedProfileId(null);
    setViewMode('form');
    setFormData({
      businessName: "",
      businessFullName: "",
      registeredBusinessAddress: "",
      emailAddress: "",
      phoneNumber: "",
      businessType: "",
      businessRegistrationNumber: "",
      country: "",
    });
    setLogoPreview(null);
    setExistingLogoUrl(null);
    setLogoFile(null);
  };

  const handleSelectProfile = (profileId: string) => {
    const profile = businessProfiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfileId(profileId);
      setIsAddingNew(false);
      setFormData({
        businessName: profile.businessName || "",
        businessFullName: profile.businessFullName || "",
        registeredBusinessAddress: profile.registeredBusinessAddress || "",
        emailAddress: profile.emailAddress || "",
        phoneNumber: profile.phoneNumber || "",
        businessType: profile.businessType || "",
        businessRegistrationNumber: profile.businessRegistrationNumber || "",
        country: profile.country || "",
      });
      
      if (profile.businessLogoUrl) {
        setExistingLogoUrl(profile.businessLogoUrl);
        setLogoPreview(profile.businessLogoUrl);
      } else {
        setExistingLogoUrl(null);
        setLogoPreview(null);
      }
      setLogoFile(null);
    }
    setIsDropdownOpen(false);
  };

  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (businessProfiles.length <= 1) {
      showError(t("cannot_delete_last_profile") || "Cannot delete the last profile");
      return;
    }

    setProfileToDelete(profileId);
    setShowDeleteModal(true);
  };

  const confirmDeleteProfile = () => {
    if (!profileToDelete) return;

    const updatedProfiles = businessProfiles.filter(p => p.id !== profileToDelete);
    setBusinessProfiles(updatedProfiles);
    
    // If deleted profile was selected, select the first remaining profile
    if (selectedProfileId === profileToDelete) {
      handleSelectProfile(updatedProfiles[0].id!);
    }
    
    showSuccess(t("profile_deleted") || "Profile deleted successfully");
    setShowDeleteModal(false);
    setProfileToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProfileToDelete(null);
  };

  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            <span className="ml-3 text-[#667085]">{t("loading_business_profile")}</span>
          </div>
        </div>
      </div>
    );
  }

  const canAddBusinessProfile = hasAccess('multipleCompanyProfiles');

  const selectedProfile = businessProfiles.find(p => p.id === selectedProfileId);
  const profileDisplayName = isAddingNew 
    ? t("new_business_profile") || "New Business Profile"
    : selectedProfile?.businessName || t("select_business") || "Select Business";

  return (
    <div className="p-6">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="max-w-2xl">
        {!canAddBusinessProfile && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              {t("upgrade_to_premium_for_business_profiles") || "Upgrade to Premium to add business profiles"}
            </p>
            <Link 
              href="/dashboard/pricing"
              className="text-sm text-[#2F80ED] hover:underline font-medium"
            >
              {t("upgrade_plan") || "Upgrade Plan"}
            </Link>
          </div>
        )}

        {canAddBusinessProfile && (
          <div className="flex justify-end gap-3 mb-6">
            {/* Select Business Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2.5 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <span className="text-sm font-medium">{profileDisplayName}</span>
                {businessProfiles.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#F2F4F7] text-[#344054] text-xs rounded-full">
                    {businessProfiles.length}
                  </span>
                )}
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#D0D5DD] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {businessProfiles.length > 0 ? (
                      businessProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className={`flex items-center justify-between px-4 py-2.5 hover:bg-[#F9FAFB] transition-colors ${
                            selectedProfileId === profile.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectProfile(profile.id!)}
                            className="flex-1 text-left"
                          >
                            <div className={`font-medium text-sm ${
                              selectedProfileId === profile.id ? 'text-[#2F80ED]' : 'text-[#344054]'
                            }`}>
                              {profile.businessName || t("unnamed_profile")}
                            </div>
                            {profile.emailAddress && (
                              <div className="text-xs text-[#667085] mt-0.5">{profile.emailAddress}</div>
                            )}
                          </button>
                          {businessProfiles.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteProfile(profile.id!, e)}
                              className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title={t("delete_profile") || "Delete profile"}
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2.5 text-sm text-[#667085]">
                        {t("no_profiles_yet") || "No profiles yet"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* View All and Add Business Profile Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'list' ? 'form' : 'list')}
                className="px-4 py-2.5 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <span className="text-sm font-medium">
                  {viewMode === 'list' ? (t("back_to_form") || "Back to Form") : (t("view_all_profiles") || "View All Profiles")}
                </span>
              </button>
              
              <button
                type="button"
                onClick={handleAddNewProfile}
                className="px-4 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">{t("add_business_profile") || "Add Business Profile"}</span>
              </button>
            </div>
          </div>
        )}
        
        {viewMode === 'list' && canAddBusinessProfile ? (
          /* List View */
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#101828] mb-4">
              {t("all_business_profiles") || "All Business Profiles"}
            </h2>
            
            {businessProfiles.length === 0 ? (
              <div className="text-center py-12 bg-[#F9FAFB] rounded-lg">
                <p className="text-[#667085]">{t("no_profiles_yet") || "No profiles yet"}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {businessProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-6 border border-[#E5E7EB] rounded-lg hover:border-[#2F80ED] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#101828] mb-2">
                          {profile.businessName}
                        </h3>
                        <div className="space-y-1 text-sm text-[#667085]">
                          {profile.businessFullName && (
                            <p><span className="font-medium">Full Name:</span> {profile.businessFullName}</p>
                          )}
                          {profile.emailAddress && (
                            <p><span className="font-medium">Email:</span> {profile.emailAddress}</p>
                          )}
                          {profile.phoneNumber && (
                            <p><span className="font-medium">Phone:</span> {profile.phoneNumber}</p>
                          )}
                          {profile.registeredBusinessAddress && (
                            <p><span className="font-medium">Address:</span> {profile.registeredBusinessAddress}</p>
                          )}
                          {profile.businessType && (
                            <p><span className="font-medium">Type:</span> {profile.businessType}</p>
                          )}
                          {profile.country && (
                            <p><span className="font-medium">Country:</span> {profile.country}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectProfile(profile.id!);
                            setViewMode('form');
                          }}
                          className="px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium"
                        >
                          {t("edit") || "Edit"}
                        </button>
                        {businessProfiles.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProfile(profile.id!, e)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                          >
                            {t("delete") || "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Title */}
          {canAddBusinessProfile && (
            <div className="pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[#101828]">
                  {isAddingNew 
                    ? (t("add_new_business_profile") || "Add New Business Profile")
                    : (t("edit_business_profile") || "Edit Business Profile")
                  }
                </h2>
                {isAddingNew && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {t("new") || "New"}
                  </span>
                )}
              </div>
              {selectedProfile && !isAddingNew && (
                <p className="text-sm text-[#667085] mt-1">
                  {t("editing") || "Editing"}: {selectedProfile.businessName}
                </p>
              )}
            </div>
          )}

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              {t("business_name")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder={t("enter_full_name")}
              disabled={!canAddBusinessProfile}
              className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              required
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registered Address */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                {t("registered_business_address")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="registeredBusinessAddress"
                value={formData.registeredBusinessAddress}
                onChange={handleInputChange}
                placeholder={t("enter_business_address")}
                disabled={!canAddBusinessProfile}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                {t("email_address")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder={t("enter_email")}
                  disabled={!canAddBusinessProfile}
                  className="w-full px-3 py-2.5 pr-10 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                {t("phone_number")} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder={t("enter_phone")}
                disabled={!canAddBusinessProfile}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </div>

            {/* Business Registration Number */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                {t("business_registration_number")}
              </label>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                placeholder={t("enter_registration_number")}
                disabled={!canAddBusinessProfile}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                {t("business_type")} <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                disabled={!canAddBusinessProfile}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
              >
                <option value="">{t("select_business_type")}</option>
                {businessTypes.map((type) => (

                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                {t("country")} <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!canAddBusinessProfile}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
              >
                <option value="">{t("select_country")}</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              {t("upload_business_logo")}
            </label>
            <p className="text-xs text-[#667085] mb-3">{t("max_file_size")}</p>
            {hasAccess('customLogo') ? (
              <>
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
                        {t("click_to_upload")}
                      </span>
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-[#E5E5E5] rounded-lg flex flex-col items-center justify-center bg-gray-50 relative">
                <div className="flex flex-col items-center opacity-50">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    Custom Logo
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <p className="text-xs text-gray-600 mb-2">{getFeatureUpgradeMessage('customLogo')}</p>
                    <Link 
                      href="/dashboard/pricing"
                      className="text-xs text-[#2F80ED] hover:underline"
                    >
                      Upgrade Plan
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!canAddBusinessProfile}
              className="px-6 py-2.5 border border-[#D0D5DD] text-[#667085] rounded-lg hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading || !isFormValid() || !canAddBusinessProfile}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("saving") : t("save_changes")}
            </button>
          </div>
        </form>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#101828] mb-2">
                  {t("delete_business_profile") || "Delete Business Profile"}
                </h3>
                <p className="text-sm text-[#667085] mb-6">
                  {t("delete_profile_confirmation") || "Are you sure you want to delete this business profile? This action cannot be undone."}
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium"
                  >
                    {t("cancel") || "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteProfile}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {t("delete") || "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfilePage;