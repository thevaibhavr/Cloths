'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { formatPrice, getDiscountPercentage, getConditionColor } from '../utils';
import { useCart } from '../context/CartContext';
import { isExternalImage, isValidImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, wishlistItems } = useCart();
  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  // Auto-slide functionality with Framer Motion
  useEffect(() => {
    if (product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 3000);

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

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
                className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isInWishlist 
              ? 'bg-pink-500 text-white' 
              : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
            {product.condition}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Owner Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {product.owner.name.charAt(0)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">{product.owner.rating}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{product.owner.location.split(',')[0]}</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Product Details */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Size: {product.size}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{product.color}</span>
          </div>
          <span className="text-xs text-gray-500">{product.brand}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
          <span className="text-xs text-gray-500">for {product.rentalDuration} days</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isInWishlist 
                ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 