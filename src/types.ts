import { StaticImageData } from 'next/image';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  date: string;
  imageUrl: string;
  userAge?: number;
  userId: string;
  purchaseVerified: boolean;
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
}

export interface CategoryInsight {
  category: string;
  sentiment: SentimentAnalysis;
  commonPhrases: string[];
  averageRating: number;
}

export interface ReviewFormData {
  productName: string;
  brand: string;
  category: string;
  rating: number;
  comment: string;
}

export interface UserInsight {
  timeRange: '1d' | '7d' | '15d' | '30d';
  metrics: {
    ageGroups: {
      range: string;
      rating: number;
      count: number;
    }[];
    timeSpent: {
      total: number;
      average: number;
    };
    searchMetrics: {
      topSearches: { term: string; count: number }[];
      ctr: number;
    };
    userMetrics: {
      totalUsers: number;
      returningUsers: number;
      dropOffs: number;
      successfulPayments: number;
      retentionRate: number;
    };
  };
}

export interface DetailPageProps {
  type: 'reviews' | 'sentiment' | 'rating' | 'insights';
  data: Review[] | UserInsight;
  onBack: () => void;
}