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
    filters: getFilters(false),
    loading: false,
    eventStates: {},
  });

  function getFilters(resetPage: boolean = false) {
    const params = new URLSearchParams(searchParams);
    let newFilters: SearchFilters = {};
    for (const [key, value] of params.entries()) {
      const castKey = key as keyof SearchFilters;
      const val = castFilterParam(key, value);
      setFilterParam(newFilters, castKey, val);
    }

    if (resetPage) {
      // Check if any non-page filters changed
      const hasFilterChanges = Object.entries(newFilters).some(
        ([key, value]) => {
          if (key === "page") return false;
          return (
            JSON.stringify(state.filters[key as keyof SearchFilters]) !==
            JSON.stringify(value)
          );
        },
      );

      if (hasFilterChanges) {
        newFilters.page = 1;
      }
    }

    return newFilters;
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      filters: getFilters(true),
      loading: false,
    }));
  }, [searchParams]);

  const updateFilters = (newFilters: SearchFilters) => {
    setState((prev) => ({ ...prev, loading: true }));

    // Update the URL with the current filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        if (val instanceof Set) {
          val.size > 0
            ? params.set(key, Array.from(val).join(","))
            : params.delete(key);
        } else if (Array.isArray(val)) {
          params.set(key, val.join(","));
        } else {
          params.set(key, val.toString());
        }
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
