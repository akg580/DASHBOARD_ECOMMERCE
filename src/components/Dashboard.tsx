import React, { useState } from 'react';
import { BarChart3, MessageSquare, TrendingUp, PlusCircle, Search } from 'lucide-react';
import { mockReviews as initialReviews, mockInsights as initialInsights, mockUserInsights } from '../data/mockData';
import { Review, CategoryInsight, ReviewFormData } from '../types';
import { analyzeSentiment } from '../utils/sentimentAnalysis';
import ReviewForm from './ReviewForm';
import DetailPage from './DetailPage';

const Dashboard = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [insights, setInsights] = useState<CategoryInsight[]>(initialInsights);
  const [showForm, setShowForm] = useState(false);
  const [detailView, setDetailView] = useState<{ type: 'reviews' | 'sentiment' | 'rating' | 'insights' | null, data: any }>({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState('');

  const categories = insights.map(insight => insight.category);

  const calculateAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const calculateSentimentScore = () => {
    const positiveCount = reviews.filter(review => review.sentiment === 'positive').length;
    return Math.round((positiveCount / reviews.length) * 100);
  };

  const updateInsights = (newReview: Review) => {
    setInsights(prevInsights => {
      return prevInsights.map(insight => {
        if (insight.category === newReview.category) {
          const categoryReviews = reviews.filter(r => r.category === newReview.category);
          const totalReviews = categoryReviews.length;
          
          const positive = categoryReviews.filter(r => r.sentiment === 'positive').length;
          const negative = categoryReviews.filter(r => r.sentiment === 'negative').length;
          const neutral = totalReviews - positive - negative;

          return {
            ...insight,
            sentiment: {
              positive: Math.round((positive / totalReviews) * 100),
              negative: Math.round((negative / totalReviews) * 100),
              neutral: Math.round((neutral / totalReviews) * 100)
            },
            averageRating: Number((categoryReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
          };
        }
        return insight;
      });
    });
  };

  const handleReviewSubmit = (formData: ReviewFormData) => {
    const sentiment = analyzeSentiment(formData.comment, formData.rating);
    const newReview: Review = {
      id: `r${reviews.length + 1}`,
      productId: `p${reviews.length + 1}`,
      userId: `u${reviews.length + 1}`,
      ...formData,
      sentiment,
      date: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400',
      purchaseVerified: true
    };

    setReviews(prevReviews => [newReview, ...prevReviews]);
    updateInsights(newReview);
    setShowForm(false);
  };

  const filteredContent = () => {
    if (!searchTerm) return reviews;
    
    return reviews.filter(review => 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (detailView.type) {
    return (
      <DetailPage
        type={detailView.type}
        data={detailView.data}
        onBack={() => setDetailView({ type: null, data: null })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Fashion Feedback Analytics</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Review
            </button>
          </div>
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews, products, trends, or insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit New Review</h2>
            <ReviewForm onSubmit={handleReviewSubmit} categories={categories} />
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setDetailView({ type: 'reviews', data: reviews })}
            className="bg-white p-6 rounded-lg shadow cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setDetailView({ type: 'rating', data: reviews })}
            className="bg-white p-6 rounded-lg shadow cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{calculateAverageRating()}</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setDetailView({ type: 'sentiment', data: reviews })}
            className="bg-white p-6 rounded-lg shadow cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sentiment Score</p>
                <p className="text-2xl font-semibold text-gray-900">{calculateSentimentScore()}%</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setDetailView({ type: 'insights', data: mockUserInsights })}
            className="bg-white p-6 rounded-lg shadow cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">User Insights</p>
                <p className="text-2xl font-semibold text-gray-900">View All</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Insights */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Category Insights</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {insights.map((insight) => (
                <div key={insight.category} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{insight.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Sentiment Distribution</p>
                      <div className="flex mt-2 h-4 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${insight.sentiment.positive}%` }}
                          className="bg-green-500"
                        />
                        <div 
                          style={{ width: `${insight.sentiment.neutral}%` }}
                          className="bg-yellow-500"
                        />
                        <div 
                          style={{ width: `${insight.sentiment.negative}%` }}
                          className="bg-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Common Phrases</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {insight.commonPhrases.map((phrase) => (
                          <span key={phrase} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredContent().map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{review.productName}</h3>
                    <p className="text-sm text-gray-500">{review.brand}</p>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;