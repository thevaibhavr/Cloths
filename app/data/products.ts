import { Category, Product } from '../types';

// Fetch categories from JSON file
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/data/categories.json');
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

// Fetch products from JSON file
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/data/products.json');
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(product => product.category === categoryId);
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(product => product.id === id);
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(category => category.id === id);
} 