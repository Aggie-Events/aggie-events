import { fetchUtil } from "@/api/fetch";
import { Event } from "@/config/dbtypes";
import { EventCreate, EventPageInformation } from "@/config/query-types";
import { SearchFilters } from "@/config/query-types";

export const searchEvents = async (
  queryString: string,
): Promise<{ events: Event[]; duration: number }> => {
  try {
    const startTime = performance.now();
    // TODO: Implement pages for search results
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}` + `/search?${queryString}`,
      {
        method: "GET",
      },
    );
    const duration = performance.now() - startTime;

    return { events: (await response.json()) ?? [], duration: duration };
  } catch (error) {
    throw new Error("Error searching events" + error);
  }
};

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
