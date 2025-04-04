import { useState, useEffect } from 'react';
import { TruckPost } from '@/app/dashboard/truck-posts/columns';

interface UseTruckPostsProps {
  userId?: string;
}

interface UseTruckPostsReturn {
  data: TruckPost[] | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<void>;
}

export function useTruckPosts({ userId }: UseTruckPostsProps = {}): UseTruckPostsReturn {
  const [data, setData] = useState<TruckPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = userId ? `/api/truck-posts?userId=${userId}` : '/api/truck-posts';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch truck posts');
      }

      const posts = await response.json();
      setData(posts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return {
    data,
    isLoading,
    error,
    mutate: fetchData
  };
} 