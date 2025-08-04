'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { getCategoryById, getProductsByCategory } from '../../data/products';
import { ArrowLeft, Filter, Grid, List, X } from 'lucide-react';
import Link from 'next/link';
import { Category, Product } from '../../types';

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [conditionFilters, setConditionFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { categoryId } = await params;
        const categoryData = await getCategoryById(categoryId);
        const productsData = await getProductsByCategory(categoryId);

        if (!categoryData) {
          notFound();
        }

        setCategory(categoryData);
        setAllProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply price filters
    if (priceFilters.length > 0) {
      filtered = filtered.filter(product => {
        return priceFilters.some(filter => {
          switch (filter) {
            case 'Under ₹1,000':
              return product.price < 1000;
            case '₹1,000 - ₹2,000':
              return product.price >= 1000 && product.price <= 2000;
            case '₹2,000 - ₹3,000':
              return product.price > 2000 && product.price <= 3000;
            case 'Above ₹3,000':
              return product.price > 3000;
            default:
              return true;
          }
        });
      });
    }

    // Apply size filters
    if (sizeFilters.length > 0) {
      filtered = filtered.filter(product => sizeFilters.includes(product.size));
    }

    // Apply condition filters
    if (conditionFilters.length > 0) {
      filtered = filtered.filter(product => conditionFilters.includes(product.condition));
    }

    // Apply color filters
    if (colorFilters.length > 0) {
      filtered = filtered.filter(product => colorFilters.includes(product.color));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Sort by ID for now since createdAt doesn't exist
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'rating':
        filtered.sort((a, b) => b.owner.rating - a.owner.rating);
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, priceFilters, sizeFilters, conditionFilters, colorFilters, sortBy]);

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

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/categories"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-1">
                {category.description} • {filteredProducts.length} items available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 w-full justify-center"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-24 max-h-[80vh] lg:max-h-none overflow-y-auto">
              {/* Mobile Filter Header */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Filter Header */}
              <div className="hidden lg:flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹1,000', count: allProducts.filter((p: Product) => p.price < 1000).length },
                    { label: '₹1,000 - ₹2,000', count: allProducts.filter((p: Product) => p.price >= 1000 && p.price <= 2000).length },
                    { label: '₹2,000 - ₹3,000', count: allProducts.filter((p: Product) => p.price > 2000 && p.price <= 3000).length },
                    { label: 'Above ₹3,000', count: allProducts.filter((p: Product) => p.price > 3000).length },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-pink-500 focus:ring-pink-500"
                        checked={priceFilters.includes(range.label)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPriceFilters([...priceFilters, range.label]);
                          } else {
                            setPriceFilters(priceFilters.filter(f => f !== range.label));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                      <span className="text-xs text-gray-500">({range.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-pink-500 focus:ring-pink-500"
                        checked={sizeFilters.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSizeFilters([...sizeFilters, size]);
                          } else {
                            setSizeFilters(sizeFilters.filter(s => s !== size));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
                <div className="space-y-2">
                  {['Excellent', 'Good', 'Fair'].map((condition) => (
                    <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-pink-500 focus:ring-pink-500"
                        checked={conditionFilters.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConditionFilters([...conditionFilters, condition]);
                          } else {
                            setConditionFilters(conditionFilters.filter(c => c !== condition));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Color</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Red', 'Black', 'Green', 'Pink', 'Gold', 'Blue'].map((color) => (
                    <label key={color} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-pink-500 focus:ring-pink-500"
                        checked={colorFilters.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setColorFilters([...colorFilters, color]);
                          } else {
                            setColorFilters(colorFilters.filter(c => c !== color));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button 
                onClick={() => {
                  setPriceFilters([]);
                  setSizeFilters([]);
                  setConditionFilters([]);
                  setColorFilters([]);
                  setSortBy('featured');
                }}
                className="w-full text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {filteredProducts.length} items found
                    </span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later for new items.
                </p>
                <button 
                  onClick={() => {
                    setPriceFilters([]);
                    setSizeFilters([]);
                    setConditionFilters([]);
                    setColorFilters([]);
                    setSortBy('featured');
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 