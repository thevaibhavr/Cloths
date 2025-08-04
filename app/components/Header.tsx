'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount, getWishlistCount } = useCart();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RentElegance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-pink-600 transition-colors">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-pink-600 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for dresses, lehengas, shoes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors">
              <Heart className="w-5 h-5" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <Link
              href="/list-item"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              List Item
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for dresses, lehengas, shoes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
                Home
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-pink-600 transition-colors">
                Categories
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-pink-600 transition-colors">
                How It Works
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
                About
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getWishlistCount()}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
                <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <Link
                  href="/list-item"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  List Item
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 