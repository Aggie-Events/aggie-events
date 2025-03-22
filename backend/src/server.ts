/**
 * Server initialization module for setting up and starting the Express server.
 * @module server
 */

import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { apiRouter } from "./routers/api-router";
import { authRouter } from "./routers/auth-router";
import { db } from "./database";
import MemoryStore from "memorystore";
import cors from "cors";
import { UserStorage } from "./types/user-storage";
import { getUserById } from "./db-functions/user";
import { limiter } from "./utils/rate-limiter";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { OAuth2Client } from "google-auth-library";


export const mobileClient = new OAuth2Client(process.env.MOBILE_CLIENT_ID);

// ONLY FOR MOBILE
export async function verifyGoogleToken(token: string) {
  const ticket = await mobileClient.verifyIdToken({
    idToken: token,
    audience: process.env.MOBILE_CLIENT_ID,
  });
  return ticket.getPayload();
}

/**
 * Initializes the Express server, sets up middleware, and configures authentication.
 * @returns {Promise<express.Application>} A promise that resolves to the initialized Express application.
 * @throws {Error} If the DATABASE_URL environment variable is not set.
 */
const init = async (): Promise<express.Application> => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Did you forget to set a .env file?",
    );
  }

  const app = express();

  app.use(limiter);

  app.use(express.json()); // Use JSON body parser middleware

  app.use(
    cors({
      origin: `${process.env.FRONTEND_URL}`, // Allow requests from frontend origin
      credentials: true, // Allow credentials (cookies, session data)
    }),
  );

  // This is needed for requests to and from the backend to go through our reverse proxy (and maybe cloudflare as well)
  if (process.env.NODE_ENV === "production") {
    // TODO: We should specify exactly how many proxy layers
    app.set("trust proxy", true); // trust first proxy
  }

  app.use(
    session({
      secret: process.env.BACKEND_SECRET!, // This is a secret key used to sign the session ID cookie
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        // TODO: Check if we can set this to strict in production
        sameSite: "lax", // Or 'strict', depending on your use case
      },
      // Determines how user sessions are stored.
      store: new (MemoryStore(session))({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    }),
  );


  // TODO FOR MOBILE:
  // 1. pull from main. gonna be lots of conflicts and pain
  // 2. make new google strategy for mobile (use AI)
  // 3. profit
  // Configure Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`, // Adjust as needed
      },

      // Runs when the user is authenticated using Google OAuth
      // First gets the email from Google profile, then checks if the user is in the database
      async (accessToken, refreshToken, profile, done) => {
        // If the user's email isn't attached to their Google profile, there's something seriously wrong.
        if (!profile.emails || !profile.emails[0].value) {
          console.error("No email found in Google profile");
          return done(null, false);
        }

        // TODO: Somehow a google account can have multiple emails. I'm just assuming the first one is the correct one, but I have no clue how that works.
        const user_email = profile.emails[0].value;

        await db
          .selectFrom("users")
          .select(["user_email", "user_id", "user_name"])
          .where("user_email", "=", user_email)
          .executeTakeFirst()
          .then(async (result) => {
            // TODO: Add check to see if the user is in TAMU organization

            // Get the user ID from the database
            // If the user doesn't exist, add them to the database
            const user_id = await (async (): Promise<number> => {
              if (result == null) {
                // Add user to database and return the new user ID
                const { user_id: userId } = await db
                  .insertInto("users")
                  .values({
                    user_email: user_email,
                    user_displayname: profile.displayName,
                  })
                  .returning("user_id")
                  .executeTakeFirstOrThrow();
                return userId;
              } else {
                // Return the existing user ID
                return result.user_id;
              }
            })();

            return done(null, {
              user_email: user_email,
              user_name: result?.user_name ?? null,
              user_displayname: profile.displayName,
              user_img: profile.photos ? profile.photos[0].value : "",
              user_id: user_id,
            } as UserStorage);
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
            return done(error, false);
          });
      },
    ),
  );

  // Determines what user data should be persisted in the session
  passport.serializeUser((user: UserStorage, done) => {
    done(null, { user_id: user.user_id, user_img: user.user_img });
  });

  // Retrieves user data from the session
  // Accessed by req.user in route handlers
  passport.deserializeUser(({ user_id: user_id, user_img: user_img }, done) => {
    getUserById(user_id).then(({ user_name, user_displayname, user_email }) => {
      done(null, {
        user_id,
        user_email: user_email,
        user_name: user_name,
        user_displayname: user_displayname,
        user_img: user_img,
      });
    });
  });

  // Return "https" URLs by setting secure: true
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV === "production"
  });

  // // Log the configuration
  // console.log(cloudinary.config());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", apiRouter);
  app.use("/auth", authRouter);
  return app;
};

export { init };
