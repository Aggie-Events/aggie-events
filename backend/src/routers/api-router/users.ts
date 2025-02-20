import { authMiddleware } from "../../middlewares/authMiddleware";
import { db } from "../../database";
import express from "express";
import { useQuery } from "@tanstack/react-query";
export const usersRouter = express.Router();

/**
 * @route GET /api/users
 * @description Fetch all users
 * @access Private - Requires authentication
 * @returns {Object[]} Array of all users
 * @returns {Error} 500 - Server error if users cannot be fetched
 */
usersRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await db.selectFrom("users").selectAll().execute();
    res.json(users);
    console.log("User requested!");
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users!");
  }
});

/**
 * @route POST /api/users
 * @description Create a new user
 * @access Private - Requires authentication
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @returns {string} A message indicating the user creation status.
 */
usersRouter.post("/", authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  console.log("Post user req.user: " + req.user);
  try {
    await db
      .insertInto("users")
      .values({ user_name: username, user_email: email, user_displayname: username })
      .execute();
    res.send("User created!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user!");
  }
});

/**
 * @route PUT /api/users
 * @description Update a user
 * @access Private - Requires authentication
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The new name of the user.
 * @param {string} req.body.email - The email of the user to update.
 * @returns {string} A message indicating the user update status.
 * @returns {Error} 500 - Server error if users cannot be updated
 */
usersRouter.put("/", authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  try {
    await db
      .updateTable("users")
      .set("user_name", username)
      .where("user_email", "=", email)
      .execute();
    res.send(username + "");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user!");
  }
});

/**
 * @route DELETE /api/users
 * @description Delete all users
 * @access Private - Requires authentication
 * @returns {string} A message indicating the user deletion status.
 * @returns {Error} 500 - Server error if users cannot be deleted
 */
usersRouter.delete("/", authMiddleware, async (req, res) => {
  try {
    await db.deleteFrom("users").execute();
    res.send("Users deleted!");
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).send("Error deleting users!");
  }
});

/**
 * @route POST /api/users/exists
 * @description Check if a username exists
 * @access Public
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username to check.
 * @returns {Object} A message indicating if the username exists.
 */
usersRouter.post("/exists", async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ 
      message: "Username is required",
      exists: false 
    });
  }

  try {
    const user = await db
      .selectFrom("users")
      .where("user_name", "=", username)
      .select("user_id")
      .executeTakeFirst();

    res.json({ 
      exists: user !== undefined,
      message: user !== undefined ? "Username is taken" : "Username is available"
    });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ 
      message: "Error checking username",
      exists: false 
    });
  }
});
usersRouter.post("/validate", async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      message: "Username is required",
      isValid: false
    });
  }

  // Check length constraints or other format validations
  if (username.length > 20 || username.length < 3) {
    return res.status(400).json({
      isValid: false,
      message: "Username is too long"
    });
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return res.status(400).json({
      isValid: false,
      message: "Username must be alphanumeric"
    });
  }
      return res.json({
        isValid: true,
        message: "Username is valid"
  })
});

/**
 * @route PUT /api/users/username
 * @description Update the username of the authenticated user
 * @access Private
 */
usersRouter.put("/username", authMiddleware, async (req, res) => {
  const { username } = req.body;
  const userId = (req.user as any).user_id;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Check if username is already taken
    const existingUser = await db
      .selectFrom("users")
      .where("user_name", "=", username)
      .select("user_id")
      .executeTakeFirst();

    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Update the username
    await db
      .updateTable("users")
      .set({ user_name: username })
      .where("user_id", "=", userId)
      .execute();

    res.json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Failed to update username" });
  }
});

/**
 * @route GET /api/users/:username
 * @description Get user information by username
 * @access Public
 * @param {string} req.params.username - The username of the user to get
 * @returns {Object} User information
 */
usersRouter.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await db
      .selectFrom("users")
      .where("user_name", "=", username)
      .selectAll()
      .executeTakeFirst();

    if (!user) {  
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

/**
 * @route GET /api/users/:username/profile
 * @description Get comprehensive user profile information
 * @access Public
 * @param {string} req.params.username - The username of the user to get
 * @returns {Object} User profile information including events and organizations
 */
usersRouter.get("/:username/profile", async (req, res) => {
  const { username } = req.params;

  try {
    // Get user information
    const user = await db
      .selectFrom("users as u")
      .where("u.user_name", "=", username)
      .select([
        "u.user_id",
        "u.user_name",
        "u.user_displayname",
        "u.user_email",
        "u.user_verified",
        "u.user_major",
        "u.user_year",
        "u.user_description",
        "u.user_profile_img",
      ])
      .executeTakeFirst();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's events with tags
    const events = await db
      .selectFrom("events as e")
      .where("e.contributor_id", "=", user.user_id)
      .leftJoin("eventtags as et", "e.event_id", "et.event_id")
      .leftJoin("tags as t", "et.tag_id", "t.tag_id")
      .leftJoin("eventorgs as eo", "e.event_id", "eo.event_id")
      .leftJoin("orgs as o", "eo.org_id", "o.org_id")
      .select([
        "e.event_id",
        "e.event_name",
        "e.event_description",
        "e.event_location",
        "e.event_img",
        "e.start_time",
        "e.end_time",
        "e.date_created",
        "e.date_modified",
        "o.org_id",
        "o.org_name",
        "t.tag_name",
      ])
      .execute();

    // Get user's organization affiliations
    const organizations = await db
      .selectFrom("userorgs as uo")
      .where("uo.user_id", "=", user.user_id)
      .innerJoin("orgs as o", "uo.org_id", "o.org_id")
      .select([
        "o.org_id",
        "o.org_name",
        "o.org_description",
        "o.org_icon",
      ])
      .execute();

    // Process events to group tags
    const processedEvents = events.reduce((acc: any[], event) => {
      const existingEvent = acc.find(e => e.event_id === event.event_id);
      if (existingEvent) {
        if (event.tag_name && !existingEvent.tags.includes(event.tag_name)) {
          existingEvent.tags.push(event.tag_name);
        }
      } else {
        acc.push({
          ...event,
          tags: event.tag_name ? [event.tag_name] : [],
        });
      }
      return acc;
    }, []);

    console.log({
      ...user,
      events: processedEvents,
      organizations,
    });

    res.json({
      ...user,
      events: processedEvents,
      organizations,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});
