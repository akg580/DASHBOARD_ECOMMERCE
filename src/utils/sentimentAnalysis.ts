export const analyzeSentiment = (comment: string, rating: number): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['great', 'good', 'excellent', 'love', 'perfect', 'beautiful', 'amazing'];
  const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'disappointed', 'issue', 'problem'];

  const words = comment.toLowerCase().split(' ');
  let positiveCount = words.filter(word => positiveWords.includes(word)).length;
  let negativeCount = words.filter(word => negativeWords.includes(word)).length;

  // Factor in the rating
  if (rating >= 4) positiveCount++;
  if (rating <= 2) negativeCount++;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};