import { db } from "../database";

/**
 * Fetches a user by their user ID.
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<Users>} A promise that resolves to the user object.
 * @throws {Error} If there is an error fetching the user.
 */
export async function getUserById(
  userId: number,
): Promise<{ user_displayname: string; user_email: string }> {
  try {
    // Find the user by their user ID
    const result = await db
      .selectFrom("users")
      .where("user_id", "=", userId)
      .select(["user_email", "user_displayname"])
      .executeTakeFirstOrThrow();
    return result;
  } catch (error) {
    throw new Error("Error fetching user!");
  }
}

