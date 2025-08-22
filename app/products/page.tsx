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
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0} : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.4, 
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
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [randomCategory, setRandomCategory] = useState<Category | null>(null);

  // Handle URL parameter changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.length > 0) {
      const category = categories.find(cat => cat.slug === categoryFromUrl);
      if (category) {
        // Set the category filter for search
        setSearchTerm(category.name);
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    loadData();
  }, [searchTerm, sortBy, sortOrder]);

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

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const clearFilters = () => {
    setSearchTerm('');
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
            className="rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"
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
      className="min-h-screen bg-gray-50 pt-10"
    >
      {/* Search and Filters */}
    

      {/* Products Grid/List */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        {products.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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