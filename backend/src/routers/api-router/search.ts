import { db } from "../../database";
import express from "express";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { Expression, SqlBool } from "kysely";

export const searchRouter = express.Router();

/**
 * @route GET /api/search/events
 * @description Search for events based on query parameters
 * @returns {Object} JSON object containing the search results and pagination information
 * @returns {Error} 500 error if events cannot be searched
 */
searchRouter.get("/events", async (req, res) => {
  const {
    query: queryString,
    tags: tags,
    name: name,
    page: page = 1,
    pageSize: pageSize = 3,
    sort: sortBy,
  } = req.query;

  try {
    // TODO: check for typos
    let query = db.selectFrom("events as e").where((eb) => {
      const filters: Expression<SqlBool>[] = [];

      if (queryString) {
        filters.push(eb("e.event_name", "ilike", `%${queryString}%`));
      }

      if (name) {
        filters.push(eb("e.event_name", "ilike", `%${name}%`));
      }
      return eb.and(filters);
    });

    // Filtering by tags
    if (tags) {
      const tagArray = (tags as string).split(",");
      // Adds a subquery that filters events that don't have all the tags in the tagArray
      query = query.where((eb) => {
        return eb(
          "e.event_id",
          "in",
          eb
            .selectFrom("events as e")
            .innerJoin("eventtags as e_t", "e.event_id", "e_t.event_id")
            .innerJoin("tags as t", "e_t.tag_id", "t.tag_id")
            .where("t.tag_name", "in", tagArray)
            .groupBy("e.event_id")
            // Ensures that the event at least has all the tags in the tagArray
            // For example, if the tagArray is ["tag1", "tag2"], this ensures that events with only "tag1" are not included
            .having((eb) => {
              return eb(
                eb.fn.count<number>("e.event_id"),
                ">=", // Technically it doesn't matter if we use >= or = (I think)
                tagArray.length,
              );
            })
            .select("e.event_id"),
        );
      });
    }

    // Count the total number of events after filter
    // TODO: Maybe there is a more efficient way to count rows instead of repeating all filtering
    const resultSize = await query
      .select((eb) => eb.fn.count<number>("e.event_id").as("event_count"))
      .executeTakeFirstOrThrow();

    switch (sortBy) {
      case "start":
        query = query.orderBy("e.start_time", "asc");
        break;
      case "heart":
        query = query.orderBy("e.event_likes", "desc");
        break;
      case "posted":
        query = query.orderBy("e.date_created", "desc");
        break;
      case "updated":
        query = query.orderBy("e.date_modified", "desc");
        break;
      case "alpha_asc":
        query = query.orderBy("e.event_name", "asc");
        break;
      case "alpha_desc":
        query = query.orderBy("e.event_name", "desc");
        break;
      default:
        query = query.orderBy("e.start_time", "asc");
        break;
    }

    query = query
      .innerJoin("users as u", "e.contributor_id", "u.user_id")
      .leftJoin("eventorgs as e_o", "e.event_id", "e_o.event_id")
      .leftJoin("orgs as o", "e_o.org_id", "o.org_id")
      .select((eb) => [
        "e.event_id as event_id",
        "e.event_name as event_name",
        "e.event_location as event_location",
        "e.event_description as event_description",
        "e.event_likes as event_likes",
        "e.start_time as start_time",
        "e.end_time as end_time",
        "e.date_created as date_created",
        "e.date_modified as date_modified",
        "u.user_name as contributor_name",
        "o.org_name as org_name",
        "o.org_id as org_id",
        jsonArrayFrom(
          eb
            .selectFrom("eventtags as e_t")
            .whereRef("e_t.event_id", "=", "e.event_id")
            .innerJoin("tags as t", "e_t.tag_id", "t.tag_id")
            .select(["t.tag_name as tag_name", "t.tag_id as tag_id"]),
        ).as("tags"),
      ]);

    const results = await query
      .limit(pageSize as number)
      .offset(((page as number) - 1) * (pageSize as number))
      .execute();

    console.log(results);
    res
      .status(200)
      .json({ results: results, resultSize: resultSize, pageSize: pageSize });
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({ message: "Error searching events" });
  }
});
