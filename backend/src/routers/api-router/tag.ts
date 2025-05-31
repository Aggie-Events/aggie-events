import { db } from "../../database";
import express from "express";

export const tagRouter = express.Router();

/**
 * @route GET /api/tags
 * @description Fetch all tags from the database
 * @returns {Object} JSON object containing all tags
 * @returns {Error} 500 error if tags cannot be fetched
 */
tagRouter.get("/", async (req, res) => {
  try {
    const tags = await db
      .selectFrom("tags as t")
      .orderBy("t.tag_id", "asc")
      .select("t.tag_name")
      .execute();
    res.json({ tags: tags.map((tag: { tag_name: string }) => tag.tag_name) });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).send("Error fetching all tags!");
  }
});

/**
 * @route GET /api/tags/search
 * @description Search for tags based on query parameters
 * @returns {Object} JSON object containing the search results
 * @returns {Error} 500 error if tags cannot be fetched
 */
tagRouter.get("/search", async (req, res) => {
  console.log(req.query);
  const { query: queryString } = req.query;
  try {
    const tags = await db
      .selectFrom("tags as t")
      .where("t.tag_name", "ilike", `%${queryString}%`)
      .orderBy("t.tag_id", "asc")
      .select("t.tag_name")
      .limit(5)
      .execute();
    res.json({ tags: tags.map((tag: { tag_name: string }) => tag.tag_name) });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).send("Error fetching tags!");
  }
});
