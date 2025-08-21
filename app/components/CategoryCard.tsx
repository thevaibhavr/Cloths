'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-100"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent" />
          
          {/* Light Black Layer from Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
          
          {/* Category Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
            <p className="text-gray-200 text-sm line-clamp-2 mb-2">{category.description}</p>
            
            {/* Click Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-base font-semibold group-hover:text-yellow-300 transition-colors duration-200">View Products</span>
              <div className="flex items-center space-x-2 bg-black/30 px-3 py-2 rounded-full">
                <span className="text-yellow-400 text-sm font-medium">Click to explore</span>
                <ArrowRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-yellow-400/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center text-black">
              <div className="text-xl font-bold mb-3">Shop {category.name}</div>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-base font-semibold">View More Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
          
          {/* Top Right Arrow Indicator */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-6 h-6 text-yellow-400" />
          </div>
          
          {/* Bottom Right View More Badge */}
          <div className="absolute bottom-4 right-4 bg-yellow-400/90 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-black text-sm font-bold">View More</span>
          </div>
        </div>
      </div>
          </Link>
    );
  } 