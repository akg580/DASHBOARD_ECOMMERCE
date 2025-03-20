import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

interface Review {
  id: string;
  user: {
    name: string;
    age: string;
    location: string;
  };
  product: {
    name: string;
    category: string;
    image: string;
  };
  rating: number;
  comment: string;
  date: string;
}

const ReviewDetails: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const reviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        age: '28',
        location: 'New York',
      },
      product: {
        name: 'Summer Floral Dress',
        category: 'Dresses',
        image: 'https://via.placeholder.com/150',
      },
      rating: 5,
      comment: 'Beautiful dress, perfect for summer!',
      date: '2024-03-15',
    },
    // Add more sample reviews here
  ];

  const filteredReviews = reviews.filter((review) => {
    if (selectedRating && review.rating !== selectedRating) return false;
    if (selectedCategory !== 'all' && review.product.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Review Details</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex space-x-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                className={`p-2 rounded-md ${
                  selectedRating === rating ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'
                }`}
              >
                <StarIcon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="Dresses">Dresses</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start">
              <img
                src={review.product.image}
                alt={review.product.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{review.product.name}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{review.comment}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>{review.user.name}</span>
                  <span className="mx-2">•</span>
                  <span>{review.user.age} years</span>
                  <span className="mx-2">•</span>
                  <span>{review.user.location}</span>
                  <span className="mx-2">•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewDetails; 