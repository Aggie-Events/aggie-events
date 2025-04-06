import { db } from "../../database";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { SerializedUser } from "../../types/user-storage";
import express from "express";

export const feedbackRouter = express.Router();

/**
 * @route POST /api/feedback
 * @description Submit new feedback
 * @access Public (optional auth)
 * @param {Object} req.body - Feedback data
 * @param {string} [req.body.name] - Name of the person giving feedback
 * @param {string} [req.body.email] - Email of the person giving feedback
 * @param {string} req.body.feedbackType - Type of feedback (general, bug, feature, etc.)
 * @param {string} req.body.message - Feedback message
 * @returns {Object} Success message with feedback ID
 * @returns {Error} 500 - Server error if feedback cannot be submitted
 */
feedbackRouter.post("/", authMiddleware, async (req, res) => {
  const { feedbackType, message } = req.body;

  // Validation
  if (!message || !feedbackType) {
    return res
      .status(400)
      .json({ message: "Feedback message and type are required" });
  }

  try {
    // Insert feedback into database
    const result = await db
      .insertInto("feedback")
      .values({
        name: req.user!.user_name,
        email: req.user!.user_email,
        feedback_type: feedbackType,
        message: message,
      })
      .returning("feedback_id")
      .executeTakeFirstOrThrow();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback_id: result.feedback_id,
    });

    console.log("Feedback submitted with ID:", result.feedback_id);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

// /**
//  * @route GET /api/feedback
//  * @description Get all feedback submissions
//  * @access Private - Requires authentication and moderator status
//  * @returns {Object[]} Array of all feedback submissions
//  * @returns {Error} 401 - Unauthorized if user is not a moderator
//  * @returns {Error} 500 - Server error if feedback cannot be fetched
//  */
// feedbackRouter.get("/", authMiddleware, async (req, res) => {
//   try {
//     // Check if user is a moderator by querying the users table
//     const user = req.user as SerializedUser;
//     const userRecord = await db
//       .selectFrom("users")
//       .select(["user_mod"])
//       .where("user_id", "=", user.user_id)
//       .executeTakeFirst();

//     if (!userRecord || !userRecord.user_mod) {
//       return res.status(401).json({ message: "Unauthorized: Moderator access required" });
//     }

//     // Fetch all feedback, ordered by date (newest first)
//     const feedback = await db
//       .selectFrom("feedback")
//       .selectAll()
//       .orderBy("date_created", "desc")
//       .execute();

//     res.json(feedback);
//     console.log("All feedback requested by moderator");
//   } catch (error) {
//     console.error("Error fetching feedback:", error);
//     res.status(500).json({ message: "Error fetching feedback" });
//   }
// });

// /**
//  * @route GET /api/feedback/:feedback_id
//  * @description Get a specific feedback submission
//  * @access Private - Requires authentication and moderator status
//  * @param {number} feedback_id - The ID of the feedback to fetch
//  * @returns {Object} Feedback submission
//  * @returns {Error} 401 - Unauthorized if user is not a moderator
//  * @returns {Error} 404 - Feedback not found
//  * @returns {Error} 500 - Server error if feedback cannot be fetched
//  */
// feedbackRouter.get("/:feedback_id", authMiddleware, async (req, res) => {
//   try {
//     const feedback_id = parseInt(req.params.feedback_id, 10);

//     // Check if user is a moderator by querying the users table
//     const user = req.user as SerializedUser;
//     const userRecord = await db
//       .selectFrom("users")
//       .select(["user_mod"])
//       .where("user_id", "=", user.user_id)
//       .executeTakeFirst();

//     if (!userRecord || !userRecord.user_mod) {
//       return res.status(401).json({ message: "Unauthorized: Moderator access required" });
//     }

//     // Fetch specific feedback
//     const feedback = await db
//       .selectFrom("feedback")
//       .selectAll()
//       .where("feedback_id", "=", feedback_id)
//       .executeTakeFirst();

//     if (!feedback) {
//       return res.status(404).json({ message: "Feedback not found" });
//     }

//     res.json(feedback);
//     console.log(`Feedback ${feedback_id} requested by moderator`);
//   } catch (error) {
//     console.error("Error fetching feedback:", error);
//     res.status(500).json({ message: "Error fetching feedback" });
//   }
// });
