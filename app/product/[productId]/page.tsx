'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProductById, getCategoryById } from '../../data/products';
import { formatPrice, formatDate, formatJoinDate, getConditionColor, getDiscountPercentage } from '../../utils';
import { ArrowLeft, Star, MapPin, Calendar, Clock, Shield, Truck, Heart, Share2, MessageCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { isExternalImage, isValidImageUrl, handleImageError } from '../../utils/imageUtils';
import RentModal from '../../components/RentModal';

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: ''
  });
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart();

  // Auto-slide functionality
  useEffect(() => {
    if (product && product.images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [product]);

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
    if (!touchStart || !touchEnd || !product) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
    if (isRightSwipe) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleRentNow = () => {
    setIsRentModalOpen(true);
  };

  const handleConfirmRent = () => {
    addToCart(product, 1, rentalDates);
    setIsRentModalOpen(false);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { productId } = await params;
        const productData = await getProductById(productId);
        const categoryData = productData ? await getCategoryById(productData.category) : null;
        setProduct(productData);
        setCategoryData(categoryData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
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

  if (!product) {
    notFound();
  }

  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

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
            <div 
              className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {isValidImageUrl(product.images[selectedImage]) ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => handleImageError(e)}
                      unoptimized={isExternalImage(product.images[selectedImage])}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Image not available</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {discountPercentage}% OFF
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
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
                    {isValidImageUrl(image) ? (
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => handleImageError(e)}
                        unoptimized={isExternalImage(image)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Image {index + 1}</span>
                      </div>
                    )}
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
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {product.owner.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <h4 className="font-medium text-gray-900 truncate">{product.owner.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.owner.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{product.owner.location}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <span>{product.owner.totalRentals} rentals</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Joined {formatJoinDate(product.owner.joinDate)}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center justify-center sm:justify-start space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg">
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
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRentNow}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Rent Now - {formatPrice(product.price)}</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isInWishlist 
                    ? 'bg-pink-100 text-pink-600 border-2 border-pink-200 hover:bg-pink-200' 
                    : 'border-2 border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </motion.button>
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
      
      {/* Rent Modal */}
      <RentModal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        product={product}
        rentalDates={rentalDates}
        onRentalDatesChange={setRentalDates}
        onConfirmRent={handleConfirmRent}
      />
    </div>
  );
} 