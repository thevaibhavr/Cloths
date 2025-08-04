'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProductById, getCategoryById } from '../../data/products';
import { formatPrice, formatDate, formatJoinDate, getConditionColor, getDiscountPercentage } from '../../utils';
import { ArrowLeft, Star, MapPin, Calendar, Clock, Shield, Truck, Heart, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const { productId } = await params;
      const productData = getProductById(productId);
      const categoryData = productData ? getCategoryById(productData.category) : null;
      setProduct(productData);
      setCategoryData(categoryData);
    };
    loadProduct();
  }, [params]);

  if (!product) {
    notFound();
  }

  const category = getCategoryById(product.category);
  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href={`/categories/${product.category}`}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-gray-900">Home</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-gray-900">Categories</Link>
                <span>/</span>
                <Link href={`/categories/${product.category}`} className="hover:text-gray-900">
                  {categoryData?.name}
                </Link>
                <span>/</span>
                <span className="text-gray-900">{product.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {discountPercentage}% OFF
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
                  {product.condition}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{product.brand}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm text-gray-500">for {product.rentalDuration} days</span>
              </div>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Size</div>
                <div className="font-medium">{product.size}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Color</div>
                <div className="font-medium">{product.color}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Material</div>
                <div className="font-medium">{product.material}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Deposit</div>
                <div className="font-medium">{formatPrice(product.deposit)}</div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Item Owner</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {product.owner.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{product.owner.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.owner.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.owner.location}</span>
                    </div>
                    <span>•</span>
                    <span>{product.owner.totalRentals} rentals</span>
                    <span>•</span>
                    <span>Joined {formatJoinDate(product.owner.joinDate)}</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Message</span>
                </button>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Availability</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Available From</div>
                  <div className="font-medium">{formatDate(product.availability.startDate)}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Available Until</div>
                  <div className="font-medium">{formatDate(product.availability.endDate)}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
                Rent Now - {formatPrice(product.price)}
              </button>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl text-lg font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-200">
                Add to Wishlist
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-xs text-gray-600">Verified Item</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="text-xs text-gray-600">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="text-xs text-gray-600">Same Day Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Care Instructions</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Dry clean only</li>
                  <li>• Store in a cool, dry place</li>
                  <li>• Avoid direct sunlight</li>
                  <li>• Handle with care</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 