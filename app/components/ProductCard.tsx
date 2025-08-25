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
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [needDate, setNeedDate] = useState('');
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

  const handleGetInfo = () => {
    if (typeof window !== 'undefined') {
      const productImage = product.images[currentImageIndex] || product.images[0];
      const message = `May I know about this dress?

*Product Details:*
• Name: ${product.name}
• Price: ₹${product.price}
• Category: ${product.category.name}
• Color: ${product.color}
• Sizes: ${product.sizes.map((s: { size: string }) => s.size).join(', ')}
• Condition: ${product.condition}
• Rental Duration: ${product.rentalDuration} days
• Brand: ${product.brand || 'Not specified'}

*Product Image:* ${productImage}
*Product Link:* ${window.location.origin}/product/${product.slug}`;
      const whatsappUrl = `https://wa.me/919926503468?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleRentNow = () => {
    setShowRentModal(true);
  };

  const handleConfirmRent = () => {
    if (needDate) {
      addToCart(product, 1, 1, needDate); // Always 1 day rental
      setShowRentModal(false);
      setNeedDate('');
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
        className="relative aspect-[3/3.3] overflow-hidden"
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
            className="w-full h-full cursor-pointer"
            onClick={() => router.push(`/product/${product.slug}`)}
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
          onClick={(e) => {
            e.stopPropagation();
            handleWishlistToggle();
          }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
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
              <button
                onClick={handleGetInfo}
                className="w-1/2 bg-green-500 text-white text-sm font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Get Info</span>
              </button>
              <Link
                href={`/product/${product.slug}`}
                className="w-1/2 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg font-semibold"
              >
                <span>View Product</span>
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

            {/* Compact Version - Small Get Info Button */}
            <div className="flex space-x-2">
              <button
                onClick={handleGetInfo}
                className="w-1/2 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-green-600 transition-all duration-200 text-center flex items-center justify-center space-x-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Get Info</span>
              </button>
              <Link
                href={`/product/${product.slug}`}
                className="w-1/2 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg transition-all duration-200 flex items-center justify-center px-3 py-2 font-semibold text-xs"
              >
                <span>View Product</span>
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
        needDate={needDate}
        onNeedDateChange={setNeedDate}
        onConfirmRent={handleConfirmRent}
      />
    </motion.div>
  );
} 