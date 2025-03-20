import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { exportToCSV, exportToPDF, prepareDataForExport } from '../../utils/exportData';

interface DetailViewProps {
  type: 'rating' | 'sentiment' | 'userInsights' | 'category' | 'product';
  data: {
    ratingDistribution?: RatingDistribution;
    totalReviews?: number;
    recentReviews?: Review[];
    metrics?: Metrics;
    topProducts?: Product[];
    ageGroups?: Record<string, { percentage: number }>;
    timeSpent?: Record<string, string>;
    sentimentData?: Array<{ source: string; score: number }>;
  };
  onClose: () => void;
  onNavigate: (direction: 'back' | 'forward') => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface Review {
  id: string;
  productName: string;
  brand: string;
  category: string;
  review: string;
  rating: number;
  ratingSource: string;
  date: string;
}

interface RatingDistribution {
  [key: string]: number;
}

interface SentimentData {
  [key: string]: number;
}

interface UserInsightValue {
  rating: string;
  percentage: number;
}

interface TimeSpentData {
  [key: string]: string;
}

interface Product {
  name: string;
  brand: string;
  category: string;
  revenue: number;
  orders: number;
}

interface PlatformData {
  mobile: number;
  web: number;
  app: number;
}

interface Metrics {
  [key: string]: string | number;
}

const generateRandomReviews = (count: number): Review[] => {
  const products = ['iPhone 13', 'Samsung Galaxy S21', 'MacBook Pro', 'iPad Air', 'AirPods Pro', 'Apple Watch', 'Sony WH-1000XM4', 'Nintendo Switch'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Nintendo', 'Google', 'Microsoft', 'Dell', 'HP'];
  const categories = ['Electronics', 'Computers', 'Mobile Devices', 'Accessories', 'Gaming', 'Audio'];
  const platforms = ['mobile', 'web', 'app'];
  const reviewTexts = [
    'Excellent product, exceeded my expectations!',
    'Great value for money, highly recommended.',
    'Good quality but could be better.',
    'Amazing features and performance.',
    'Satisfied with the purchase.',
    'Not bad, but there are better options.',
    'Perfect for my needs.',
    'Could be improved in some areas.',
    'Best purchase I\'ve made this year!',
    'Disappointed with the quality.',
    'Great customer service and product.',
    'Worth every penny!',
    'Good but not great.',
    'Exactly what I was looking for.',
    'Better than expected.'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `review-${i + 1}`,
    productName: products[Math.floor(Math.random() * products.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
    rating: Math.floor(Math.random() * 3) + 3, // Ratings between 3-5
    ratingSource: platforms[Math.floor(Math.random() * platforms.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() // Random date within last 30 days
  }));
};

const DetailView: React.FC<DetailViewProps> = ({ type, data, onClose, onNavigate, hasNext, hasPrevious }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: 'all',
    source: 'all',
    dateRange: 'all',
    category: 'all'
  });
  const [filteredData, setFilteredData] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'mobile' | 'web' | 'app'>('all');

  useEffect(() => {
    const filtered = {
      ratingDistribution: data.ratingDistribution,
      totalReviews: data.totalReviews || 500,
      recentReviews: data.recentReviews || generateRandomReviews(50),
      metrics: data.metrics,
      topProducts: data.topProducts,
      ageGroups: data.ageGroups,
      timeSpent: data.timeSpent,
      sentimentData: data.sentimentData,
      allReviews: data.recentReviews || generateRandomReviews(500)
    };

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered.recentReviews = filtered.recentReviews.filter(review =>
        review.productName.toLowerCase().includes(query) ||
        review.brand.toLowerCase().includes(query) ||
        review.category.toLowerCase().includes(query) ||
        review.review.toLowerCase().includes(query)
      );
      filtered.allReviews = filtered.allReviews.filter(review =>
        review.productName.toLowerCase().includes(query) ||
        review.brand.toLowerCase().includes(query) ||
        review.category.toLowerCase().includes(query) ||
        review.review.toLowerCase().includes(query)
      );
    }

    if (selectedPlatform !== 'all') {
      filtered.recentReviews = filtered.recentReviews.filter(review => review.ratingSource === selectedPlatform);
      filtered.allReviews = filtered.allReviews.filter(review => review.ratingSource === selectedPlatform);
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedPlatform, data]);

  const handleDownload = (format: 'csv' | 'pdf') => {
    const exportData = prepareDataForExport(type, filteredData || data);
    const filename = `${type}_report_${new Date().toISOString().split('T')[0]}`;
    const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Report`;

    if (format === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToPDF(exportData, filename, title);
    }
  };

  const renderSearchAndFilters = () => {
    const searchPlaceholders = {
      rating: "Search ratings by product, brand, or category...",
      sentiment: "Search sentiment analysis by user group or source...",
      userInsights: "Search user insights by demographic or behavior...",
      category: "Search category performance by product or metric...",
      product: "Search products by name, brand, or category..."
    };

    return (
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {type === 'rating' && (
              <>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                >
                  <option value="all">All Sources</option>
                  <option value="mobile">Mobile</option>
                  <option value="web">Web</option>
                  <option value="app">App</option>
                </select>
              </>
            )}
            {type === 'category' && (
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Footwear">Footwear</option>
              </select>
            )}
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  const renderPlatformSelector = () => {
    return (
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setSelectedPlatform('mobile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'mobile'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setSelectedPlatform('web')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'web'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Web
          </button>
          <button
            onClick={() => setSelectedPlatform('app')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'app'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            App
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!filteredData) return null;

    switch (type) {
      case 'rating':
        return (
          <div className="space-y-6">
            {renderSearchAndFilters()}
            {renderPlatformSelector()}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(filteredData.ratingDistribution || {}).map(([rating, count]) => (
                    <div key={rating} className="flex items-center">
                      <div className="w-12 text-sm font-medium text-gray-500">{rating} Stars</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${(Number(count) / (filteredData.totalReviews || 1)) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{String(count)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
                <div className="space-y-4">
                  {['mobile', 'web', 'app'].map((platform) => (
                    <div key={platform} className="flex items-center">
                      <div className="w-16 text-sm font-medium text-gray-500 capitalize">{platform}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">
                        {Math.floor(Math.random() * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                <div className="space-y-4">
                  {filteredData.recentReviews?.map((review: any, index: number) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{review.productName}</span>
                        <span className="text-sm text-gray-500">{review.ratingSource}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.review}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'userInsights':
        return (
          <div className="space-y-6">
            {renderSearchAndFilters()}
            {renderPlatformSelector()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Group Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(filteredData.ageGroups || {}).map(([age, data]: [string, any]) => (
                    <div key={age} className="flex items-center">
                      <div className="w-20 text-sm font-medium text-gray-500">{age}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{data.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Spent by Platform</h3>
                <div className="space-y-4">
                  {Object.entries(filteredData.timeSpent || {}).map(([time, data]: [string, any]) => (
                    <div key={time} className="flex items-center">
                      <div className="w-20 text-sm font-medium text-gray-500">{time}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${parseInt(data)}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{data}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add User Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Retention Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Daily Active Users</span>
                    <span className="text-sm font-medium text-gray-900">12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weekly Retention</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Monthly Retention</span>
                    <span className="text-sm font-medium text-gray-900">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Churn Rate</span>
                    <span className="text-sm font-medium text-gray-900">3.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Avg. Session Duration</span>
                    <span className="text-sm font-medium text-gray-900">12.5 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Sessions per User</span>
                    <span className="text-sm font-medium text-gray-900">3.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Bounce Rate</span>
                    <span className="text-sm font-medium text-gray-900">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Return Rate</span>
                    <span className="text-sm font-medium text-gray-900">82%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">New Users (30d)</span>
                    <span className="text-sm font-medium text-gray-900">2,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Growth Rate</span>
                    <span className="text-sm font-medium text-gray-900">+15.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Acquisition Cost</span>
                    <span className="text-sm font-medium text-gray-900">$2.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Lifetime Value</span>
                    <span className="text-sm font-medium text-gray-900">$45.20</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add User Behavior Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Behavior</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Daily Active</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8,450</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">68%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">+5.2%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Weekly Active</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10,250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">+3.8%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monthly Active</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">11,850</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">95%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">+2.1%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Inactive Users</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">600</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600">-1.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'category':
        return (
          <div className="space-y-6">
            {renderSearchAndFilters()}
            {renderPlatformSelector()}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(filteredData.metrics || {}).map(([key, value]) => (
                <div key={key} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600">{String(value)}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.topProducts?.map((product: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.orders.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('back')}
              disabled={!hasPrevious}
              className={`p-2 rounded-lg ${
                hasPrevious
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {type.charAt(0).toUpperCase() + type.slice(1)} Details
            </h2>
            <button
              onClick={() => onNavigate('forward')}
              disabled={!hasNext}
              className={`p-2 rounded-lg ${
                hasNext
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DetailView; 