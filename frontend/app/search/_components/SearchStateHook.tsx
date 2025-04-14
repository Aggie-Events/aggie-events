import { useState, useEffect } from "react";
import { SearchFilters, EventPageInformation } from "@/config/query-types";
import { useRouter, useSearchParams } from "next/navigation";
import { setFilterParam, castFilterParam } from "@/config/query-types";

interface SearchState {
  filters: SearchFilters;
  loading: boolean;
  eventStates: Record<number, { isSaved: boolean; saves: number }>;
}

export function useSearchState() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [state, setState] = useState<SearchState>({
    filters: {},
    loading: false,
    eventStates: {},
  });

  /**
   * Get the filters from the URL search params
   * @param resetPage Whether to reset the page number to 1 on filter change
   * @returns The filters
   */
  function getFilters() {
    const params = new URLSearchParams(searchParams);
    let newFilters: SearchFilters = {};
    for (const [key, value] of params.entries()) {
      const castKey = key as keyof SearchFilters;
      const val = castFilterParam(key, value);
      setFilterParam(newFilters, castKey, val);
    }

    return newFilters;
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      filters: getFilters(),
      loading: false,
    }));
  }, [searchParams]);

  const updateFilters = (newFilters: SearchFilters) => {
    let hasChanged = false;
    let hasNonPageChange = false;

    for (const [key, value] of Object.entries(newFilters)) {
      if (state.filters[key as keyof SearchFilters] !== value) {
        hasChanged = true;
        if (key !== "page") {
          hasNonPageChange = true;
        }
      }
    }

    // Don't update the URL if the filters haven't changed
    if (!hasChanged) {
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    // If the filters have changed, reset the page number to 1
    if (hasNonPageChange) {
      newFilters.page = 1;
    }

    // Update the URL with the current filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val instanceof Set) {
        val.size > 0
          ? params.set(key, Array.from(val).join(","))
          : params.delete(key);
      } else if (Array.isArray(val)) {
        params.set(key, val.join(","));
      } else {
        params.set(key, val.toString());
      }
    });

    push(`/search?${params.toString()}`);
  };

  const updateEventState = (
    eventId: number,
    isSaved: boolean,
    saves: number,
  ) => {
    setState((prev) => ({
      ...prev,
      eventStates: {
        ...prev.eventStates,
        [eventId]: { isSaved, saves },
      },
    }));
  };

  return {
    state,
    updateFilters,
    updateEventState,
  };
}
