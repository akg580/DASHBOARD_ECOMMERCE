import { Review, CategoryInsight, UserInsight } from '../types';

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: 'p1',
    userId: 'u1',
    productName: 'Summer Floral Dress',
    brand: 'Ethnic Fusion',
    rating: 4,
    comment: 'Beautiful design but the fabric could be better. Love the fit though!',
    sentiment: 'positive',
    category: 'Dresses',
    date: '2024-03-15',
    imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400',
    userAge: 25,
    purchaseVerified: true
  },
  {
    id: '2',
    productId: 'p2',
    userId: 'u2',
    productName: 'Classic Denim Jeans',
    brand: 'DenimCo',
    rating: 2,
    comment: 'The sizing runs small and the quality is not worth the price.',
    sentiment: 'negative',
    category: 'Jeans',
    date: '2024-03-14',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
    userAge: 32,
    purchaseVerified: true
  },
  {
    id: '3',
    productId: 'p3',
    userId: 'u3',
    productName: 'Cotton Kurta',
    brand: 'Traditional Touch',
    rating: 5,
    comment: 'Perfect for summer! Great quality and beautiful embroidery.',
    sentiment: 'positive',
    category: 'Ethnic Wear',
    date: '2024-03-13',
    imageUrl: 'https://images.unsplash.com/photo-1614255976202-31c8302a7e99?w=400',
    userAge: 28,
    purchaseVerified: true
  }
];

export const mockInsights: CategoryInsight[] = [
  {
    category: 'Dresses',
    sentiment: {
      positive: 65,
      neutral: 20,
      negative: 15
    },
    commonPhrases: ['good fit', 'beautiful design', 'fabric quality'],
    averageRating: 4.2
  },
  {
    category: 'Jeans',
    sentiment: {
      positive: 45,
      neutral: 30,
      negative: 25
    },
    commonPhrases: ['size issues', 'comfortable', 'durability'],
    averageRating: 3.8
  },
  {
    category: 'Ethnic Wear',
    sentiment: {
      positive: 75,
      neutral: 15,
      negative: 10
    },
    commonPhrases: ['traditional look', 'good craftsmanship', 'value for money'],
    averageRating: 4.5
  }
];

export const mockUserInsights: UserInsight = {
  timeRange: '30d',
  metrics: {
    ageGroups: [
      { range: '18-24', rating: 4.2, count: 1200 },
      { range: '25-34', rating: 4.5, count: 2500 },
      { range: '35-44', rating: 3.8, count: 1800 },
      { range: '45+', rating: 4.0, count: 900 }
    ],
    timeSpent: {
      total: 450000, // in minutes
      average: 15 // minutes per session
    },
    searchMetrics: {
      topSearches: [
        { term: 'summer dress', count: 1200 },
        { term: 'ethnic wear', count: 980 },
        { term: 'denim jeans', count: 850 },
        { term: 'cotton kurta', count: 720 },
        { term: 'party wear', count: 650 }
      ],
      ctr: 24.5
    },
    userMetrics: {
      totalUsers: 10000,
      returningUsers: 6500,
      dropOffs: 2000,
      successfulPayments: 4500,
      retentionRate: 65
    }
  }
};