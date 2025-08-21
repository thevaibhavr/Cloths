'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { formatPrice, getDiscountPercentage, getConditionColor } from '../utils';
import { useCart } from '../contexts/CartContext';
import { isExternalImage, isValidImageUrl, handleImageError } from '../utils/imageUtils';
import RentModal from './RentModal';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: ''
  });
  const { addToCart, getCartItem, getCartItemCount } = useCart();
  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
  
  const cartItem = getCartItem(product._id);
  const isInCart = !!cartItem;

  // Check if product is in wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some((item: any) => item._id === product._id));
  }, [product._id]);

  // Auto-slide functionality with Framer Motion
  useEffect(() => {
    if (product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [product.images.length]);

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleAddToCart = () => {
    addToCart(product, 1, product.rentalDuration);
  };

  const handleRentNow = () => {
    setShowRentModal(true);
  };

  const handleConfirmRent = () => {
    if (rentalDates.startDate && rentalDates.endDate) {
      addToCart(product, 1, product.rentalDuration, rentalDates);
      setShowRentModal(false);
      setRentalDates({ startDate: '', endDate: '' });
    }
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item: any) => item._id !== product._id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, product];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(true);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {isValidImageUrl(product.images[currentImageIndex]) ? (
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => handleImageError(e)}
                unoptimized={isExternalImage(product.images[currentImageIndex])}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Image not available</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group/wishlist shadow-lg"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 group-hover/wishlist:text-red-500'
            }`}
          />
        </button>
        
        {/* Discount Badge */}
        {product.originalPrice > 0 && discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-12 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Featured
          </div>
        )}
        
        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-yellow-400' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConditionColor(product.condition)}`}>
            {product.condition}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {variant === 'default' ? (
          <>
            {/* Categories */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 flex-wrap">
                {/* Show multiple categories if available, otherwise show single category */}
                {product.categories && product.categories.length > 0 && product.categories.some((cat: any) => typeof cat === 'object' && cat.name) ? (
                  // Show populated categories
                  product.categories
                    .filter((cat: any) => typeof cat === 'object' && cat.name)
                    .map((category: any, index: number) => (
                      <span 
                        key={category._id} 
                        className="text-xs text-gray-600 bg-yellow-100 px-3 py-1 rounded-full font-medium"
                      >
                        {category.name}
                      </span>
                    ))
                ) : (
                  // Fallback to single category
                  <span className="text-xs text-gray-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">
                    {product.category.name}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>{product.views} views</span>
              </div>
            </div>

            {/* Product Name */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-bold text-black mb-2 hover:text-yellow-600 transition-colors line-clamp-2 text-lg">
                {product.name}
              </h3>
            </Link>

            {/* Product Details */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Sizes: {product.sizes.map((s: { size: string }) => s.size).join(', ')}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600">{product.color}</span>
              </div>
              {product.brand && (
                <span className="text-xs text-gray-600 font-medium">{product.brand}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-black">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">for {product.rentalDuration} days</span>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {isInCart ? (
                <Link
                  href="/cart"
                  className="w-1/2 bg-green-600 text-white text-sm font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 text-center shadow-lg"
                >
                  Go to Cart ({cartItem?.quantity})
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className={`w-1/2 text-sm font-bold py-3 px-4 rounded-lg transition-all duration-200 text-center shadow-lg ${
                    product.isAvailable
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.isAvailable ? 'Add to Cart' : 'Not Available'}
                </button>
              )}
              <Link
                href={`/product/${product.slug}`}
                className="w-1/2 bg-black text-white hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                <span className="sr-only">View Details</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Compact Version - Product Name */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-bold text-black mb-3 hover:text-yellow-600 transition-colors line-clamp-2 text-sm">
                {product.name}
              </h3>
            </Link>

            {/* Compact Version - Price Only */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-black">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Compact Version - Small Add to Cart Button */}
            <div className="flex space-x-2">
              {isInCart ? (
                <Link
                  href="/cart"
                  className="w-1/2 bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-green-700 transition-all duration-200 text-center"
                >
                  Cart ({cartItem?.quantity})
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className={`w-1/2 text-xs font-bold py-2 px-3 rounded-lg transition-all duration-200 text-center ${
                    product.isAvailable
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.isAvailable ? 'Add to Cart' : 'Not Available'}
                </button>
              )}
              <Link
                href={`/product/${product.slug}`}
                className="w-1/2 bg-black text-white hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center justify-center px-3 py-2"
              >
                <span className="sr-only">View Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Rent Modal */}
      <RentModal
        isOpen={showRentModal}
        onClose={() => setShowRentModal(false)}
        product={product}
        rentalDates={rentalDates}
        onRentalDatesChange={setRentalDates}
        onConfirmRent={handleConfirmRent}
      />
    </motion.div>
  );
} 