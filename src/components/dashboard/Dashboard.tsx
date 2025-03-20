import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataVisualization from './DataVisualization';
import DetailView from './DetailView';
import CreateReview from '../reviews/CreateReview';
import ReviewsList from '../reviews/ReviewsList';

interface PlatformMetrics {
  mobile: number;
  web: number;
  app: number;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  color: string;
  platformMetrics?: PlatformMetrics;
}

interface UserInsightData {
  rating: string;
  percentage: number;
}

interface UserInsights {
  ageGroups: {
    [key: string]: UserInsightData;
  };
  timeSpent: {
    [key: string]: string;
  };
  ctr: {
    [key: string]: string;
  };
  mostSearched: string[];
  retention: {
    returningUsers: number;
    dropOffUsers: number;
    successfulPayments: number;
  };
}

interface DetailViewState {
  type: 'rating' | 'sentiment' | 'userInsights' | 'category' | 'product';
  data: any;
  history: Array<{ type: string; data: any }>;
  currentIndex: number;
}

interface ReviewData {
  id: string;
  productName: string;
  ratingSource: 'mobile' | 'web' | 'app';
  category: string;
  brand: string;
  review: string;
  rating: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Average Rating',
      value: (Math.random() * (5 - 3) + 3).toFixed(1),
      change: `+${(Math.random() * 0.5).toFixed(1)}`,
      color: 'bg-amber-500',
      platformMetrics: {
        mobile: 4.2,
        web: 4.5,
        app: 4.3
      }
    },
    {
      title: 'Sentiment Score',
      value: `${Math.floor(Math.random() * 20 + 60)}%`,
      change: `+${Math.floor(Math.random() * 5)}%`,
      color: 'bg-emerald-500',
      platformMetrics: {
        mobile: 75,
        web: 82,
        app: 78
      }
    },
    {
      title: 'Total Reviews',
      value: Math.floor(Math.random() * 1000 + 500),
      change: `+${Math.floor(Math.random() * 10)}%`,
      color: 'bg-violet-500',
      platformMetrics: {
        mobile: 450,
        web: 380,
        app: 420
      }
    },
    {
      title: 'User Retention',
      value: `${Math.floor(Math.random() * 10 + 80)}%`,
      change: `+${Math.floor(Math.random() * 3)}%`,
      color: 'bg-rose-500',
      platformMetrics: {
        mobile: 85,
        web: 88,
        app: 92
      }
    },
    {
      title: 'Average Order Value',
      value: `$${(Math.random() * 50 + 50).toFixed(2)}`,
      change: `+${Math.floor(Math.random() * 5)}%`,
      color: 'bg-sky-500',
      platformMetrics: {
        mobile: 65,
        web: 85,
        app: 75
      }
    },
    {
      title: 'Quantity Sold',
      value: Math.floor(Math.random() * 1000 + 500),
      change: `+${Math.floor(Math.random() * 8)}%`,
      color: 'bg-fuchsia-500',
      platformMetrics: {
        mobile: 480,
        web: 520,
        app: 490
      }
    },
    {
      title: 'User Satisfaction',
      value: `${(Math.random() * (5 - 3) + 3).toFixed(1)}/5`,
      change: `+${(Math.random() * 0.3).toFixed(1)}`,
      color: 'bg-teal-500',
      platformMetrics: {
        mobile: 4.1,
        web: 4.4,
        app: 4.2
      }
    }
  ]);
  const [userInsights, setUserInsights] = useState<UserInsights | null>(null);
  const [detailView, setDetailView] = useState<DetailViewState | null>(null);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<MetricCard[]>([]);
  const [filteredUserInsights, setFilteredUserInsights] = useState<UserInsights | null>(null);
  const [filteredReviews, setFilteredReviews] = useState<ReviewData[]>([]);

  // Simulate data fetching based on time range and category
  useEffect(() => {
    // Update metrics based on selected time range and category
    const newMetrics: MetricCard[] = [
      {
        title: 'Average Rating',
        value: (Math.random() * (5 - 3) + 3).toFixed(1),
        change: `+${(Math.random() * 0.5).toFixed(1)}`,
        color: 'bg-amber-500',
        platformMetrics: {
          mobile: 4.2,
          web: 4.5,
          app: 4.3
        }
      },
      {
        title: 'Sentiment Score',
        value: `${Math.floor(Math.random() * 20 + 60)}%`,
        change: `+${Math.floor(Math.random() * 5)}%`,
        color: 'bg-emerald-500',
        platformMetrics: {
          mobile: 75,
          web: 82,
          app: 78
        }
      },
      {
        title: 'Total Reviews',
        value: Math.floor(Math.random() * 1000 + 500),
        change: `+${Math.floor(Math.random() * 10)}%`,
        color: 'bg-violet-500',
        platformMetrics: {
          mobile: 450,
          web: 380,
          app: 420
        }
      },
      {
        title: 'User Retention',
        value: `${Math.floor(Math.random() * 10 + 80)}%`,
        change: `+${Math.floor(Math.random() * 3)}%`,
        color: 'bg-rose-500',
        platformMetrics: {
          mobile: 85,
          web: 88,
          app: 92
        }
      },
    ];
    setMetrics(newMetrics);

    // Update user insights
    const newUserInsights: UserInsights = {
      ageGroups: {
        '18-24': { rating: (Math.random() * (5 - 3) + 3).toFixed(1), percentage: Math.floor(Math.random() * 20 + 20) },
        '25-34': { rating: (Math.random() * (5 - 3) + 3).toFixed(1), percentage: Math.floor(Math.random() * 20 + 20) },
        '35-44': { rating: (Math.random() * (5 - 3) + 3).toFixed(1), percentage: Math.floor(Math.random() * 20 + 20) },
        '45+': { rating: (Math.random() * (5 - 3) + 3).toFixed(1), percentage: Math.floor(Math.random() * 20 + 20) },
      },
      timeSpent: {
        '1d': `${Math.floor(Math.random() * 10 + 5)}m`,
        '7d': `${Math.floor(Math.random() * 15 + 10)}m`,
        '15d': `${Math.floor(Math.random() * 20 + 15)}m`,
        '30d': `${Math.floor(Math.random() * 25 + 20)}m`,
      },
      ctr: {
        '1d': `${(Math.random() * 2 + 2).toFixed(1)}%`,
        '7d': `${(Math.random() * 2 + 2.5).toFixed(1)}%`,
        '15d': `${(Math.random() * 2 + 3).toFixed(1)}%`,
        '30d': `${(Math.random() * 2 + 3.5).toFixed(1)}%`,
      },
      mostSearched: ['Dresses', 'Shoes', 'Accessories', 'Bags'],
      retention: {
        returningUsers: Math.floor(Math.random() * 200 + 800),
        dropOffUsers: Math.floor(Math.random() * 100 + 100),
        successfulPayments: Math.floor(Math.random() * 100 + 900),
      },
    };
    setUserInsights(newUserInsights);
  }, [selectedTimeRange, selectedCategory]);

  // Add search functionality
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMetrics(metrics);
      setFilteredUserInsights(userInsights);
      setFilteredReviews(reviews);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter metrics
    const filteredMetricsData = metrics.filter(metric => 
      metric.title.toLowerCase().includes(query) ||
      metric.value.toString().toLowerCase().includes(query)
    );
    setFilteredMetrics(filteredMetricsData);

    // Filter user insights
    if (userInsights) {
      const filteredInsights = {
        ...userInsights,
        ageGroups: Object.fromEntries(
          Object.entries(userInsights.ageGroups).filter(([age, data]) =>
            age.toLowerCase().includes(query) ||
            data.rating.toLowerCase().includes(query)
          )
        ),
        timeSpent: Object.fromEntries(
          Object.entries(userInsights.timeSpent).filter(([period, time]) =>
            period.toLowerCase().includes(query) ||
            time.toLowerCase().includes(query)
          )
        ),
        ctr: Object.fromEntries(
          Object.entries(userInsights.ctr).filter(([period, rate]) =>
            period.toLowerCase().includes(query) ||
            rate.toLowerCase().includes(query)
          )
        ),
        mostSearched: userInsights.mostSearched.filter(item =>
          item.toLowerCase().includes(query)
        ),
        retention: {
          ...userInsights.retention,
          returningUsers: userInsights.retention.returningUsers.toString().includes(query) ? userInsights.retention.returningUsers : 0,
          dropOffUsers: userInsights.retention.dropOffUsers.toString().includes(query) ? userInsights.retention.dropOffUsers : 0,
          successfulPayments: userInsights.retention.successfulPayments.toString().includes(query) ? userInsights.retention.successfulPayments : 0,
        }
      };
      setFilteredUserInsights(filteredInsights);
    }

    // Filter reviews
    const filteredReviewsData = reviews.filter(review =>
      review.productName.toLowerCase().includes(query) ||
      review.brand.toLowerCase().includes(query) ||
      review.category.toLowerCase().includes(query) ||
      review.review.toLowerCase().includes(query) ||
      review.rating.toString().includes(query)
    );
    setFilteredReviews(filteredReviewsData);
  }, [searchQuery, metrics, userInsights, reviews]);

  const handleMetricClick = (metric: MetricCard | { title: string; value: any }) => {
    let detailData: any = {};
    let detailType: 'rating' | 'sentiment' | 'userInsights' | 'category' | 'product' = 'rating';

    switch (metric.title) {
      case 'Average Rating':
        detailType = 'rating';
        detailData = {
          ratingDistribution: {
            '5': Math.floor(Math.random() * 100),
            '4': Math.floor(Math.random() * 100),
            '3': Math.floor(Math.random() * 50),
            '2': Math.floor(Math.random() * 20),
            '1': Math.floor(Math.random() * 10)
          },
          totalReviews: 500,
          recentReviews: Array.from({ length: 5 }, (_, i) => ({
            id: `review-${i + 1}`,
            productName: `Product ${i + 1}`,
            brand: `Brand ${i + 1}`,
            category: 'Electronics',
            review: 'Great product, highly recommended!',
            rating: Math.floor(Math.random() * 3) + 3,
            ratingSource: ['mobile', 'web', 'app'][Math.floor(Math.random() * 3)],
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }))
        };
        break;

      case 'User Insights':
        detailType = 'userInsights';
        detailData = {
          ageGroups: {
            '18-24': { percentage: 25 },
            '25-34': { percentage: 35 },
            '35-44': { percentage: 20 },
            '45-54': { percentage: 15 },
            '55+': { percentage: 5 }
          },
          timeSpent: {
            '0-5 min': '15%',
            '5-15 min': '30%',
            '15-30 min': '25%',
            '30+ min': '30%'
          }
        };
        break;

      case 'Category Performance':
        detailType = 'category';
        detailData = {
          metrics: {
            totalRevenue: '$125,000',
            averageOrderValue: '$85',
            totalOrders: '1,470',
            conversionRate: '3.2%'
          },
          topProducts: Array.from({ length: 5 }, (_, i) => ({
            name: `Product ${i + 1}`,
            brand: `Brand ${i + 1}`,
            category: 'Electronics',
            revenue: Math.floor(Math.random() * 10000),
            orders: Math.floor(Math.random() * 100)
          }))
        };
        break;
    }

    setDetailView({
      type: detailType,
      data: detailData,
      history: [],
      currentIndex: 0
    });
  };

  const handleDetailClose = () => {
    setDetailView(null);
  };

  const handleDetailNavigate = (direction: 'back' | 'forward') => {
    if (!detailView) return;

    const newIndex = direction === 'back' 
      ? detailView.currentIndex - 1 
      : detailView.currentIndex + 1;

    if (newIndex >= 0 && newIndex < detailView.history.length) {
      setDetailView({
        ...detailView,
        currentIndex: newIndex,
        type: detailView.history[newIndex].type as any,
        data: detailView.history[newIndex].data
      });
    }
  };

  const handleProductClick = (productId: string) => {
    if (!detailView) return;

    // Add product details to history
    const newHistory = [
      ...detailView.history.slice(0, detailView.currentIndex + 1),
      { type: 'product', data: { id: productId } }
    ];

    setDetailView({
      ...detailView,
      history: newHistory,
      currentIndex: newHistory.length - 1,
      type: 'product',
      data: { id: productId }
    });
  };

  const handleReviewSubmit = (review: Omit<ReviewData, 'id'>) => {
    const newReview: ReviewData = {
      ...review,
      id: `REV-${Date.now()}`
    };
    setReviews(prev => [...prev, newReview]);
    // Here you would typically make an API call to save the review
    console.log('New review submitted:', newReview);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Analytics Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateReview(true)}
                className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Review
              </button>
              <button className="px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="px-4 py-6 sm:px-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium shadow-sm"
                placeholder="Search reviews, products, trends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="px-4 py-6 sm:px-0">
            <div className="flex space-x-3">
              {['1d', '7d', '15d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm ${
                    selectedTimeRange === range
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMetrics.map((metric) => (
              <div
                key={metric.title}
                className="bg-white overflow-hidden shadow-md border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleMetricClick(metric)}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-lg p-3 ${metric.color} shadow-sm`}>
                      <div className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{metric.title}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {metric.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Data Visualization */}
          <div className="mt-8">
            <DataVisualization timeRange={selectedTimeRange} category={selectedCategory} />
          </div>

          {/* User Insights Section */}
          {filteredUserInsights && (
            <div className="mt-8">
              <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">User Insights</h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMetricClick({ 
                        title: 'User Insights', 
                        value: userInsights || {} 
                      });
                    }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Age Group Ratings</h3>
                    <div className="space-y-3">
                      {Object.entries(filteredUserInsights.ageGroups).map(([age, data]) => (
                        <div key={age} className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">{age}</span>
                          <span className="text-sm font-bold text-gray-900">{data.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Time Spent</h3>
                    <div className="space-y-3">
                      {Object.entries(filteredUserInsights.timeSpent).map(([period, time]) => (
                        <div key={period} className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">{period}</span>
                          <span className="text-sm font-bold text-gray-900">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">CTR</h3>
                    <div className="space-y-3">
                      {Object.entries(filteredUserInsights.ctr).map(([period, rate]) => (
                        <div key={period} className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">{period}</span>
                          <span className="text-sm font-bold text-gray-900">{rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Retention Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Returning Users</span>
                        <span className="text-sm font-bold text-gray-900">{filteredUserInsights.retention.returningUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Drop-off Users</span>
                        <span className="text-sm font-bold text-gray-900">{filteredUserInsights.retention.dropOffUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Successful Payments</span>
                        <span className="text-sm font-bold text-gray-900">{filteredUserInsights.retention.successfulPayments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Insights */}
          <div className="mt-8">
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Category Insights</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMetricClick({ 
                      title: 'Category Performance', 
                      value: selectedCategory 
                    });
                  }}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
              <div className="flex space-x-3 mb-6">
                {['all', 'dresses', 'shoes', 'accessories'].map((category) => (
                  <button
                    key={category}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category);
                    }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Average Order Value</h3>
                  <p className="text-2xl font-bold text-gray-900">${(Math.random() * 50 + 50).toFixed(2)}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Quantity Sold</h3>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 1000 + 500)}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">User Satisfaction</h3>
                  <p className="text-2xl font-bold text-gray-900">{(Math.random() * (5 - 3) + 3).toFixed(1)}/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCreateReview && (
        <CreateReview
          onClose={() => setShowCreateReview(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {showReviewsList && (
        <ReviewsList
          reviews={filteredReviews}
          onClose={() => setShowReviewsList(false)}
        />
      )}

      {detailView && (
        <DetailView
          type={detailView.type}
          data={detailView.data}
          onClose={handleDetailClose}
          onNavigate={handleDetailNavigate}
          hasNext={detailView.currentIndex < detailView.history.length - 1}
          hasPrevious={detailView.currentIndex > 0}
        />
      )}
    </div>
  );
};

export default Dashboard; 