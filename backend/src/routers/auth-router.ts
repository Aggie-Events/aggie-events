/**
 * Authentication Router module for handling authentication-related routes.
 * @module routers/auth-router
 */

import express from "express";
import passport from "passport";
import { UserStorage } from "../types/user-storage";

export const authRouter = express.Router();

/**
 * @route GET /auth/user
 * @description Get user information
 * @access Public
 * @returns {Object} JSON object containing user information if authenticated, otherwise an empty object.
 */
authRouter.get("/user", async (req, res) => {
  console.log("User:", req.user);
  res.send(req.user ?? {});
});

/**
 * @route GET /auth/google
 * @description Initiate Google OAuth login
 * @access Public
 * @returns {void} Redirects to Google OAuth consent screen
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

/**
 * @route GET /auth/google/callback
 * @description Handle Google OAuth callback
 * @access Public
 * @returns {void} Redirects to auth callback page on success, login page on failure
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
  }),
  (req, res) => {
    console.log("Authentication success!");
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback`);
  },
);

/**
 * @route POST /auth/logout
 * @description Log out the user
 * @returns {Object} JSON object with a message indicating the logout status
 * @returns {Error} 500 error if logout fails
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
