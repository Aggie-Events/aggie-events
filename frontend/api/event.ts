import { fetchUtil } from "@/api/fetch";
import { Event } from "@/config/dbtypes";
import {
  EventCreate,
  EventPageInformation,
  EventStatus,
} from "@/config/query-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface SearchEventsReturn {
  event_id: number;
  org_id?: number;
  org_name?: string;
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
    queryKey: ['events', 'user', username],
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
    queryKey: ["events", "search", searchParams],
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
