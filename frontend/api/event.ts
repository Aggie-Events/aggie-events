import { fetchUtil } from "@/api/fetch";
import { Event } from "@/config/dbtypes";
import { EventCreate, EventPageInformation } from "@/config/query-types";
import { SearchFilters } from "@/config/query-types";

export interface SearchEventsReturn {
  event_id: number;
  org_id?: number;
  org_name?: string;
  contributor_id: number;
  contributor_name: string;
  event_name: string;
  event_description: string;
  event_likes: number;
  start_time: Date;
  end_time: Date;
  event_location: string | null;
  date_created: Date;
  date_modified: Date;
  tags: string[];
}
/**
 * Search for events based on query parameters
 * @param {string} queryString - The query string to search for
 * @returns {Promise<{events: SearchEventsReturn[], duration: number, pageSize: number, resultSize: number}>} The search results
 */
export const searchEvents = async (
  queryString: string,
): Promise<{
  events: SearchEventsReturn[];
  duration: number;
  pageSize: number;
  resultSize: number;
}> => {
  try {
    const startTime = performance.now();
    // TODO: Implement pages for search results
    const {
      results: response,
      resultSize: resultSize,
      pageSize: pageSize,
    } = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}` + `/search/events?${queryString}`,
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
  } catch (error) {
    throw new Error("Error searching events" + error);
  }
};

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
 * Fetch an event by its ID
 * @param {number} eventID - The ID of the event to fetch
 * @returns {Promise<EventPageInformation>} The event
 */
export const fetchEventById = async (
  eventID: number,
): Promise<EventPageInformation> => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventID}`,
      {
        method: "GET",
      },
    );
    return response.json() ?? null;
  } catch (error) {
    throw new Error("Error fetching event");
  }
};

/**
 * Create an event
 * @param {EventCreate} event - The event to create
 * @returns {Promise<Event>} The created event
 */
export const createEvent = async (event: EventCreate) => {
  try {
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
 * Get all events created by a user
 * @param {string} username - The username of the user
 * @returns {Promise<SearchEventsReturn[]>} The events
 */
export const getEventsByUser = async (username: string): Promise<SearchEventsReturn[]> => {
  try {
    const response = await fetchUtil(`${process.env.NEXT_PUBLIC_API_URL}/events/user/${username}`, {
      method: "GET",
    });
    const events = await response.json();
    return events.map((e: any) => ({
      ...e,
      start_time: new Date(e.start_time),
      end_time: new Date(e.end_time),
      date_created: new Date(e.date_created),
      date_modified: new Date(e.date_modified),
      tags: e.tags || []
    }));
  } catch (error) {
    throw new Error("Error getting user events: " + error);
  }
};

// export const getEventTags = async (event_id: number): Promise<string[]> => {
//     try {
//         const IDs = await fetchUtil(`${process.env.NEXT_PUBLIC_API_URL}/events/${event_id}/tags`, {
//             method: 'GET',
//         }); // NOTE: currently working on making the event tags populate with the actual db data

//         const response = await fetchUtil(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
//             method: 'GET',
//             body: JSON.stringify({ query }),
//         });
//         return response.json() ?? [];
//     } catch (error) {
//         throw new Error('Error getting event tags' + error);
//     }
