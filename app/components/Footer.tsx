import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 relative">
                <Image
                  src="/logo.png"
                  alt="Rent the moment"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Rent the moment
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              India's premier clothing rental platform. Rent designer clothes for special occasions without the commitment of buying.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/list-item" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  List Your Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/lehengas" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Lehengas
                </Link>
              </li>
              <li>
                <Link href="/categories/western-dresses" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Western Dresses
                </Link>
              </li>
              <li>
                <Link href="/categories/traditional-dresses" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Traditional Dresses
                </Link>
              </li>
              <li>
                <Link href="/categories/shoes" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Shoes & Footwear
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">support@rentthemoment.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  123 Fashion Street, Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Rent the moment. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 