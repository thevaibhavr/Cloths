'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, getDiscountPercentage, getConditionColor } from '../utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
        
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
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-pink-500 hover:text-pink-600 transition-colors">
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
} 