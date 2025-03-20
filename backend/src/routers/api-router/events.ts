import { sql } from "kysely";
import { db } from "../../database";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { EventInfo } from "../../types/events";
import { SerializedUser } from "../../types/user-storage";
import express from "express";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { EventStatus } from "../../types/schema";

export const eventRouter = express.Router();

/**
 * @route GET /api/events
 * @description Fetch all events from the database
 * @access Public
 * @returns {Object[]} Array of all events
 * @returns {Error} 500 - Server error if events cannot be fetched
 */
eventRouter.get("/", async (req, res) => {
  try {
    const events = await db.selectFrom("events").selectAll().execute();
    console.log("Events requested!");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Error fetching events!");
  }
});

/**
 * @route GET /api/events/:event_id
 * @description Fetch detailed information for a specific event
 * @access Public
 * @param {number} event_id - The ID of the event to fetch
 * @returns {Object} Detailed event information including tags and organization
 * @returns {Error} 404 - Event not found
 * @returns {Error} 500 - Server error if event cannot be fetched
 */
eventRouter.get("/:event_id", async (req, res) => {
  const event_id: number = parseInt(req.params.event_id, 10);
  try {
    const page_data = await db
      .selectFrom("events as e")
      .where("e.event_id", "=", event_id)
      // Join with users table (for contributor name)
      .innerJoin("users as u", "e.contributor_id", "u.user_id")
      // Join with eventorgs table (for organization id)
      // If event has no organization, e_o.org_id will be null
      .leftJoin("eventorgs as e_o", "e.event_id", "e_o.event_id")
      // Join with orgs table (for organization name)
      // If e_o.org_id is null (from above), org_name will be null
      .leftJoin("orgs as o", "e_o.org_id", "o.org_id")
      .select((eb) => [
        "e.event_id as event_id",
        "e.event_name as event_name",
        "e.event_description as event_description",
        "e.event_location as event_location",
        "e.event_img as event_img",
        "e.start_time as start_time",
        "e.end_time as end_time",
        "e.date_created as date_created",
        "e.date_modified as date_modified",
        "e.event_status as event_status",
        // Kinda hacky, just pray that there is never a user who added an event with a null user_name
        eb.fn
          .coalesce("u.user_name", sql<string>`'null_user'`)
          .as("contributor_name"),
        "o.org_name as org_name",
        "o.org_id as org_id",
      ])
      // Execute the query and return the first result
      // If no results are found, throw an error
      .executeTakeFirstOrThrow()
      .catch((error) => {
        console.error("Error fetching event:", error);
        res.status(404).json({ message: "Event not found" });
      });

    if (!page_data) {
      return;
    }

    const tags = await db
      .selectFrom("eventtags as e_t")
      .where("e_t.event_id", "=", page_data.event_id)
      .innerJoin("tags as t", "e_t.tag_id", "t.tag_id")
      .select(["t.tag_name as tag_name"])
      .execute()
      .then((tags) => {
        return tags.map((tag) => tag.tag_name);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
        res.status(404).json({ message: "Error fetching tags" });
      });

    const event_info = {
      ...page_data,
      tags: tags as string[],
      event_status: "published",
      event_views: 0,
      event_going: 0,
    };

    res.json(event_info);

    console.log("Event requested!");
    console.log("Tags: " + tags);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).send("Error fetching event!");
  }
});

/**
 * @route POST /api/events
 * @description Create a new event
 * @access Private - Requires authentication
 * @param {Object} req.body - Event data
 * @param {string} req.body.event_name - Name of the event
 * @param {string} [req.body.event_description] - Description of the event
 * @param {string} [req.body.event_location] - Location of the event
 * @param {Date} req.body.start_time - Start time of the event
 * @param {Date} req.body.end_time - End time of the event
 * @param {string[]} req.body.tags - Array of tag names for the event
 * @returns {Object} Created event object
 * @returns {Error} 500 - Server error if event cannot be created
 */
eventRouter.post("/", authMiddleware, async (req, res) => {
  const {
    event_name,
    event_description,
    event_location,
    start_time,
    end_time,
    event_status,
    tags,
    event_img,
  }: {
    event_name: string;
    event_description: string | null;
    event_location: string | null;
    start_time: Date;
    end_time: Date;
    tags: string[];
    event_img: string | null;
    event_status: EventStatus;
  } = req.body;

  try {
    // Insert the event into the database and return the event_id
    const event_id = await db
      .insertInto("events")
      .values({
        event_name: event_name,
        event_description: event_description,
        event_location: event_location,
        start_time: start_time,
        end_time: end_time,
        contributor_id: (req.user! as SerializedUser).user_id,
        event_status: event_status,
        event_img: event_img,
      })
      .returning("event_id")
      .executeTakeFirstOrThrow()
      .then((event) => {
        return event.event_id;
      });

    if (event_id === null) {
      console.error("Error creating event!");
      res.status(500).send("Error creating event!");
      return;
    }

    // Attempt to insert the tags into the database
    // If there's an error inserting tags, delete the added event
    // TODO: Try to do this in one query to prevent adding a faulty event
    try {
      if (tags.length > 0) {
        const tagIds = await db
          .selectFrom("tags")
          .where("tag_name", "in", tags)
          .select(["tag_id"])
          .execute();

        await db
          .insertInto("eventtags")
          .values(
            tagIds.map((tag) => ({ event_id: event_id, tag_id: tag.tag_id })),
          )
          .execute();
      }
    } catch (tagError) {
      console.error("Error inserting tags:", tagError);
      await db.deleteFrom("events").where("event_id", "=", event_id).execute();
      res.status(500).send("Error inserting tags, event not created!");
      return;
    }

    res.json({ event_id: event_id });
    console.log("Event created!");
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Error creating event!");
  }
});

/**
 * @route GET /api/events/user/:user_name
 * @description Fetch all events created by a specific user
 * @access Public
 * @param {number} user_id - The ID of the user whose events to fetch
 * @returns {Object[]} Array of events created by the user
 * @returns {Error} 500 - Server error if events cannot be fetched
 */
eventRouter.get("/user/:user_name", async (req, res) => {
  try {
    const user_name: string = req.params.user_name;
    const events: EventInfo[] = await db
      .selectFrom("users as u")
      .where("u.user_name", "=", user_name)
      .innerJoin("events as e", "u.user_id", "e.contributor_id")
      .leftJoin("eventorgs as e_o", "e.event_id", "e_o.event_id")
      .leftJoin("orgs as o", "e_o.org_id", "o.org_id")
      .select((eb) => [
        "e.event_id",
        eb.fn.coalesce("e.event_name", sql<string>`'Untitled Event'`).as("event_name"),
        "e.event_description",
        "e.event_location",
        "e.start_time",
        "e.end_time",
        "e.date_created",
        "e.date_modified",
        eb.fn
          .coalesce("u.user_name", sql<string>`'null_user'`)
          .as("contributor_name"),
        "o.org_name",
        jsonArrayFrom(
          eb
            .selectFrom("eventtags as e_t")
            .whereRef("e_t.event_id", "=", "e.event_id")
            .innerJoin("tags as t", "e_t.tag_id", "t.tag_id")
            .select("t.tag_name"),
        ).as("tags"),
      ])
      .execute()
      .then((events) =>
        events.map((event) => ({
          ...event,
          tags: (event.tags as { tag_name: string }[]).map((t) => t.tag_name),
          event_img: null,
          event_status: "published" as const,
          event_likes: 0,
          event_views: 0,
          event_going: 0,
        })),
      );

    res.json(events);
    console.log("User events requested!");
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Error fetching events!");
  }
});

/**
 * @route PUT /api/events/:event_id
 * @description Update an existing event
 * @access Private - Requires authentication and event ownership
 * @param {number} event_id - The ID of the event to update
 * @param {Object} req.body - Updated event data
 * @param {string} [req.body.event_name] - Name of the event
 * @param {string} [req.body.event_description] - Description of the event
 * @param {string} [req.body.event_location] - Location of the event
 * @param {Date} [req.body.start_time] - Start time of the event
 * @param {Date} [req.body.end_time] - End time of the event
 * @param {string[]} [req.body.tags] - Array of tag names for the event
 * @param {string} [req.body.event_img] - Event image URL
 * @returns {Object} Updated event object
 * @returns {Error} 401 - Unauthorized if user is not the event contributor
 * @returns {Error} 404 - Event not found
 * @returns {Error} 500 - Server error if event cannot be updated
 */
eventRouter.put("/:event_id", authMiddleware, async (req, res) => {
  const event_id: number = parseInt(req.params.event_id, 10);
  const user_id = (req.user! as SerializedUser).user_id;

  try {
    // Check if event exists and user is authorized
    const event = await db
      .selectFrom("events")
      .where("event_id", "=", event_id)
      .select(["contributor_id"])
      .executeTakeFirst();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.contributor_id !== user_id) {
      return res.status(401).json({ message: "Unauthorized to edit this event" });
    }

    const {
      event_name,
      event_description,
      event_location,
      start_time,
      end_time,
      tags,
      event_img,
      event_status,
    } = req.body;

    // Update event details
    await db
      .updateTable("events")
      .set({
        event_name: event_name,
        event_description: event_description,
        event_location: event_location,
        start_time: start_time,
        end_time: end_time,
        event_img: event_img,
        event_status: event_status,
        date_modified: new Date(),
      })
      .where("event_id", "=", event_id)
      .execute();

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove existing tags
      await db
        .deleteFrom("eventtags")
        .where("event_id", "=", event_id)
        .execute();

      if (tags.length > 0) {
        // Get tag IDs for the provided tag names
        const tagIds = await db
          .selectFrom("tags")
          .where("tag_name", "in", tags)
          .select(["tag_id"])
          .execute();

        // Insert new tags
        await db
          .insertInto("eventtags")
          .values(
            tagIds.map((tag) => ({ event_id: event_id, tag_id: tag.tag_id }))
          )
          .execute();
      }
    }

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
});
