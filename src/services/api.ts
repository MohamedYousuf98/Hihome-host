import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://6c733c06-d83f-4f67-bc78-578e26b8f936.mock.pstmn.io/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept-Language': 'en',
    'Accept-Currency': 'sar',
    'Platform': 'iOS',
    'Version': '1.1.2',
    'x-api-key': 'PMAK-6522b362f515e100386afb67-59cdcd0cfc69a2d0470c4f94aebf4dbd9e',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add axios interceptor to handle authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface RegisterResponse {
  message: string | null;
  verfication_token: string;
}

export interface UserResource {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
 
}

interface UserImage {
  id: string;
  path: string;
  path_thumbnail: string;
  mime_type: string;
}

interface Gender {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  social_id: string | null;
  social_type: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  image: UserImage;
  gender: Gender;
  country: Country;
  about: string;
  notifications_count: number;
  access_token: string;
}

export interface VerifyOTPResponse {
  message: string | null;
  status: boolean;
  verification_status: boolean;
  data?: UserData; 
}

interface VerifyOTPRequest {
  token: string;
  code: number; 
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  message: string | null;
  data: UserData | null;
  registered: boolean;  
  status?: boolean;
}

export interface ResendOTPResponse {
  message: string | null;
  data: {
    verification_token: string;
  };
}

// Add these new interfaces
export interface City {
  id: string;
  name_en: string; 
  name_ar: string;
  activation: number;
  created_at: string;
  updated_at: string;
}

export interface BankInfo {
  holder_name: string;
  bank_name: string;
  account_number: string;
  iban: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  image: UserImage;
  gender: Gender;
  city: City;
  notifications_count: number;
  about: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  user_type: number;
  enable_notifications: boolean;
  bank_info: BankInfo;
}

interface ProfileResponse {
  message: string | null;
  data: UserProfile;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  gender_id: string;
  city_id: string;
  about_en?: string;
  about_ar?: string;
  english_level?: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  gender: string;
  english_proficiency: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post('/host/auth/register', data);
      return {
        message: response.data.message,
        verfication_token: response.data.verfication_token
      };
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    try {
      if (!data.token) {
        throw new Error('Missing verification token');
      }

      if (!data.code || data.code.toString().length !== 4) {
        throw new Error('Invalid OTP code format');
      }

      const response = await apiClient.post('/host/auth/verify-otp', {
        token: data.token,
        code: data.code
      });
      return response.data;

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          throw new Error('Invalid verification code');
        }
        throw new Error(error.response?.data?.message || 'Verification failed');
      }
      throw error;
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post('http://dashboard.hihome.sa/api/v1/host/auth/login', data, {
        headers: {
          'Accept-Language': 'en',
          'Accept-Currency': 'sar',
          'Platform': 'iOS',
          'Version': '1.1.2',
          'x-api-key': 'PMAK-6522b362f515e100386afb67-59cdcd0cfc69a2d0470c4f94aebf4dbd9e',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      // Save token after successful login
      if (response.data?.data?.access_token) {
        localStorage.setItem('accessToken', response.data.data.access_token);
      }

      return {
        ...response.data,
        registered: true,
        status: true
      };
      
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return {
            message: 'User not found',
            data: null,
            registered: false,
            status: false
          };
        } else if (error.response?.status === 401) {
          throw new Error('Invalid credentials. Please check your email/phone and password.');
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('An error occurred during login. Please try again.');
    }
  },

  resendOTP: async (token: string): Promise<ResendOTPResponse> => {
    try {
      const response = await apiClient.post('/host/resend-otp', { token });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('Verification session expired or invalid token. Please try registering again.');
        } else if (error.response?.status === 429) {
          throw new Error('Too many attempts. Please wait before trying again.');
        }
        throw new Error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },
};

// Add this to your existing authAPI object
export const profileAPI = {
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get('/host/profile');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
      }
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.put('/host/profile', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
      throw error;
    }
  }
};
