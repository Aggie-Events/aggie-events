import { fetchUtil } from "@/api/fetch";
import { Event } from "@/config/dbtypes";
import {
  EventCreate,
  EventPageInformation,
  EventStatus,
} from "@/config/query-types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventFormData } from "@/app/dashboard/events/_components/EventForm";
export interface SearchEventsReturn {
  event_id: number;
  org_id?: number;
  org_name?: string;
  org_slug?: string;
  contributor_id: number;
  contributor_name: string;
  event_name: string;
  event_description: string;
  event_img: string | null;
  event_likes: number;
  event_status: EventStatus;
  start_time: Date;
  end_time: Date;
  event_location: string | null;
  date_created: Date;
  date_modified: Date;
  tags: string[];
}

// Add this interface to match the API expectations
export interface CreateEventData {
  event_name: string;
  event_description: string | null;
  event_location: string | null;
  start_time: Date;
  end_time: Date;
  event_status: EventStatus;
  tags: string[];
  event_img: string | null;
}

/**
 * Fetch all events
 * @returns {Promise<Event[]>} The events
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/events`,
      {
        method: "GET",
      },
    );
    return response.json() ?? [];
  } catch (error) {
    throw new Error("Error fetching events");
  }
};

/**
 * Create an event
 * @param {EventCreate} event - The event to create
 * @returns {Promise<number>} The created event ID
 */
export const createEvent = async (event: CreateEventData) => {
  try {
    console.log("Formatted event: ", event);

    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/events`,
      {
        method: "POST",
        body: event,
      },
    );
    return response.json() ?? null;
  } catch (error) {
    throw new Error("Error creating event");
  }
};

/**
 * React Query hook to get all events created by a user
 * @param {string} username - The username of the user
 * @returns {UseQueryResult<SearchEventsReturn[], Error>} The events
 */
export const useEventsByUser = (username: string) => {
  return useQuery<SearchEventsReturn[], Error>({
    queryKey: ['event', { 'user': username }],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/events/user/${username}`,
        {
          method: "GET",
        },
      );
      const events = await response.json();
      return events.map((e: any) => ({
        ...e,
        start_time: new Date(e.start_time),
        end_time: new Date(e.end_time),
        date_created: new Date(e.date_created),
        date_modified: new Date(e.date_modified),
        tags: e.tags || [],
      }));
    },
    enabled: !!username, // Only run the query if username is provided
  });
};

/**
 * React Query hook to fetch an event by ID
 * @param {string} eventId - The ID of the event to fetch
 * @returns {Promise<EventPageInformation>} The event
 */
export function useEvent(eventId: string) {
  return useQuery<EventPageInformation | null, Error>({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          method: "GET",
        },
      );
      return response.json() ?? null;
    },
    retry: false,
  });
}

export function useEventMutation(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation<EventPageInformation | null, Error, EventFormData>({
    mutationKey: ["event", eventId],
    mutationFn: async (eventData: EventFormData) => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          method: "PUT",
          body: eventData,
        },
      );
    
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
    
      return response.json();
    },
    onSuccess: () => {
      console.log("Invalidating event query");
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}

/**
 * React Query hook to search for events
 * @param {string} searchParams - The search parameters
 * @returns {Promise<{events: SearchEventsReturn[], duration: number, pageSize: number, resultSize: number}>} The search results
 */
export function useEventSearch(searchParams: string) {
  return useQuery<{
    events: SearchEventsReturn[];
    duration: number;
    pageSize: number;
    resultSize: number;
  }>({
    queryKey: ["eventSearch", "search", searchParams],
    queryFn: async () => {
      const startTime = performance.now();

      // TODO: Implement pages for search results
      const {
        results: response,
        resultSize: resultSize,
        pageSize: pageSize,
      } = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}` + `/search/events?${searchParams}`,
        {
          method: "GET",
        },
      ).then((res) => res.json());

      const duration = performance.now() - startTime;

      console.log("API Output: ", response);
      return {
        events: response.map((e: any) => ({
          ...e,
          start_time: new Date(e.start_time),
          end_time: new Date(e.end_time),
          date_created: new Date(e.date_created),
          date_modified: new Date(e.date_modified),
          tags: e.tags.map((t: any) => t.tag_name),
        })),
        duration: duration,
        pageSize: pageSize,
        resultSize: resultSize.event_count,
      };
    },
    staleTime: Infinity, // Never stale (don't want the event search results to change while the user is interacting with the page)
    placeholderData: keepPreviousData, // Keep the previous data while the new data is being fetched (prevents flickering)
  });
}

/**
 * React Query hook to search for user's events with sorting and pagination
 * @param {{ page?: number, pageSize?: number, sort?: string, order?: 'asc' | 'desc' }} options - Search options
 * @returns {UseQueryResult<{events: SearchEventsReturn[], pageSize: number, resultSize: number, currentPage: number}>} The search results
 */
export function useEventSearchUser(options: {
  page?: number;
  pageSize?: number;
  sort?: "name" | "eventDate" | "lastModified" | "status" | "likes";
  order?: "asc" | "desc";
} = {}) {
  const { page = 1, pageSize = 10, sort = "eventDate", order = "desc" } = options;

  return useQuery<{
    events: SearchEventsReturn[];
    pageSize: number;
    resultSize: number;
    currentPage: number;
  }>({
    queryKey: ["eventSearch", "user", { page, pageSize, sort, order }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort: sort,
        order: order
      });

      const { results, resultSize, pageSize: returnedPageSize, currentPage } = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/search/events/user?${params}`,
        {
          method: "GET",
        },
      ).then((res) => res.json());

      return {
        events: results.map((e: any) => ({
          ...e,
          start_time: new Date(e.start_time),
          end_time: new Date(e.end_time),
          date_created: new Date(e.date_created),
          date_modified: new Date(e.date_modified),
          tags: e.tags || [],
          event_likes: e.event_likes || 0
        })),
        pageSize: returnedPageSize,
        resultSize,
        currentPage
      };
    },
    staleTime: Infinity, // Never stale (don't want the event search results to change while the user is interacting with the page)
    placeholderData: keepPreviousData, // Keep the previous data while the new data is being fetched (prevents flickering)
  });
}
