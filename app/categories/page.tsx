'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import { getCategories } from '../data/products';
import { Category } from '../types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
              <p className="text-gray-600 mt-1">
                Browse through our complete collection of clothing categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Our Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Traditional Wear
              </h3>
              <p className="text-gray-600 mb-4">
                From elegant lehengas perfect for weddings to beautiful sarees for festivals, 
                our traditional collection celebrates Indian heritage with modern comfort.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bridal and party lehengas</li>
                <li>• Designer sarees and salwar kameez</li>
                <li>• Ethnic fusion wear</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Western Collection
              </h3>
              <p className="text-gray-600 mb-4">
                Contemporary western dresses, gowns, and formal wear for corporate events, 
                parties, and special occasions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Evening gowns and cocktail dresses</li>
                <li>• Business suits and formal wear</li>
                <li>• Party dresses and casual wear</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rental Tips */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Tips for Renting Clothes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Choose the Right Size</h4>
              <p className="text-sm text-gray-600">
                Check our size guide and read customer reviews to ensure the perfect fit.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Book in Advance</h4>
              <p className="text-sm text-gray-600">
                Popular items get booked quickly, so reserve your outfit at least a week in advance.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Check Condition</h4>
              <p className="text-sm text-gray-600">
                All items are quality-checked, but review the condition rating before booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 