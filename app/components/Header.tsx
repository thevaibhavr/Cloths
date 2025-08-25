'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu, X, Heart, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { getCartItemCount } = useCart();

  const cartItemCount = getCartItemCount();
  const hasItems = cartItemCount > 0;

  // Handle scroll to hide/show header
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If there are items in cart, always show header
      if (hasItems) {
        setIsVisible(true);
        return;
      }
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else {
        // Scrolling up - show header
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hasItems]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);



  return (
    <header className={`bg-white shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${hasItems ? 'shadow-xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-20 h-20 relative">
              <Image
                src="/logo.png"
                alt="Rent the moment"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Rent the moment
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/checkout/guest" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>
            <Link
              href="tel:9926503468"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 font-bold shadow-lg flex items-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </Link>
            <Link
              href="/list-item"
              className="bg-black text-white border border-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-bold shadow-lg"
            >
              List Item
            </Link>
          </div>

          {/* Mobile Cart Icon */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/checkout/guest" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>
            <button
              className="p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for dresses, lehengas, shoes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                Categories
              </Link>
              <Link href="/how-it-works" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                About
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link href="/checkout/guest" onClick={() => setIsMenuOpen(false)} className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="tel:9926503468"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 font-bold flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Link>
                <Link
                  href="/list-item"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-black text-white border border-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-bold"
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