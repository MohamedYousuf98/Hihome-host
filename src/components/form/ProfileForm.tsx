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
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await profileAPI.getProfile();
        setProfile(response.data);
        
        // Pre-fill form data
        if (response.data) {
          console.log('Received profile data:', response.data);
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
        if (err instanceof Error && err.message.includes('Please login')) {
          window.location.href = '/login';
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

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
      console.log('Submitting form data:', formData);

      const response = await profileAPI.updateProfile(formData);
      console.log('Profile updated successfully:', response);
      
      // Update local profile state
      setProfile(response.data);
      
      // Show success message (you can add a toast notification here)
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with Image Upload and Tabs */}
          <div className="bg-gray-100 rounded-t-2xl p-6">
            <div className="flex items-center gap-8">
              {/* Profile Image */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              {/* Tabs */}
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-3">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-[#cd4d33] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Image
                        src={tab.icon}
                        alt={tab.label}
                        width={24}
                        height={24}
                        className="mb-2"
                      />
                      <span className="text-sm font-semibold">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-b-2xl p-8 shadow-sm">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender_id" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender_id"
                      name="gender_id"
                      value={formData.gender_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="city_id"
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="english_level" className="block text-sm font-medium text-gray-700">
                      English Proficiency
                    </label>
                    <select
                      id="english_level"
                      name="english_level"
                      value={formData.english_level}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    >
                      <option>Select proficiency level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Native/Fluent</option>
                    </select>
                  </div>

                  {/* About You in English */}
                  <div className="md:col-span-2">
                    <label htmlFor="about_en" className="block text-sm font-medium text-gray-700">
                      About You (English)
                    </label>
                    <textarea
                      id="about_en"
                      name="about_en"
                      value={formData.about_en}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                      placeholder="Write about yourself in English..."
                    />
                  </div>

                  {/* About You in Arabic */}
                  <div className="md:col-span-2">
                    <label htmlFor="about_ar" className="block text-sm font-medium text-gray-700">
                      About You (Arabic)
                    </label>
                    <textarea
                      id="about_ar"
                      name="about_ar"
                      value={formData.about_ar}
                      onChange={handleInputChange}
                      rows={4}
                      dir="rtl"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                      placeholder="اكتب عن نفسك بالعربية..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end md:col-span-2">
                  {submitError && (
                    <p className="text-red-500 mb-4">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 ${
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
                <div className="flex justify-center items-center space-x-3 mb-10">
                  <Image
                    src="/icons/password.png"
                    alt="Password"
                    width={32}
                    height={32}
                  />
                  <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                </div>
                <div className="max-w-md mx-auto">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <button type="button" className="px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Change Email Form */}
            {activeTab === 'email' && (
              <div className="space-y-6 bg-white p-6 rounded-xl">
                <div className="flex justify-center items-center space-x-3 mb-10">
                  <Image
                    src="/icons/email.png"
                    alt="Email"
                    width={32}
                    height={32}
                  />
                  <h2 className="text-2xl font-bold text-gray-800">Change Email Address</h2>
                </div>
                <div className="max-w-md mx-auto">
                  <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
                    New Email
                  </label>
                  <input
                    type="email"
                    id="newEmail"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cd4d33] focus:border-transparent transition-all duration-200"
                    placeholder="Enter new email"
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <button type="button" className="px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200">
                    Update Email
                  </button>
                </div>
              </div>
            )}

            {/* Change Phone Number Form */}
            {activeTab === 'phone' && (
              <div className="space-y-6 bg-white p-6 rounded-xl">
                <div className="flex justify-center items-center space-x-3 mb-10">
                  <Image
                    src="/icons/phone.png"
                    alt="Phone"
                    width={32}
                    height={32}
                  />
                  <h2 className="text-2xl font-bold text-gray-800">Change Phone Number</h2>
                </div>
                <div className="max-w-md mx-auto">
                  <label htmlFor="newPhone" className="block text-sm font-medium text-gray-700">
                    New Phone Number
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
                  <button type="button" className="px-6 py-2 bg-[#cd4d33] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200">
                    Update Phone Number
                  </button>
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