import { db } from "../../database";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { SerializedUser } from "../../types/customtypes";
import express from "express";

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
      .select([
        "e.event_id as event_id",
        "e.event_name as event_name",
        "e.event_description as event_description",
        "e.event_location as event_location",
        "e.event_img as event_img",
        "e.event_likes as event_likes",
        "e.start_time as start_time",
        "e.end_time as end_time",
        "e.date_created as date_created",
        "e.date_modified as date_modified",
        "u.user_name as contributor_name",
        "o.org_name as org_name",
        "o.org_id as org_id",
      ])
      // Execute the query and return the first result
      // If no results are found, throw an error
      .executeTakeFirstOrThrow()
      .then((event) => {
        return event;
      })
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

    res.json({ ...page_data, tags } as { 
      event_id: number; 
      event_name: string; 
      event_description: string | null; 
      event_location: string | null; 
      event_img: string | null;
      event_likes: number; 
      start_time: Date; 
      end_time: Date; 
      date_created: Date; 
      date_modified: Date; 
      contributor_name: string; 
      org_name: string | null; 
      org_id: number | null; 
      tags: string[]; 
    });

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
    tags,
  }: {
    event_name: string;
    event_description: string | null;
    event_location: string | null;
    start_time: Date;
    end_time: Date;
    tags: string[];
  } = req.body;

  try {
    const event = await db
      .insertInto("events")
      .values({
        event_name: event_name,
        event_description: event_description,
        event_location: event_location,
        start_time: start_time,
        end_time: end_time,
        contributor_id: (req.user! as SerializedUser).user_id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    console.log("Event ID: " + event.event_id);
    const event_id =
      event.event_id !== undefined ? Number(event.event_id) : null;

    if (event_id === null) {
      console.error("Error creating event!");
      res.status(500).send("Error creating event!");
      return;
    }

    for (const tag of tags) {
      const tag_id = await db
        .selectFrom("tags")
        .where("tag_name", "=", tag)
        .select(["tag_id"])
        .executeTakeFirstOrThrow()
        .then((tag) => tag.tag_id);

      await db.insertInto("eventtags").values({ event_id, tag_id }).execute();
    }

    res.json(event);
    console.log("Event created!");
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Error creating event!");
  }
});

/**
 * @route GET /api/events/user/:user_id
 * @description Fetch all events created by a specific user
 * @access Public
 * @param {number} user_id - The ID of the user whose events to fetch
 * @returns {Object[]} Array of events created by the user
 * @returns {Error} 500 - Server error if events cannot be fetched
 */
eventRouter.get("/user/:user_id", async (req, res) => {
  const user_id: number = parseInt(req.params.user_id, 10);
  try {
    const events = await db.selectFrom("events").where("contributor_id", "=", user_id).selectAll().execute();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Error fetching events!");
  }
});
