import { useQuery } from '@tanstack/react-query';
import { fetchUtil } from '@/api/fetch';

interface Tag {
  tag_id: number;
  tag_name: string;
}

/**
 * React Query hook for tag autocomplete search
 * @param query - The search query for tags
 * @returns Matching tags
 */
export function useTagAutocomplete(query: string) {
  return useQuery<Tag[], Error>({
    queryKey: ['tags', 'autocomplete', query],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/tags/search?query=${query}`,
        { method: "GET" }
      );
      return response.json();
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
