import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ApiResponse 
} from '../types';
import { apiService } from './api.service';

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'authUser';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>(
        '/auth/login', 
        credentials
      );
      
      if (response.success && response.data) {
        this.setAuthData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>(
        '/auth/register', 
        userData
      );
      
      if (response.success && response.data) {
        this.setAuthData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<ApiResponse<User>>('/auth/profile');
      
      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return null;
    }
  }

  async uploadProfileImage(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await apiService.postFormData<ApiResponse<User>>(
        '/auth/profile/image',
        formData
      );

      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = '/login';
  }

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
  }

  hasRole(requiredRole: string): boolean {
    const user = this.getStoredUser();
    return user?.role === requiredRole;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();
    return user ? roles.includes(user.role) : false;
  }
}

export const authService = new AuthService();