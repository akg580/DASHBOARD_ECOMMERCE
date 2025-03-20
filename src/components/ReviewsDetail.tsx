import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewsDetailProps {
  reviews: Review[];
  onBack: () => void;
}

const ReviewsDetail: React.FC<ReviewsDetailProps> = ({ reviews, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{review.productName}</h2>
                    <p className="text-sm text-gray-500 mt-1">{review.brand}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                        />
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
                  <span>Date: {new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReviewsDetail;