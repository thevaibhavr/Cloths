// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  products?: T[];
  categories?: T[];
  orders?: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// User Types
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Size Types
export interface ProductSize {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';
  isAvailable: boolean;
  quantity: number;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  categories: Category[];
  price: number;
  originalPrice: number;
  sizes: ProductSize[];
  color: string;
  rentalDuration: number;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  brand?: string;
  material?: string;
  images: string[];
  tags: string[];
  careInstructions?: string;
  isFeatured: boolean;
  isAvailable: boolean;
  views: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  product: Product;
  quantity: number;
  rentalDuration: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: string;
  rentalStartDate: string;
  rentalEndDate: string;
  adminNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  rentalDuration: number;
  needDate?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Form Data Types
export interface CreateOrderData {
  items: {
    product: string;
    quantity: number;
    rentalDuration: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  rentalStartDate: string;
  rentalEndDate: string;
  needDate?: string;
  notes?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
} 