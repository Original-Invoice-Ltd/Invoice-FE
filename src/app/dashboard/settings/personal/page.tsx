"use client";

import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD

const PersonalProfilePage = () => {
  const { user, updateUserProfile, uploadProfilePhoto } = useAuth();
=======
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import { ApiClient } from "@/lib/api";

const PersonalProfilePage = () => {
  const { user, refreshUser, updateUserProfile, uploadProfilePhoto } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
  // Initialize form data with user information
  useEffect(() => {
=======
  useEffect(() => {

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    if (user) {
      const nameParts = user.fullName?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        emailAddress: user.email || '',
<<<<<<< HEAD
        phoneNumber: user.phoneNumber || '',
      });
      setProfileImage(user.imageUrl || null);
    }
=======
        phoneNumber: user.phone || '',
      });
      setProfileImage(user.imageUrl || null);
    } else {
      refreshUser();
    }

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setProfileImage(user?.imageUrl || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
<<<<<<< HEAD

    try {
      // Update profile information
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const success = await updateUserProfile(fullName, formData.phoneNumber);
      
=======
  if (formData.phoneNumber.length > 0 && !ApiClient.isValidPhone(formData.phoneNumber)) {
        setIsLoading(false);
        showError("Phone number must be in international format. Example: +234***********");
        return;
      }
    try {
      // Update profile information
      const fullName = `${formData.firstName.trim} ${formData.lastName.trim()}`.trim();
      const success = await updateUserProfile(fullName, formData.phoneNumber);

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
      if (!success) {
        throw new Error("Failed to update profile");
      }

      // Upload profile image if changed
      if (imageFile) {
        const imageSuccess = await uploadProfilePhoto(imageFile);
        if (!imageSuccess) {
<<<<<<< HEAD
          console.warn("Profile updated but image upload failed");
        }
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
=======
          showSuccess("Profile updated but image upload failed");
        }
      }
      refreshUser();
       setFormData({
        firstName: user?.fullName.split(" ")[0] || '',
        lastName: user?.fullName.split(" ")[1] || '',
        emailAddress: user?.email || '',
        phoneNumber: user?.phone || '',
      });
      showSuccess("Profile updated successfully!");

    } catch (error) {
      // console.error("Error updating profile:", error);
      showError("Failed to update profile. Please try again.");
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (formData.firstName || formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.fullName?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U';
  };

  return (
    <div className="p-6">
<<<<<<< HEAD
=======
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {profileImage ? (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#2F80ED] flex items-center justify-center text-white text-xl font-semibold">
                  {getInitials()}
                </div>
              )}
<<<<<<< HEAD
              
=======

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
              <button
                type="button"
                onClick={() => document.getElementById('profile-image-upload')?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2F80ED] text-white rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors"
              >
                <Camera size={14} />
              </button>
<<<<<<< HEAD
              
=======

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
<<<<<<< HEAD
            
=======

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
            {imageFile && (
              <button
                type="button"
                onClick={removeImage}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove new image
              </button>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Chiamaka"
              className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Okeke"
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-[#101828] mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="chiamakaokeke2005@gmail.com"
                  className="w-full px-3 py-2.5 pr-10 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent bg-[#F9FAFB]"
                  disabled // Email should not be editable
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalProfilePage;