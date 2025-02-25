"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { profileAPI, UserProfile } from '@/services/api';

const ProfileForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender_id: '',
    city_id: '',
    about_en: '',
    about_ar: '',
    english_level: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Starting profile fetch...');
        setIsLoading(true);
        setError(null);
        
        console.log('Calling profileAPI.getProfile()...');
        const response = await profileAPI.getProfile();
        console.log('Profile fetch successful:', {
          responseData: response,
          profile: response.data
        });
        
        setProfile(response.data);
        
        // Pre-fill form data
        if (response.data) {
          console.log('Setting form data with:', {
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            genderId: response.data.gender?.id,
            cityId: response.data.city?.id,
            about: response.data.about,
            phone: response.data.phone,
            imagePath: response.data.image?.path
          });
          
          setFormData({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            gender_id: response.data.gender?.id || '',
            city_id: response.data.city?.id || '',
            about_en: response.data.about || '',
            about_ar: '',
            english_level: ''
          });
          
          setPhone(response.data.phone);
          if (response.data.image?.path) {
            setImagePreview(response.data.image.path);
          }
        }
      } catch (err) {
        console.error('Error in fetchProfile:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
        console.log('Profile fetch completed. Loading state set to false.');
      }
    };

    console.log('Profile form mounted, initiating profile fetch...');
    fetchProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const response = await profileAPI.updateProfile(formData);
      setProfile(response.data);
      setShowSuccessModal(true); // Show success modal instead of alert
      
      // Auto-hide modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
      
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <div className="text-center py-4">
          <p className="text-xl font-medium text-primary">Profile Updated Successfully!</p>
          <p className="text-md mt-2 text-primary">Your changes have been saved</p>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-center">
              <Image
                src="/images/heart-svg.svg"
                alt="Success Animation"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-primary font-bold text-2xl mb-2">
              Great Job!
            </div>
            <div className="text-gray-600 text-center">
              <p>Your profile information has been updated successfully.</p>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-[progress_3s_linear]"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { 
      id: 'profile', 
      label: 'Profile',
      icon: '/icons/profile.png',
      titleIcon: '/icons/profile.png'
    },
    { 
      id: 'password', 
      label: 'Password',
      icon: '/icons/password.png',
      titleIcon: '/icons/password.png'
    },
    { 
      id: 'email', 
      label: 'Email',
      icon: '/icons/email.png',
      titleIcon: '/icons/email.png'
    },
    { 
      id: 'phone', 
      label: 'Phone',
      icon: '/icons/phone.png',
      titleIcon: '/icons/phone.png'
    },
  ];

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Show success modal when showSuccessModal is true */}
      {showSuccessModal && <SuccessModal />}
      
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with Image Upload and Tabs */}
          <div className="bg-gray-100 rounded-t-2xl p-6">
            {/* Change from flex to flex-col on mobile, row on larger screens */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Profile Image - centered on mobile */}
              <div className="relative group shrink-0 mb-6 sm:mb-0">
                <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4 text-[#cd4d33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Tabs - full width on mobile */}
              <div className="w-full sm:flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-row items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#cd4d33] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Image
                        src={tab.icon}
                        alt={tab.label}
                        width={20}
                        height={20}
                        className={`${activeTab === tab.id ? 'brightness-200' : ''}`}
                      />
                      <span className="text-sm font-semibold">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-100 rounded-b-2xl p-8 ">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl">
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Image
                      src="/icons/profile.png"
                      alt="Profile"
                      width={32}
                      height={32}
                    />
                    <h2 className="text-2xl font-bold text-gray-800">Edit Profile Information</h2>
                  </div>
                  <div className="relative w-full max-w-[300px]">
                    <div className="h-1 bg-gradient-to-r from-transparent via-[#cd4d33] to-transparent animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      placeholder="Enter your first name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Enter your last name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender_id" className="block text-sm font-sm text-gray-700">
                      Gender <span className="text-primary">*</span>
                    </label>
                    <select
                      id="gender_id"
                      name="gender_id"
                      value={formData.gender_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-gray-500 text-sm px-4 py-3 border border-gray-200 rounded-lg outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="" className="text-gray-200">Select gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">
                      City <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="city_id"
                      name="city_id"
                      placeholder="Enter your city"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="english_level" className="block text-sm  font-medium text-gray-700">
                      English Proficiency <span className="text-primary">*</span>
                    </label>
                    <select
                      id="english_level"
                      name="english_level"
                      value={formData.english_level}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 text-gray-500 text-sm border border-gray-200 rounded-lg outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="" className="text-gray-200">Select proficiency level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Native/Fluent</option>
                    </select>
                  </div>

                  {/* About You in English */}
                  <div className="md:col-span-2">
                    <label htmlFor="about_en" className="block text-sm font-medium text-gray-700">
                      About You (English) <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="about_en"
                      name="about_en"
                      value={formData.about_en}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Write about yourself in English..."
                      className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                    />
                  </div>

                  {/* About You in Arabic */}
                  <div className="md:col-span-2">
                    <label htmlFor="about_ar" className="block text-sm font-medium text-gray-700">
                      About You (Arabic) <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="about_ar"
                      name="about_ar"
                      value={formData.about_ar}
                      onChange={handleInputChange}
                      rows={4}
                      dir="rtl"
                      placeholder="اكتب عن نفسك بالعربية..."
                      className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center md:col-span-2">
                  {submitError && (
                    <p className="text-red-500 mb-4">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 cursor-pointer ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Change Password Form */}
            {activeTab === 'password' && (
              <div className="space-y-6 bg-white p-6 rounded-xl">
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Image
                      src="/icons/password.png"
                      alt="Password"
                      width={32}
                      height={32}
                    />
                    <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                  </div>
                  <div className="relative w-full max-w-[300px]">
                    <div className="h-1 bg-gradient-to-r from-transparent via-[#cd4d33] to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="max-w-md mx-auto">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password"
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <button 
                    type="button" 
                    className="px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Change Email Form */}
            {activeTab === 'email' && (
              <div className="space-y-6 bg-white p-6 rounded-xl">
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Image
                      src="/icons/email.png"
                      alt="Email"
                      width={32}
                      height={32}
                    />
                    <h2 className="text-2xl font-bold text-gray-800">Change Email Address</h2>
                  </div>
                  <div className="relative w-full max-w-[300px]">
                    <div className="h-1 bg-gradient-to-r from-transparent via-[#cd4d33] to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="max-w-md mx-auto">
                  <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
                    New Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="newEmail"
                    placeholder="Enter new email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:border-transparent transition-all duration-200 placeholder:text-gray-300 placeholder:text-sm"
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <button 
                    type="button" 
                    className="px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 cursor-pointer"
                  >
                    Update Email
                  </button>
                </div>
              </div>
            )}

            {/* Change Phone Number Form */}
            {activeTab === 'phone' && (
              <div className="space-y-6 bg-white p-6 rounded-xl">
                <div className="space-y-6">
                  <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <Image
                        src="/icons/phone.png"
                        alt="Phone"
                        width={32}
                        height={32}
                      />
                      <h2 className="text-2xl font-bold text-gray-800">Change Phone Number</h2>
                    </div>
                    <div className="relative w-full max-w-[300px]">
                      <div className="h-1 bg-gradient-to-r from-transparent via-[#cd4d33] to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="max-w-md mx-auto">
                    <label htmlFor="newPhone" className="block text-sm font-medium text-gray-700">
                      New Phone Number <span className="text-primary">*</span>
                    </label>
                    <PhoneInput
                      country={'sa'}
                      value={phone}
                      onChange={phone => setPhone(phone)}
                      containerClass="mt-1"
                      inputStyle={{
                        width: '100%',
                        height: '45px',
                        fontSize: '15px',
                        borderRadius: '0.5rem',
                        borderColor: '#E5E7EB',
                        backgroundColor: 'white'
                      }}
                      buttonStyle={{
                        borderRadius: '0.5rem 0 0 0.5rem',
                        borderColor: '#E5E7EB',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>
                  <div className="flex justify-center mt-8">
                    <button 
                      type="button" 
                      className="px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 cursor-pointer"
                    >
                      Update Phone Number
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileForm;