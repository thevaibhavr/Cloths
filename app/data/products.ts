import { Category, Product } from '../types';

export const categories: Category[] = [
  {
    id: 'lehengas',
    name: 'Lehengas',
    description: 'Traditional Indian bridal and party wear lehengas',
    image: '/images/categories/lehengas.jpg',
    productCount: 24
  },
  {
    id: 'western-dresses',
    name: 'Western Dresses',
    description: 'Elegant western dresses for special occasions',
    image: '/images/categories/western-dresses.jpg',
    productCount: 18
  },
  {
    id: 'traditional-dresses',
    name: 'Traditional Dresses',
    description: 'Sarees, salwar kameez, and ethnic wear',
    image: '/images/categories/traditional-dresses.jpg',
    productCount: 32
  },
  {
    id: 'shoes',
    name: 'Shoes & Footwear',
    description: 'Designer heels, sandals, and traditional footwear',
    image: '/images/categories/shoes.jpg',
    productCount: 15
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Jewelry, bags, and fashion accessories',
    image: '/images/categories/accessories.jpg',
    productCount: 28
  },
  {
    id: 'suits',
    name: 'Suits & Blazers',
    description: 'Formal suits and blazers for professional events',
    image: '/images/categories/suits.jpg',
    productCount: 12
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Red Bridal Lehenga',
    description: 'Stunning red bridal lehenga with intricate embroidery and mirror work. Perfect for wedding ceremonies and special occasions. Features heavy zari work and stone embellishments.',
    category: 'lehengas',
    price: 2500,
    originalPrice: 15000,
    size: 'M',
    condition: 'Excellent',
    brand: 'Designer Collection',
    material: 'Silk & Velvet',
    color: 'Red',
    images: [
      '/images/products/lehenga-1-1.jpg',
      '/images/products/lehenga-1-2.jpg',
      '/images/products/lehenga-1-3.jpg',
      '/images/products/lehenga-1-4.jpg'
    ],
    owner: {
      name: 'Priya Sharma',
      rating: 4.8,
      totalRentals: 45,
      location: 'Mumbai, Maharashtra',
      joinDate: '2022-03-15'
    },
    availability: {
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      isAvailable: true
    },
    tags: ['Bridal', 'Wedding', 'Heavy Work', 'Red'],
    rentalDuration: 7,
    deposit: 5000
  },
  {
    id: '2',
    name: 'Elegant Black Evening Gown',
    description: 'Sophisticated black evening gown with a fitted silhouette and elegant train. Perfect for formal events, galas, and cocktail parties. Features satin finish and side slit.',
    category: 'western-dresses',
    price: 1800,
    originalPrice: 12000,
    size: 'L',
    condition: 'Good',
    brand: 'Elegance Boutique',
    material: 'Satin',
    color: 'Black',
    images: [
      '/images/products/gown-1-1.jpg',
      '/images/products/gown-1-2.jpg',
      '/images/products/gown-1-3.jpg'
    ],
    owner: {
      name: 'Anjali Patel',
      rating: 4.6,
      totalRentals: 32,
      location: 'Delhi, NCR',
      joinDate: '2021-11-20'
    },
    availability: {
      startDate: '2024-01-10',
      endDate: '2024-11-30',
      isAvailable: true
    },
    tags: ['Evening', 'Formal', 'Cocktail', 'Black'],
    rentalDuration: 5,
    deposit: 3000
  },
  {
    id: '3',
    name: 'Designer Silk Saree',
    description: 'Beautiful silk saree with traditional motifs and gold border. Perfect for festivals, family functions, and cultural events. Features handwoven design and pure silk fabric.',
    category: 'traditional-dresses',
    price: 1200,
    originalPrice: 8000,
    size: 'Free Size',
    condition: 'Excellent',
    brand: 'Heritage Weaves',
    material: 'Pure Silk',
    color: 'Green',
    images: [
      '/images/products/saree-1-1.jpg',
      '/images/products/saree-1-2.jpg',
      '/images/products/saree-1-3.jpg'
    ],
    owner: {
      name: 'Meera Iyer',
      rating: 4.9,
      totalRentals: 67,
      location: 'Bangalore, Karnataka',
      joinDate: '2020-08-10'
    },
    availability: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isAvailable: true
    },
    tags: ['Traditional', 'Silk', 'Festival', 'Green'],
    rentalDuration: 3,
    deposit: 2000
  },
  {
    id: '4',
    name: 'Stiletto Heels - Gold',
    description: 'Elegant gold stiletto heels with crystal embellishments. Perfect for parties, weddings, and special occasions. Features comfortable padding and secure ankle strap.',
    category: 'shoes',
    price: 800,
    originalPrice: 4500,
    size: '7',
    condition: 'Good',
    brand: 'Luxury Steps',
    material: 'Synthetic Leather',
    color: 'Gold',
    images: [
      '/images/products/heels-1-1.jpg',
      '/images/products/heels-1-2.jpg'
    ],
    owner: {
      name: 'Riya Gupta',
      rating: 4.7,
      totalRentals: 28,
      location: 'Pune, Maharashtra',
      joinDate: '2022-06-12'
    },
    availability: {
      startDate: '2024-01-05',
      endDate: '2024-10-31',
      isAvailable: true
    },
    tags: ['Heels', 'Gold', 'Crystal', 'Party'],
    rentalDuration: 3,
    deposit: 1500
  },
  {
    id: '5',
    name: 'Pearl Necklace Set',
    description: 'Elegant pearl necklace set with matching earrings. Perfect for traditional and western outfits. Features freshwater pearls and silver-plated finish.',
    category: 'accessories',
    price: 600,
    originalPrice: 3500,
    size: 'Adjustable',
    condition: 'Excellent',
    brand: 'Pearl Paradise',
    material: 'Freshwater Pearls',
    color: 'White',
    images: [
      '/images/products/necklace-1-1.jpg',
      '/images/products/necklace-1-2.jpg'
    ],
    owner: {
      name: 'Kavya Reddy',
      rating: 4.5,
      totalRentals: 41,
      location: 'Hyderabad, Telangana',
      joinDate: '2021-09-05'
    },
    availability: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isAvailable: true
    },
    tags: ['Pearl', 'Necklace', 'Traditional', 'Elegant'],
    rentalDuration: 2,
    deposit: 1000
  },
  {
    id: '6',
    name: 'Navy Blue Business Suit',
    description: 'Professional navy blue business suit with tailored fit. Perfect for corporate meetings, interviews, and formal business events. Features wool blend fabric.',
    category: 'suits',
    price: 1500,
    originalPrice: 9000,
    size: 'M',
    condition: 'Good',
    brand: 'Corporate Style',
    material: 'Wool Blend',
    color: 'Navy Blue',
    images: [
      '/images/products/suit-1-1.jpg',
      '/images/products/suit-1-2.jpg',
      '/images/products/suit-1-3.jpg'
    ],
    owner: {
      name: 'Aditi Singh',
      rating: 4.4,
      totalRentals: 23,
      location: 'Chennai, Tamil Nadu',
      joinDate: '2022-01-18'
    },
    availability: {
      startDate: '2024-01-10',
      endDate: '2024-09-30',
      isAvailable: true
    },
    tags: ['Business', 'Formal', 'Corporate', 'Professional'],
    rentalDuration: 4,
    deposit: 2500
  },
  {
    id: '7',
    name: 'Pink Floral Lehenga',
    description: 'Beautiful pink floral lehenga with light embroidery and mirror work. Perfect for engagement ceremonies and pre-wedding functions. Features comfortable fit and breathable fabric.',
    category: 'lehengas',
    price: 1800,
    originalPrice: 11000,
    size: 'S',
    condition: 'Excellent',
    brand: 'Floral Dreams',
    material: 'Georgette',
    color: 'Pink',
    images: [
      '/images/products/lehenga-2-1.jpg',
      '/images/products/lehenga-2-2.jpg',
      '/images/products/lehenga-2-3.jpg'
    ],
    owner: {
      name: 'Zara Khan',
      rating: 4.8,
      totalRentals: 38,
      location: 'Lucknow, Uttar Pradesh',
      joinDate: '2021-12-03'
    },
    availability: {
      startDate: '2024-01-15',
      endDate: '2024-11-30',
      isAvailable: true
    },
    tags: ['Floral', 'Engagement', 'Light Work', 'Pink'],
    rentalDuration: 5,
    deposit: 3500
  },
  {
    id: '8',
    name: 'Cocktail Dress - Emerald',
    description: 'Stunning emerald green cocktail dress with sequin embellishments. Perfect for cocktail parties, birthday celebrations, and evening events. Features bodycon fit and side slit.',
    category: 'western-dresses',
    price: 1400,
    originalPrice: 8500,
    size: 'M',
    condition: 'Good',
    brand: 'Glamour Nights',
    material: 'Crepe',
    color: 'Emerald Green',
    images: [
      '/images/products/cocktail-1-1.jpg',
      '/images/products/cocktail-1-2.jpg',
      '/images/products/cocktail-1-3.jpg'
    ],
    owner: {
      name: 'Sneha Verma',
      rating: 4.6,
      totalRentals: 29,
      location: 'Jaipur, Rajasthan',
      joinDate: '2022-04-22'
    },
    availability: {
      startDate: '2024-01-08',
      endDate: '2024-10-31',
      isAvailable: true
    },
    tags: ['Cocktail', 'Sequin', 'Bodycon', 'Emerald'],
    rentalDuration: 4,
    deposit: 2000
  }
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
}; 