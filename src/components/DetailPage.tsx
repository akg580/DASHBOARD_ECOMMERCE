import React, { useState } from 'react';
import { ArrowLeft, Download, Search, Filter } from 'lucide-react';
import { DetailPageProps, Review, UserInsight } from '../types';
import * as XLSX from 'xlsx';

const DetailPage: React.FC<DetailPageProps> = ({ type, data, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1d' | '7d' | '15d' | '30d'>('30d');

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data as any[]);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${type}-report.xlsx`);
  };

  const renderReviews = (reviews: Review[]) => {
    const filteredReviews = reviews.filter(review => 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-48 h-48 flex-shrink-0">
                <img 
                  src={review.imageUrl} 
                  alt={review.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{review.productName}</h2>
                    <p className="text-sm text-gray-500 mt-1">{review.brand}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.purchaseVerified && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        Verified Purchase
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Category: {review.category}</span>
                  <span>Age Group: {review.userAge ? `${review.userAge} years` : 'N/A'}</span>
                  <span>Date: {new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderUserInsights = (insights: UserInsight) => {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Group Analysis</h3>
            <div className="space-y-4">
              {insights.metrics.ageGroups.map(group => (
                <div key={group.range} className="flex justify-between items-center">
                  <span className="text-gray-600">{group.range}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Rating: {group.rating}</span>
                    <span className="text-sm text-gray-500">Users: {group.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Spent</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total (minutes)</span>
                <span>{insights.metrics.timeSpent.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average per Session</span>
                <span>{insights.metrics.timeSpent.average} min</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Searches</h3>
            <div className="space-y-2">
              {insights.metrics.searchMetrics.topSearches.map(search => (
                <div key={search.term} className="flex justify-between items-center">
                  <span className="text-gray-600">{search.term}</span>
                  <span className="text-sm text-gray-500">{search.count}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CTR</span>
                  <span>{insights.metrics.searchMetrics.ctr}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Users</span>
                <span>{insights.metrics.userMetrics.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Returning Users</span>
                <span>{insights.metrics.userMetrics.returningUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Drop-offs</span>
                <span>{insights.metrics.userMetrics.dropOffs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Successful Payments</span>
                <span>{insights.metrics.userMetrics.successfulPayments}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-gray-600">Retention Rate</span>
                <span>{insights.metrics.userMetrics.retentionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {type === 'reviews' ? 'Review Details' :
                 type === 'sentiment' ? 'Sentiment Analysis' :
                 type === 'rating' ? 'Rating Analysis' :
                 'User Insights'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {type === 'insights' && (
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="1d">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="15d">Last 15 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              )}
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          {type !== 'insights' && (
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search reviews, products, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {type === 'insights' 
          ? renderUserInsights(data as UserInsight)
          : renderReviews(data as Review[])}
      </main>
    </div>
  );
};

export default DetailPage;