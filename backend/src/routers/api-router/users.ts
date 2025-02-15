import { authMiddleware } from "../../middlewares/authMiddleware";
import { db } from "../../database";
import express from "express";

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
 * Route to create a new user.
 * @name post/
 * @function
 * @memberof module:routers/api-router/users
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {Object} res - The response object.
 * @returns {string} A message indicating the user creation status.
 */
usersRouter.post("/", authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  console.log("Post user req.user: " + req.user);
  try {
    await db
      .insertInto("users")
      .values({ user_name: username, user_email: email })
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
