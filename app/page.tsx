'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import HeroSlider from './components/HeroSlider';

import CategoryCard from './components/CategoryCard';
import ProductCard from './components/ProductCard';
import { getCategories, getProducts } from './data/products';
import { ArrowRight, Star, ShoppingBag, TrendingUp, Zap, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';
import { Category, Product } from './types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lehengaProducts, setLehengaProducts] = useState<Product[]>([]);
  const [indoWesternProducts, setIndoWesternProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData, lehengaData, indoWesternData] = await Promise.all([
          getCategories(),
          getProducts(1, 12, { featured: true }),
          getProducts(1, 5, { category: '6891ea9e4c1849c2df9e1226' }),
          getProducts(1, 5, { category: '6891ffbe56ab7a0c7cea74eb' })
        ]);
        setCategories(categoriesData);
        setProducts(productsData.products || []);
        setLehengaProducts(lehengaData.products || []);
        setIndoWesternProducts(indoWesternData.products || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"
          ></motion.div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </motion.div>
    );
  }

  const featuredProducts = products.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero Slider */}
      {/* <HeroSlider /> */}

      {/* Categories Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="pb-20 pt-10 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/categories"
              className="inline-flex items-center space-x-3 bg-yellow-400 text-black px-8 py-4 rounded-lg hover:bg-yellow-500 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View All Categories</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked designer pieces that are trending this season
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/products"
              className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <TrendingUp className="w-5 h-5" />
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Lehenga Category Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Bridal Elegance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stunning lehengas for your special moments and celebrations
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {lehengaProducts.map((product, index) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/categories/lehengas"
              className="inline-flex items-center space-x-3 bg-yellow-400 text-black px-8 py-4 rounded-lg hover:bg-yellow-500 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Crown className="w-5 h-5" />
              <span>View All Lehengas</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Indo-Western Dress Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Fusion Fashion
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contemporary indo-western dresses that blend tradition with modern style
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {indoWesternProducts.map((product, index) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/categories/indo-western-dress"
              className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5" />
              <span>View All Indo-Western</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Shoes Category Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Step into Style
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our collection of designer shoes and footwear for every occasion
            </p>
          </motion.div>
          
          
          
        </div>
      </motion.section>

      {/* Quick Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-yellow-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants} className="text-black">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg font-medium">Happy Customers</div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-black">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg font-medium">Designer Pieces</div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-black">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg font-medium">Brands</div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-black">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg font-medium">Support</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
