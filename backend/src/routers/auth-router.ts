/**
 * Authentication Router module for handling authentication-related routes.
 * @module routers/auth-router
 */

import express from "express";
import passport from "passport";
import { UserStorage } from "../types/customtypes";

export const authRouter = express.Router();

/**
 * Route to check if user is authenticated.
 * @name get/user
 * @function
 * @memberof module:routers/auth-router
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing user information if authenticated, otherwise an empty object.
 */
authRouter.get("/user", async (req, res) => {
  const user = req.user as UserStorage;
  res.send(
    req.user
      ? {
          user_name: user.user_name,
          user_img: user.user_img,
          user_email: user.user_email,
        }
      : {},
  );
});

/**
 * Route to start Google OAuth login.
 * @name get/google
 * @function
 * @memberof module:routers/auth-router
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

/**
 * OAuth callback route.
 * @name get/google/callback
 * @function
 * @memberof module:routers/auth-router
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    console.log("Authentication success!");
    // Successful authentication
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Redirect to frontend
  },
);

/**
 * Route to log out the user.
 * @name post/logout
 * @function
 * @memberof module:routers/auth-router
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object with a message indicating the logout status.
 */
authRouter.post("/logout", (req, res) => {
  // Destroy the session
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    // Clear the session cookie
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clear the session cookie
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});
