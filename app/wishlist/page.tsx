'use client';

import { useCart } from '../context/CartContext';
import { formatPrice, getDiscountPercentage } from '../utils';
import { Heart, ShoppingBag, Trash2, Star, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { isExternalImage, isValidImageUrl, handleImageError } from '../utils/imageUtils';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    // Default rental dates (7 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    addToCart(product, 1, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <Heart className="w-24 h-24 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">
              Start adding items to your wishlist to save them for later.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <Link
              href="/categories"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
              
              return (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {isValidImageUrl(product.images[0]) ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => handleImageError(e)}
                        unoptimized={isExternalImage(product.images[0])}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Image not available</span>
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Owner Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.owner.rating}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {product.owner.location}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-sm text-gray-600">per day</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="flex-1 text-center py-2 px-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Rent Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 