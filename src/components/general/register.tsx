'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { z } from 'zod';
import { authAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

const registerSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[A-Za-z\s]+$/, 'First name should only contain letters'),
  last_name: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[A-Za-z\s]+$/, 'Last name should only contain letters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[0-9])/, 'Password must contain at least one number')
    .regex(/^[A-Za-z\d@$!%*?&]+$/, 'Password can only contain letters, numbers, and special characters'),
  confirmPassword: z.string(),
  city: z.string().min(2, 'City is required'),
  gender: z.enum(['male', 'female', 'other'], { 
    required_error: 'Please select your gender',
    invalid_type_error: 'Please select a valid gender option'
  }),
  english_proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native'], { 
    required_error: 'Please select your English level',
    invalid_type_error: 'Please select a valid English level'
  }),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterSchema = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterSchema>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    gender: '' as RegisterSchema['gender'],
    english_proficiency: '' as RegisterSchema['english_proficiency'],
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [otpCode, setOTPCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = registerSchema.parse(formData);

      const apiData = {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        email: validatedData.email,
        password: validatedData.password,
        phone: validatedData.phone.startsWith('+') ? validatedData.phone.substring(1) : validatedData.phone,
        // The following IDs should be obtained from your backend or configuration
        city_id: 'e12e21-eqeww',
        gender_id: '12rwr2-231',
        english_id: 'qwr2-r23d'
      };

      const response = await authAPI.register(apiData);
      
      if (response?.verfication_token) {
        localStorage.setItem('registration_token', response.verfication_token);
        setVerificationToken(response.verfication_token);
        setShowOTPModal(true);
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0].toString();
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      } else if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message 
          || 'Registration failed. Please check your information and try again.';
        
        if (error.response?.data?.errors?.email) {
          setErrors({ email: 'This email is already registered' });
        } else if (error.response?.data?.errors?.phone) {
          setErrors({ phone: 'This phone number is already registered' });
        } else {
          setErrors({ submit: errorMessage });
        }
      } else {
        setErrors({ 
          submit: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const storedToken = localStorage.getItem('registration_token');
      
      if (!storedToken) {
        throw new Error('Registration token not found');
      }

      const response = await authAPI.verifyOTP({
        token: storedToken,
        code: parseInt(otpCode, 10)
      });

      if (response.data) {
        localStorage.removeItem('registration_token');
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUser(response.data);
        setVerificationSuccess(true);
        
        setTimeout(() => {
          router.push('/home');
        }, 300000);
      }

    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Invalid verification code';
        setErrors({ otp: errorMessage });
      } else {
        setErrors({ 
          otp: error instanceof Error ? error.message : 'Failed to verify code'
        });
      }
      setVerificationSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none placeholder-gray-400 text-black ";
  const errorStyle = "text-primary text-sm mt-1";

  return (
    <div className="flex">
      {!showOTPModal ? (
        <div className="w-full px-8 md:w-2/3 sm:px-5 md:px-5 xl:px-32 2xl:px-62 bg-white flex items-center py-20 ">
          <div className="w-full">
            <h2 className="text-xl md:text-4xl font-bold mb-2 text-black text-center relative animate-fade-in">
              Create Account
            </h2>
            <div className="flex items-center justify-center mb-12">
              <div className="relative w-full max-w-[300px]">
                <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
              </div>
            </div>
        
            <form onSubmit={handleSubmit} className="space-y-5 max-w-[800px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    First Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className={`${inputStyle} ${errors.first_name ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                  {errors.first_name && <p className={errorStyle}>{errors.first_name}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    Last Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className={`${inputStyle} ${errors.last_name ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                  {errors.last_name && <p className={errorStyle}>{errors.last_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`${inputStyle} ${errors.email ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.email && <p className={errorStyle}>{errors.email}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <PhoneInput
                    country={'sa'}
                    containerClass="mt-1"
                    inputStyle={{
                      width: '100%',
                      height: '45px',
                      fontSize: '15px',
                      borderRadius: '0.5rem',
                      borderColor: errors.phone ? '#ff0000' : '#E5E7EB',
                      backgroundColor: 'white'
                    }}
                    buttonStyle={{
                      borderRadius: '0.5rem 0 0 0.5rem',
                      backgroundColor: 'white'
                    }}
                    onChange={(phone: string) => {
                      setFormData({...formData, phone: phone});
                      if (errors.phone) {
                        setErrors({...errors, phone: ''});
                      }
                    }}
                    value={formData.phone}
                    inputProps={{
                      required: true,
                      autoFocus: true
                    }}
                  />
                  {errors.phone && <p className={errorStyle}>{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className={`${inputStyle} ${errors.password ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  {errors.password ? (
                    <div className="text-primary text-sm mt-1 whitespace-pre-line">
                      {errors.password}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm mt-1" data-password-hint>
                      Password must contain at least 8 characters, including uppercase, lowercase and numbers
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    Confirm Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className={`${inputStyle} ${errors.confirmPassword ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                  {errors.confirmPassword && <p className={errorStyle}>{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    City <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    className={`${inputStyle} ${errors.city ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                  {errors.city && <p className={errorStyle}>{errors.city}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    Gender <span className="text-primary">*</span>
                  </label>
                  <select
                    className={`${inputStyle} text-sm ${
                      formData.gender ? 'text-black' : 'text-gray-400'
                    } h-[45px] md:h-auto ${errors.gender ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as RegisterSchema['gender']})}
                    value={formData.gender}
                  >
                    <option value="" className="text-gray-400">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className={errorStyle}>{errors.gender}</p>}
                </div>
                <div className="w-full">
                  <label className="block text-md font-medium text-black mb-1.5">
                    English Level <span className="text-primary">*</span>
                  </label>
                  <select
                    className={`${inputStyle} text-sm ${
                      formData.english_proficiency ? 'text-black' : 'text-gray-400'
                    } h-[45px] md:h-auto ${errors.english_proficiency ? 'border-primary' : ''}`}
                    onChange={(e) => setFormData({...formData, english_proficiency: e.target.value as RegisterSchema['english_proficiency']})}
                    value={formData.english_proficiency}
                  >
                    <option value="" className="text-gray-400">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="native">Native</option>
                  </select>
                  {errors.english_proficiency && <p className={errorStyle}>{errors.english_proficiency}</p>}
                </div>
              </div>

              <div className="mt-6 md:mt-8 w-full">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 px-6 rounded-lg hover:bg-primary/90 transition-colors text-base font-medium cursor-pointer disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Enter Verification Code</h3>
            {verificationSuccess ? (
              <div className="text-green-600 text-center py-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-lg font-medium">Verification Successful!</p>
                <p className="text-sm mt-2">Redirecting to home page...</p>
              </div>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  className={`${inputStyle} text-center text-lg`}
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setOTPCode(value);
                    }
                    if (errors.otp) {
                      setErrors({...errors, otp: ''});
                    }
                  }}
                  maxLength={4}
                  pattern="\d{4}"
                  autoFocus
                />
                {errors.otp && <p className={errorStyle}>{errors.otp}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 px-6 rounded-lg hover:bg-primary/90 transition-colors text-base font-medium cursor-pointer mt-4 disabled:opacity-50"
                  disabled={isLoading || !otpCode}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="hidden md:block md:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bg2.webp"
            alt="Background image"
            fill={true}
            sizes="33vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className="absolute inset-0 bg-primary opacity-85" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          <h3 className="text-4xl font-bold mb-4">Welcome Back!</h3>
          <p className="text-center text-lg">Join our community and experience unique stays with amazing hosts in our global hospitality network.</p>
        </div>
      </div>
    </div>
  );
}
