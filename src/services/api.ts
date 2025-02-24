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


const mockUnregisteredUsers = [
  { email: 'test@unregistered.com', phone: null },
  { email: null, phone: '966500000000' },
  { email: 'fake@example.com', phone: null },
  { email: null, phone: '966511111111' }
];

export const authAPI = {
  register: async (data: any): Promise<RegisterResponse> => {
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
      console.log('Checking credentials:', data);
      
      const isUnregistered = mockUnregisteredUsers.some(user => 
        (data.email && user.email === data.email) || 
        (data.phone && user.phone === data.phone)
      );

      if (isUnregistered) {
        console.log('Detected unregistered user:', data);
        return {
          message: 'User is not registered',
          data: null,
          registered: false,
          status: false
        };
      }

      const response = await apiClient.post('/host/auth/login', data);
      console.log('Server response:', response.data);
      
      return {
        ...response.data,
        registered: true,
        status: true
      };
      
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  },
};
