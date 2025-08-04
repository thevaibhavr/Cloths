'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const banners = [
  {
    id: 1,
    image: '/images/categories/lehengas.jpg',
    title: 'Designer Lehengas',
    subtitle: 'Stunning bridal and party wear collection',
    cta: 'Shop Lehengas',
    link: '/categories/lehengas'
  },
  {
    id: 2,
    image: '/images/categories/traditional-dresses.jpg',
    title: 'Traditional Dresses',
    subtitle: 'Elegant sarees and ethnic wear',
    cta: 'Explore Traditional',
    link: '/categories/traditional-dresses'
  },
  {
    id: 3,
    image: '/images/categories/suits.jpg',
    title: 'Professional Suits',
    subtitle: 'Corporate and formal wear collection',
    cta: 'View Suits',
    link: '/categories/suits'
  },
  {
    id: 4,
    image: '/images/categories/accessories.jpg',
    title: 'Fashion Accessories',
    subtitle: 'Complete your look with our accessories',
    cta: 'Shop Accessories',
    link: '/categories/accessories'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="relative h-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl mx-auto px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.link}
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-1000 ease-linear"
          style={{
            width: `${((currentSlide + 1) / banners.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
} 