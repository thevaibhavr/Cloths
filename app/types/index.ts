export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  size: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  brand: string;
  material: string;
  color: string;
  images: string[];
  owner: {
    name: string;
    rating: number;
    totalRentals: number;
    location: string;
    joinDate: string;
  };
  availability: {
    startDate: string;
    endDate: string;
    isAvailable: boolean;
  };
  tags: string[];
  rentalDuration: number; // in days
  deposit: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  totalRentals: number;
  location: string;
  joinDate: string;
  verified: boolean;
} 