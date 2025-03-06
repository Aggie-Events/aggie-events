/**
 * API Router module for handling various API routes.
 * @module routers/api-router
 */

import express from "express";
import { usersRouter } from "./api-router/users";
import { orgRouter } from "./api-router/orgs";
import { searchRouter } from "./api-router/search";
import { eventRouter } from "./api-router/events";
import { tagRouter } from "./api-router/tag";
import { devRouter } from "./api-router/dev";
import {uploadRouter} from "./api-router/upload"
export const apiRouter = express.Router();

/**
 * @route GET /api/auth
 * @description Check authentication status
 * @access Private - Requires authentication
 * @returns {Object} JSON object with a message indicating the authentication status.
 */
apiRouter.get("/auth", async (req, res) => {
  console.log("Get auth req.user: " + req.user);
  if (!req.user) {
    res.status(401).json({ message: "User not logged in" });
  } else {
    res.status(200).json({ message: "User is logged in" });
  }
});

/**
 * @route GET /api/test
 * @description Test the API
 * @access Public
 * @returns {Object} JSON object with a message indicating the test status.
 */
apiRouter.get("/test", async (req, res) => {
  res.status(200).json({ message: "Test successful!" });
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/orgs", orgRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/tags", tagRouter);
apiRouter.use("/upload", uploadRouter)

if (process.env.NODE_ENV === "development") {
  apiRouter.use("/dev", devRouter);
}
