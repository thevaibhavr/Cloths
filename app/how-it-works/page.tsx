import { ArrowRight, Search, Calendar, CreditCard, Truck, Star, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rent designer clothes for your special occasions in just a few simple steps. 
              No commitment, no hassle, just beautiful fashion when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Main Process */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Browse & Select</h3>
            <p className="text-gray-600 mb-6">
              Explore our vast collection of designer clothes, lehengas, western dresses, 
              and accessories. Filter by size, color, occasion, and price to find your perfect match.
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Browse by category or search</span>
              </li>
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Check size and fit details</span>
              </li>
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Read owner reviews</span>
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Book & Pay</h3>
            <p className="text-gray-600 mb-6">
              Choose your rental dates and make a secure payment. We'll handle the delivery 
              right to your doorstep with free pickup and return.
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Select rental dates</span>
              </li>
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Pay rental fee + deposit</span>
              </li>
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Get delivery confirmation</span>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Wear & Return</h3>
            <p className="text-gray-600 mb-6">
              Enjoy your special day in the perfect outfit. Return it hassle-free after your event 
              and get your deposit back (minus rental fee).
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Receive at your doorstep</span>
              </li>
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Wear for your occasion</span>
              </li>
              <li className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-pink-500" />
                <span>Schedule pickup return</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Rent the moment?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make fashion accessible, sustainable, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Items</h3>
              <p className="text-gray-600 text-sm">
                All items are quality-checked and verified before listing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600 text-sm">
                Free pickup and delivery across major cities in India
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Designer clothes from top brands and boutiques
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Community</h3>
              <p className="text-gray-600 text-sm">
                Join thousands of satisfied customers across India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing & Fees</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Fee</h3>
              <p className="text-gray-600 mb-4">
                Pay only for the days you need the outfit. Prices start from ₹500 per day.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 1-3 days: ₹500-1500</li>
                <li>• 4-7 days: ₹1500-3000</li>
                <li>• 8+ days: Custom pricing</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security Deposit</h3>
              <p className="text-gray-600 mb-4">
                Refundable deposit to ensure item safety. Returned after successful return.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Lehengas: ₹2000-5000</li>
                <li>• Dresses: ₹1000-3000</li>
                <li>• Accessories: ₹500-1500</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery</h3>
              <p className="text-gray-600 mb-4">
                Free delivery and pickup within city limits. Additional charges for outstation.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Same day delivery: ₹200</li>
                <li>• Next day delivery: Free</li>
                <li>• Outstation: ₹500-1000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Renting?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who trust Rent the moment for their special occasions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/categories"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Browse Categories
            </Link>
            <Link
              href="/list-item"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-pink-600 transition-all duration-200"
            >
              List Your Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 