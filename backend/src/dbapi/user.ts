import { db } from "../database";
import { Users } from "../types/dbtypes";
import { UserStorage } from "../types/customtypes";

interface UserQuery {
  user_email: string;
  user_name: string;
}
export async function getUserById(userId: number) {
  try {
    return await db
      .selectFrom("users")
      .where("user_id", "=", userId)
      .select(["user_email", "user_name"])
      .executeTakeFirstOrThrow();
  } catch (error) {
    throw new Error("Error fetching user!");
  }
}
