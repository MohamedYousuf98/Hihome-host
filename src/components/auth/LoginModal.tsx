import React, { useState } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import { z } from 'zod';
import { authAPI } from '@/services/api';
import { useRouter } from 'next/navigation';
import 'react-phone-input-2/lib/style.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(7, 'Invalid phone number').optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[0-9])/, 'Password must contain at least one number')
    .regex(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character')
}).refine((data) => data.email || data.phone, {
  message: "Either email or phone is required"
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState<LoginSchema>({
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting login process');
    setIsLoading(true);
    setErrors({});

    try {
      const loginData = {
        password: formData.password,
        ...(loginMethod === 'email' 
          ? { email: formData.email } 
          : { phone: formData.phone?.startsWith('+') 
              ? formData.phone.substring(1) 
              : formData.phone 
          })
      };

      const validatedData = loginSchema.parse(loginData);
      const response = await authAPI.login(validatedData);

      if (!response.registered || response.status === false) {
        setErrors({ 
          submit: 'This account is not registered. Please sign up first.',
          type: 'error'
        });
        return;
      }

      if (response.data) {
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('accessToken', response.data.access_token);
        onClose();
        router.refresh();
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0].toString();
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ 
          submit: error instanceof Error ? error.message : 'Login failed. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-[480px] relative transform transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Image
            src="/images/HiHome-Logo.webp"
            alt="Logo"
            width={112}
            height={40}
            className="w-28"
          />
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <Image
              src="/images/close-btn.svg"
              alt="close button"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </button>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:px-8 px-4">
          <div className="text-center">
            <h2 className="text-primary text-2xl font-semibold text-center mb-2 mt-8">
              Login
            </h2>
            <p className="text-black text-md">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md cursor-pointer ${
                loginMethod === 'email' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setLoginMethod('email')}
            >
              Email
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md cursor-pointer ${
                loginMethod === 'phone' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setLoginMethod('phone')}
            >
              Phone
            </button>
          </div>

          {loginMethod === 'email' ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className={`${inputStyle} ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <PhoneInput
                country={'sa'}
                value={formData.phone}
                onChange={(phone) => setFormData({...formData, phone})}
                containerClass="w-full"
                inputStyle={{
                  width: '100%',
                  height: '45px',
                  fontSize: '16px',
                  borderRadius: '0.375rem',
                  borderColor: errors.phone ? '#dc2626' : '#d1d5db'
                }}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className={`${inputStyle} ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {errors.submit && (
            <div className={`text-sm text-center ${
              errors.type === 'info' ? 'text-blue-600' : 'text-red-500'
            }`}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>


          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button type="button" className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer">
              <Image src="/images/google.svg" alt="Google" width={24} height={24} />
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
