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
  data: UserData; 
}

interface VerifyOTPRequest {
  token: string;
  code: number; 
}

export const authAPI = {
  register: async (data: any): Promise<RegisterResponse> => {
    console.log('Sending registration request:', data);
    try {
      const response = await apiClient.post('/host/auth/register', data);
      console.log('Registration response:', response.data);
      return {
        message: response.data.message,
        verfication_token: response.data.verfication_token
      };
    } catch (error) {
      console.log('Registration error:', error);
      throw error;
    }
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    console.log('Starting OTP verification with data:', { token: 'XXXXX', code: data.code });
    
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
      
      // Log response for debugging (remove sensitive data)
      console.log('OTP verification response status:', response.status);
      console.log('OTP verification successful:', !!response.data?.data);

      if (!response.data?.data) {
        throw new Error('Invalid OTP verification response');
      }

      return response.data;

    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle specific API errors
        const errorMessage = error.response?.data?.message || 'OTP verification failed';
        console.error('OTP verification API error:', errorMessage);
        throw new Error(errorMessage);
      }
      console.error('OTP verification error:', error);
      throw error;
    }
  }
};
