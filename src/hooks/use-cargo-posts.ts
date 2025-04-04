import { useState, useEffect } from 'react';
import type { CargoPost } from '@/app/dashboard/cargo-posts/columns';

interface UseCargoPostsProps {
  userId?: string;
}

interface UseCargoPostsReturn {
  data: CargoPost[] | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<void>;
}

export function useCargoPosts({ userId }: UseCargoPostsProps): UseCargoPostsReturn {
  const [data, setData] = useState<CargoPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = userId 
        ? `/api/cargo-posts?userId=${userId}`
        : '/api/cargo-posts';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch cargo posts');
      }
      
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data if userId is available
    if (userId) {
      fetchData();
    } else {
      // Reset data when userId is not available
      setData(null);
      setIsLoading(false);
    }
  }, [userId]);

  const mutate = async () => {
    await fetchData();
  };

  return { data, isLoading, error, mutate };
} 