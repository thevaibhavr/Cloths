'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../data/products';
import { Product, Category } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

// Animated Product Card Component
function AnimatedProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.3 
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2 } 
      }}
    >
      <ProductCard product={product} />
    </motion.div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [randomCategory, setRandomCategory] = useState<Category | null>(null);

  // Handle URL parameter changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.length > 0) {
      const category = categories.find(cat => cat.slug === categoryFromUrl);
      if (category && selectedCategory !== category._id) {
        setSelectedCategory(category._id);
      }
    }
  }, [searchParams, categories, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories first
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Set random category for the bottom button
      if (categoriesData.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoriesData.length);
        setRandomCategory(categoriesData[randomIndex]);
      }
      
      // Load products with current filters - show 50 products
      const productsData = await getProducts(1, 50, {
        search: searchTerm,
        category: selectedCategory,
        sort: sortBy,
        order: sortOrder
      });
      
      // Shuffle products for random order
      const shuffledProducts = [...(productsData.products || [])].sort(() => Math.random() - 0.5);
      setProducts(shuffledProducts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"
          ></motion.div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Search and Filters */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {/* Search and Filters Row */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search for dresses, lehengas, shoes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>
              </form>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-2">
              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 bg-white text-sm"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </motion.button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
                  >
                    {/* Category Filter */}
                    <motion.select
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </motion.select>

                    {/* Sort Options */}
                    <motion.select
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort);
                        setSortOrder(order);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    >
                      <option value="createdAt-desc">Newest</option>
                      <option value="createdAt-asc">Oldest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </motion.select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory || sortBy !== 'createdAt' || sortOrder !== 'desc') && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={clearFilters}
                  className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                >
                  Clear
                </motion.button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Grid/List */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        {products.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchParams.get('category') ? 
                `No products found in category "${searchParams.get('category')}". Try a different category or clear filters.` :
                'Try adjusting your search terms or filters'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="text-pink-600 hover:text-pink-500 font-medium"
            >
              Clear all filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Products Count */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-gray-600">
                Showing {products.length} products
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${categories.find(c => c._id === selectedCategory)?.name}`}
                {searchParams.get('category') && !selectedCategory && ` in ${searchParams.get('category')}`}
              </p>
            </motion.div>

            {/* Products Grid */}
            <motion.div 
              layout
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' 
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <AnimatedProductCard 
                    key={product._id} 
                    product={product} 
                    index={index} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Random Category Button */}
            {randomCategory && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center mt-16"
              >
                <Link
                  href={`/categories/${randomCategory.slug}`}
                  className="inline-flex items-center space-x-3 bg-black text-white px-5 py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>View All {randomCategory.name}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
} 