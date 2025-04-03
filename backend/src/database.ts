/**
 * Database module for initializing and testing the database connection.
 * @module database
 */

import { DB } from "./types/schema";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

/**
 * Database interface is passed to Kysely's constructor, and from now on, Kysely
 * knows your database structure.
 * Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
 * to communicate with your database.
 */
export const db = new Kysely<DB>({
  dialect,
});

/**
 * Test the database connection by selecting all users.
 * Logs a success message if the connection is successful, otherwise throws an error.
 */
export const waitForDB = () => {
  const attemptConnection = () => {
    db.selectFrom("users")
      .selectAll("users")
      .executeTakeFirst()
      .then(() => {
        console.log("Database connection successful!");
      })
      .catch((error) => {
        console.log(
          "PostgreSQL database is invalid with db string: " +
            process.env.DATABASE_URL,
        );
        console.log("Retrying in 5 seconds...");
        setTimeout(attemptConnection, 5000);
      });
  };

  attemptConnection();
};
