import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { apiRouter } from "./routers/apiRouter";
import { authRouter } from "./routers/authRouter";
import { db } from "./database";
import MemoryStore from "memorystore";
import cors from "cors";

const init = async () => {
  const app = express();

  app.use(express.json());
  const corsOptions = {
    origin: `${process.env.FRONTEND_URL}`, // Allow requests from your frontend's origin
    credentials: true, // Allow credentials (cookies, session data)
  };

  app.use(cors(corsOptions));

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // trust first proxy
  }

  app.use(
    session({
      secret: process.env.BACKEND_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "lax", // Or 'strict', depending on your use case
      },
      store: new (MemoryStore(session))({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    }),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`, // Adjust as needed
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log('Google profile:', profile)
        if (!profile.emails || !profile.emails[0].value) {
          console.error("No email found in Google profile");
          return done(null, false);
        }

        const user_email = profile.emails[0].value;
        await db
          .selectFrom("users")
          .select("user_email")
          .where("user_email", "=", user_email)
          .execute()
          .then((result) => {
            // TODO: Add check for organization
            // If the user is not in the database, add them
            if (result.length === 0) {
              db.insertInto("users")
                .values({
                  user_email: user_email,
                  user_name: profile.displayName,
                })
                .execute()
                .catch((error) => {
                  console.error("Error inserting user:", error);
                  return done(error, false);
                });
            }

            console.log("User:", user_email);

            return done(null, {
              user_email: user_email,
              user_name: profile.displayName,
              picture: profile.photos ? profile.photos[0].value : "",
            });
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
            return done(error, false);
          });
      },
    ),
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user: { [key: string]: never }, done) {
    done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", apiRouter);
  app.use("/auth", authRouter);
  return app;
};

export { init };
