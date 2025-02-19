import { useQuery } from '@tanstack/react-query';
import { fetchUtil } from '@/api/fetch';

/**
 * React Query hook for tag autocomplete search
 * @param query - The search query for tags
 * @returns Matching tags
 */
export function useTagAutocomplete(query: string) {
  return useQuery<string[], Error>({
    queryKey: ['tags', 'autocomplete', query],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/tags/search?query=${query}`,
        { method: "GET" }
      );
      const data = await response.json();
      return data.tags;
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
