'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { getCategoryById, getProductsByCategory } from '../../data/products';
import { ArrowLeft, Filter, Grid, List, X } from 'lucide-react';
import Link from 'next/link';
import { Category, Product } from '../../types';

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { categoryId } = await params;
        const categoryData = await getCategoryById(categoryId);
        const productsData = await getProductsByCategory(categoryId);

        if (!categoryData) {
          notFound();
        }

        setCategory(categoryData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/categories"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-1">
                {category.description} • {products.length} items available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-24">
              {/* Mobile Filter Header */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Filter Header */}
              <div className="hidden lg:flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹1,000', count: products.filter(p => p.price < 1000).length },
                    { label: '₹1,000 - ₹2,000', count: products.filter(p => p.price >= 1000 && p.price <= 2000).length },
                    { label: '₹2,000 - ₹3,000', count: products.filter(p => p.price > 2000 && p.price <= 3000).length },
                    { label: 'Above ₹3,000', count: products.filter(p => p.price > 3000).length },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                      <span className="text-sm text-gray-700">{range.label}</span>
                      <span className="text-xs text-gray-500">({range.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
                <div className="space-y-2">
                  {['Excellent', 'Good', 'Fair'].map((condition) => (
                    <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Color</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Red', 'Black', 'Green', 'Pink', 'Gold', 'Blue'].map((color) => (
                    <label key={color} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-pink-500 focus:ring-pink-500" />
                      <span className="text-sm text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button className="w-full text-sm text-pink-600 hover:text-pink-700 font-medium">
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {products.length} items found
                  </span>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Rating</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later for new items.
                </p>
                <button className="text-pink-600 hover:text-pink-700 font-medium">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 