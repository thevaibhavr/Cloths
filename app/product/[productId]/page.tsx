// 'use client';

// import { notFound } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { getProductBySlug } from '../../data/products';
// import { formatPrice, formatDate, formatJoinDate, getConditionColor, getDiscountPercentage } from '../../utils';
// import { ArrowLeft, Star, MapPin, Calendar, Clock, Shield, Truck, Heart, Share2, MessageCircle, ShoppingBag } from 'lucide-react';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useCart } from '../../contexts/CartContext';
// import { isExternalImage, isValidImageUrl, handleImageError } from '../../utils/imageUtils';
// import RentModal from '../../components/RentModal';

// interface ProductPageProps {
//   params: Promise<{
//     productId: string; // This will actually be a slug
//   }>;
// }

// export default function ProductPage({ params }: ProductPageProps) {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [isRentModalOpen, setIsRentModalOpen] = useState(false);
//   const [rentalDates, setRentalDates] = useState({
//     startDate: '',
//     endDate: ''
//   });
//   const { addToCart, addToWishlist, removeFromWishlist, wishlistItems, getCartItem } = useCart();

//   // Auto-slide functionality
//   useEffect(() => {
//     if (product && product.images && product.images.length > 1) {
//       const interval = setInterval(() => {
//         setSelectedImage((prev) => (prev + 1) % product.images.length);
//       }, 9000);

//       return () => clearInterval(interval);
//     }
//   }, [product]);

//   // Touch/swipe functionality
//   const [touchStart, setTouchStart] = useState(0);
//   const [touchEnd, setTouchEnd] = useState(0);

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const handleTouchEnd = () => {
//     if (!touchStart || !touchEnd || !product || !product.images) return;
    
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > 50;
//     const isRightSwipe = distance < -50;

//     if (isLeftSwipe) {
//       setSelectedImage((prev) => (prev + 1) % product.images.length);
//     }
//     if (isRightSwipe) {
//       setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
//     }

//     setTouchStart(0);
//     setTouchEnd(0);
//   };

//   const handleRentNow = () => {
//     setIsRentModalOpen(true);
//   };

//   const handleConfirmRent = () => {
//     // Calculate rental duration from dates
//     const calculateRentalDays = () => {
//       if (!rentalDates.startDate || !rentalDates.endDate) return 1;
//       const start = new Date(rentalDates.startDate);
//       const end = new Date(rentalDates.endDate);
//       const diffTime = Math.abs(end.getTime() - start.getTime());
//       const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//       // Don't count start date, only count middle days
//       // For rentals under 3 days, count as 1 day minimum
//       // For rentals 3+ days, count the days between start and end (excluding start date)
//       if (days < 3) {
//         return 1; // Minimum 1 day for short rentals
//       } else {
//         return days; // Count all days between start and end (including end date)
//       }
//     };
    
//     const rentalDuration = calculateRentalDays();
//     addToCart(product, 1, rentalDuration, rentalDates);
//     setIsRentModalOpen(false);
//   };

//   useEffect(() => {
//     const loadProduct = async () => {
//       try {
//         const { productId } = await params;
//         console.log('Loading product with slug:', productId);
//         const productData = await getProductBySlug(productId);
//         console.log('Product data received:', productData);
//         setProduct(productData);
//       } catch (error) {
//         console.error('Error loading product:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProduct();
//   }, [params]);

//   if (loading) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product || !product.name || !product.category) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
//           <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or is missing required data.</p>
//           <Link
//             href="/"
//             className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
//           >
//             Go back home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
//   const isInWishlist = wishlistItems.some(item => item._id === product._id);
//   const cartItem = getCartItem(product._id);
//   const isInCart = !!cartItem;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center space-x-4">
//             <Link
//               href={`/categories/${product.category.slug}`}
//               className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </Link>
//             <div className="flex-1">
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <Link href="/" className="hover:text-gray-900">Home</Link>
//                 <span>/</span>
//                 <Link href="/categories" className="hover:text-gray-900">Categories</Link>
//                 <span>/</span>
//                 <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
//                   {product.category.name}
//                 </Link>
//                 <span>/</span>
//                 <span className="text-gray-900">{product.name}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Images */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div 
//               className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden"
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={selectedImage}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="w-full h-full"
//                 >
//                   {product.images && product.images[selectedImage] && isValidImageUrl(product.images[selectedImage]) ? (
//                     <Image
//                       src={product.images[selectedImage]}
//                       alt={product.name}
//                       fill
//                       className="object-cover"
//                       onError={(e) => handleImageError(e)}
//                       unoptimized={isExternalImage(product.images[selectedImage])}
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                       <span className="text-gray-500 text-sm">Image not available</span>
//                     </div>
//                   )}
//                 </motion.div>
//               </AnimatePresence>

//               {/* Navigation Arrows */}
//               {product.images && product.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
//                     className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <button
//                     onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180" />
//                   </button>
//                 </>
//               )}

//               {/* Wishlist and Share Buttons */}
//               <div className="absolute top-4 right-4 flex space-x-2">
//                 <button 
//                   onClick={() => {
//                     const message = `Book this ${product.category.name} just in ₹${product.price} price on Rent The Moment! ${window.location.href}`;
//                     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//                     window.open(whatsappUrl, '_blank');
//                   }}
//                   className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
//                   title="Share on WhatsApp"
//                 >
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
//                   </svg>
//                 </button>
//                 <button 
//                   onClick={() => isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
//                   className={`p-2 rounded-full transition-colors ${
//                     isInWishlist 
//                       ? 'bg-pink-500 text-white' 
//                       : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600'
//                   }`}
//                 >
//                   <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
//                 </button>
//               </div>
//             </div>

//             {/* Thumbnail Images */}
//             {product.images && product.images.length > 1 && (
//               <div className="flex space-x-2 overflow-x-auto">
//                 {product.images.map((image: string, index: number) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
//                       selectedImage === index ? 'border-pink-500' : 'border-gray-200'
//                     }`}
//                   >
//                     {isValidImageUrl(image) ? (
//                       <Image
//                         src={image}
//                         alt={`${product.name} ${index + 1}`}
//                         width={80}
//                         height={80}
//                         className="object-cover w-full h-full"
//                         onError={(e) => handleImageError(e)}
//                         unoptimized={isExternalImage(image)}
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                         <span className="text-gray-500 text-xs">N/A</span>
//                       </div>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             {/* Product Title and Rating */}
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${
//                         i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-600">({product.numReviews || 0} reviews)</span>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="space-y-2">
//               <div className="flex items-center space-x-3">
//                 <span className="text-3xl font-bold text-pink-600">{formatPrice(product.price)}</span>
//                 {product.originalPrice > 0 && product.originalPrice > product.price && (
//                   <>
//                     <span className="text-xl text-gray-500 line-through">₹{formatPrice(product.originalPrice)}</span>
//                     <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm font-medium">
//                       {discountPercentage}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>
//               <p className="text-sm text-gray-600">Rental price per day</p>
//             </div>

//             {/* Product Info */}
//             <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
//               <div>
//                 <span className="text-sm text-gray-600">Sizes</span>
//                 <p className="font-medium">{product.sizes.map((s: { size: string }) => s.size).join(', ')}</p>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-600">Color</span>
//                 <p className="font-medium">{product.color}</p>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-600">Condition</span>
//                 <p className="font-medium">{product.condition}</p>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-600">Rental Duration</span>
//                 <p className="font-medium">{product.rentalDuration} days</p>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Description</h3>
//               <p className="text-gray-600 leading-relaxed">{product.description}</p>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-4">
//               {isInCart ? (
//                 <Link href="/cart">
//                   <motion.button 
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
//                   >
//                     <ShoppingBag className="w-5 h-5" />
//                     <span>Go to Cart ({cartItem?.quantity} item{cartItem?.quantity !== 1 ? 's' : ''})</span>
//                   </motion.button>
//                 </Link>
//               ) : (
//                 <motion.button 
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleRentNow}
//                   className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
//                 >
//                   <ShoppingBag className="w-5 h-5" />
//                   <span>Rent Now</span>
//                 </motion.button>
//               )}

//               <motion.button 
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
//                 className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
//                   isInWishlist 
//                     ? 'bg-pink-100 text-pink-600 border-2 border-pink-200 hover:bg-pink-200' 
//                     : 'border-2 border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-600'
//                 }`}
//               >
//                 <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
//                 <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
//               </motion.button>
//             </div>

//             {/* Additional Info */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
//               <div className="flex items-center space-x-2">
//                 <Shield className="w-5 h-5 text-green-500" />
//                 <span className="text-sm text-gray-600">Secure Rental</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Truck className="w-5 h-5 text-blue-500" />
//                 <span className="text-sm text-gray-600">Free Delivery</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm text-gray-600">Same Day Pickup</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Rent Modal */}
//       <RentModal
//         isOpen={isRentModalOpen}
//         onClose={() => setIsRentModalOpen(false)}
//         onConfirmRent={handleConfirmRent}
//         rentalDates={rentalDates}
//         onRentalDatesChange={setRentalDates}
//         product={product}
//       />
//     </div>
//   );
// } 


'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { getProductBySlug } from '../../data/products';
import { formatPrice, formatDate, formatJoinDate, getConditionColor, getDiscountPercentage } from '../../utils';
import { ArrowLeft, Star, MapPin, Calendar, Clock, Shield, Truck, Heart, Share2, MessageCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
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
  const [loading, setLoading] = useState(true);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: ''
  });
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems, getCartItem } = useCart();

  useEffect(() => {
    if (product && product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      }, 9000);

      return () => clearInterval(interval);
    }
  }, [product]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !product || !product.images) return;
    
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
    const calculateRentalDays = () => {
      if (!rentalDates.startDate || !rentalDates.endDate) return 1;
      const start = new Date(rentalDates.startDate);
      const end = new Date(rentalDates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (days < 3) {
        return 1;
      } else {
        return days;
      }
    };
    
    const rentalDuration = calculateRentalDays();
    addToCart(product, 1, rentalDuration, rentalDates);
    setIsRentModalOpen(false);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { productId } = await params;
        const productData = await getProductBySlug(productId);
        setProduct(productData);
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

  if (!product || !product.name || !product.category) {
    return notFound();
  }

  const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
  const isInWishlist = wishlistItems.some(item => item._id === product._id);
  const cartItem = getCartItem(product._id);
  const isInCart = !!cartItem;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const productImage = product.images?.[0] || '/default-product.jpg';

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>{`${product.name} | Rent The Moment`}</title>
        <meta name="description" content={product.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={productImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={product.name} />
        <meta property="twitter:description" content={product.description} />
        <meta property="twitter:image" content={productImage} />
      </Head>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href={`/categories/${product.category.slug}`}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600 flex-wrap">
                <Link href="/" className="hover:text-gray-900">Home</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-gray-900">Categories</Link>
                <span>/</span>
                {product.categories && product.categories.length > 0 && product.categories.some(cat => typeof cat === 'object' && cat.name) ? (
                  <>
                    {product.categories
                      .filter(cat => typeof cat === 'object' && cat.name)
                      .map((category, index) => (
                        <div key={category._id} className="flex items-center">
                          <Link href={`/categories/${category.slug}`} className="hover:text-gray-900">
                            {category.name}
                          </Link>
                          {index < product.categories.filter(cat => typeof cat === 'object' && cat.name).length - 1 && <span className="mx-1">,</span>}
                        </div>
                      ))}
                  </>
                ) : (
                  <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
                    {product.category.name}
                  </Link>
                )}
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
                  {product.images && product.images[selectedImage] && isValidImageUrl(product.images[selectedImage]) ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => handleImageError(e)}
                      unoptimized={isExternalImage(product.images[selectedImage])}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Image not available</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                </>
              )}

              {/* Wishlist and Share Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => {
                    const message = `Check out this ${product.name} for rent at ${formatPrice(product.price)} on Rent The Moment! ${currentUrl}`;
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </button>
                <button 
                  onClick={() => isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    {isValidImageUrl(image) ? (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        onError={(e) => handleImageError(e)}
                        unoptimized={isExternalImage(image)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">N/A</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.numReviews || 0} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-pink-600">{formatPrice(product.price)}</span>
                {product.originalPrice > 0 && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{formatPrice(product.originalPrice)}</span>
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm font-medium">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Rental price per day</p>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div>
                <span className="text-sm text-gray-600">Sizes</span>
                <p className="font-medium">{product.sizes.map((s: { size: string }) => s.size).join(', ')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Color</span>
                <p className="font-medium">{product.color}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Condition</span>
                <p className="font-medium">{product.condition}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Rental Duration</span>
                <p className="font-medium">{product.rentalDuration} days</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isInCart ? (
                <Link href="/cart">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Go to Cart ({cartItem?.quantity} item{cartItem?.quantity !== 1 ? 's' : ''})</span>
                  </motion.button>
                </Link>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRentNow}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Rent Now</span>
                </motion.button>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
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

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Secure Rental</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-gray-600">Same Day Pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Modal */}
      <RentModal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        onConfirmRent={handleConfirmRent}
        rentalDates={rentalDates}
        onRentalDatesChange={setRentalDates}
        product={product}
      />
    </div>
  );
}