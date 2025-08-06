import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Category, 
  Product, 
  Order, 
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CreateOrderData,
  UpdateProfileData,
  ChangePasswordData
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use the correct backend URL directly
    // this.baseURL = 'http://localhost:5000/api';
    this.baseURL = 'https://cloth-backend-tpce.onrender.com/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('user_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_data');
          // Redirect to login page if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/register', data);
    return response.data.data!;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', credentials);
    return response.data.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.get('/auth/me');
    return response.data.data!.user;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.put('/auth/profile', data);
    return response.data.data!.user;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response: AxiosResponse<ApiResponse<{ message: string }>> = await this.api.put('/auth/change-password', data);
    return response.data.data!;
  }

  // Categories endpoints
  async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<ApiResponse<{ categories: Category[]; totalPages: number; currentPage: number; total: number }>> = await this.api.get('/categories');
    return response.data.data!.categories || [];
  }

  async getCategory(id: string): Promise<Category> {
    const response: AxiosResponse<ApiResponse<{ category: Category }>> = await this.api.get(`/categories/${id}`);
    return response.data.data!.category;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response: AxiosResponse<ApiResponse<{ category: Category }>> = await this.api.get(`/categories/slug/${slug}`);
    return response.data.data!.category;
  }

  // Products endpoints
  async getProducts(page = 1, limit = 12, filters?: Record<string, any>): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response: AxiosResponse<ApiResponse<{ products: Product[]; totalPages: number; currentPage: number; total: number }>> = await this.api.get(`/products?${params}`);
    const data = response.data.data!;
    return {
      products: data.products || [],
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      total: data.total
    };
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<{ product: Product }>> = await this.api.get(`/products/${id}`);
    return response.data.data!.product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<{ product: Product }>> = await this.api.get(`/products/slug/${slug}`);
    return response.data.data!.product;
  }

  async getProductsByCategory(categoryId: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response: AxiosResponse<ApiResponse<{ products: Product[]; totalPages: number; currentPage: number; total: number }>> = await this.api.get(`/products/category/${categoryId}?${params}`);
    const data = response.data.data!;
    return {
      products: data.products || [],
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      total: data.total
    };
  }

  async searchProducts(query: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      limit: limit.toString()
    });
    const response: AxiosResponse<ApiResponse<{ products: Product[]; totalPages: number; currentPage: number; total: number }>> = await this.api.get(`/products?${params}`);
    const data = response.data.data!;
    return {
      products: data.products || [],
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      total: data.total
    };
  }

  // Orders endpoints
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response: AxiosResponse<ApiResponse<{ order: Order }>> = await this.api.post('/orders', data);
    return response.data.data!.order;
  }

  async getOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response: AxiosResponse<ApiResponse<{ orders: Order[]; totalPages: number; currentPage: number; total: number }>> = await this.api.get(`/orders?${params}`);
    const data = response.data.data!;
    return {
      orders: data.orders || [],
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      total: data.total
    };
  }

  async getOrder(id: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<{ order: Order }>> = await this.api.get(`/orders/${id}`);
    return response.data.data!.order;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<{ order: Order }>> = await this.api.put(`/orders/${id}/cancel`);
    return response.data.data!.order;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response: AxiosResponse<{ status: string; message: string }> = await this.api.get('/health');
    return response.data;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService(); 