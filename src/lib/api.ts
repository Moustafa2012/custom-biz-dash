import { 
  LoginInput as LoginRequest, 
  AuthResponseDto as LoginResponse, 
  TwoFactorRequiredDto as TwoFactorLoginResponse,
  TwoFactorVerifyInput as TwoFactorRequest,
  AuthResponseDto as TwoFactorResponse,
  ApiResponseDto as ApiResponse,
  UserDto
} from '@shared/validation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data.error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 0);
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyTwoFactor(data: TwoFactorRequest): Promise<ApiResponse<TwoFactorResponse>> {
    return this.request<TwoFactorResponse>('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendTwoFactorCode(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/resend-2fa', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getProfile(): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>('/auth/profile');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Even if logout request fails, we should clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  }
}

export const apiService = new ApiService();
export { ApiError };
export type { ApiResponse, LoginRequest, LoginResponse, TwoFactorLoginResponse, TwoFactorRequest, TwoFactorResponse, UserDto };
