/**
 * Organization Router module for handling organization-related API routes.
 * @module routers/api-router/orgs
 */

import { authMiddleware } from "../../middlewares/authMiddleware";
import { db } from "../../database";
import express from "express";
import { OrgInfo, UserOrgInfo } from "../../types/orgs";
import { UserStorage } from "../../types/user-storage";

export const orgRouter = express.Router();

/**
 * @route POST /api/orgs
 * @description Create a new organization
 * @access Private - Requires authentication
 * @param {string} req.body.org_name - The name of the organization.
 * @param {string} req.body.org_email - The email of the organization.
 * @returns {string} A message indicating the organization creation status.
 * @returns {Error} 500 - Server error if organizations cannot be created
 */
orgRouter.post("/", authMiddleware, async (req, res) => {
  const {
    org_name,
    org_email,
    org_description,
    org_icon,
    org_verified,
    org_repuation,
    org_building,
    org_room,
  } = req.body;
  try {
    await db
      .insertInto("orgs")
      .values({
        org_name: org_name,
        org_email: org_email,
        org_description: org_description,
        org_icon: org_icon,
        org_verified: org_verified,
        org_reputation: org_repuation,
        org_building: org_building,
        org_room: org_room,
      })
      .execute();
    res.send("Org created!");
  } catch (error) {
    console.error("Error creating org:", error);
    res.status(500).send("Error creating org!");
  }
});

/**
 * @route GET /api/orgs
 * @description Fetch all organizations
 * @access Public
 * @returns {Object[]} Array of all organizations
 * @returns {Error} 500 - Server error if organizations cannot be fetched
 */
orgRouter.get("/", async (req, res) => {
  try {
    const orgs = await db
      .selectFrom("orgs as o")
      .leftJoin("orgslugs as s", "o.org_id", "s.org_id")
      .select([
        "o.org_id",
        "o.org_name",
        "o.org_email",
        "o.org_description",
        "o.org_icon",
        "o.org_verified",
        "o.org_reputation",
        "o.org_building",
        "o.org_room",
        "s.org_slug",
      ])
      .execute();

    res.json(orgs as OrgInfo[]);
    console.log("Org requested!");
  } catch (error) {
    console.error("Error fetching Orgs:", error);
    res.status(500).send("Error fetching Orgs!");
  }
});

/**
 * @route GET /api/orgs/:org_param
 * @description Fetch an organization by ID or slug
 * @access Public
 * @returns {OrgInfo} The organization object with full info
 * @returns {Error} 404 - Organization not found
 * @returns {Error} 500 - Server error if organization cannot be fetched
 */
orgRouter.get("/:org_param", async (req, res) => {
  try {
    const { org_param } = req.params;
    let org: OrgInfo | null = null;

    if (isNaN(Number(org_param))) {
      // If param is not a number, treat it as a slug (org_name)
      org =
        (await db
          .selectFrom("orgslugs as os")
          .where("os.org_slug", "=", org_param)
          .innerJoin("orgs as o", "os.org_id", "o.org_id")
          .select([
            "o.org_id",
            "o.org_name",
            "o.org_description",
            "o.org_icon",
            "o.org_verified",
            "o.org_reputation",
            "o.org_building",
            "o.org_room",
            "o.org_email",
            "os.org_slug",
          ])
          .executeTakeFirst()) || null;
    } else {
      // If param is a number, treat it as org_id
      org =
        (await db
          .selectFrom("orgs as o")
          .where("o.org_id", "=", Number(org_param))
          .leftJoin("orgslugs as s", "o.org_id", "s.org_id")
          .select([
            "o.org_id",
            "o.org_name",
            "o.org_description",
            "o.org_icon",
            "o.org_verified",
            "o.org_reputation",
            "o.org_building",
            "o.org_room",
            "o.org_email",
            "s.org_slug",
          ])
          .executeTakeFirst()) || null;
    }

    if (!org) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.json(org);
  } catch (error) {
    console.error("Error fetching Organization:", error);
    res.status(500).send("Error fetching Organization!");
  }
});

/**
 * @route DELETE /api/orgs
 * @description Delete all organizations
 * @access Private - Requires authentication
 * @returns {string} Success message
 * @returns {Error} 500 - Server error if organizations cannot be deleted
 */
orgRouter.delete("/", authMiddleware, async (req, res) => {
  try {
    await db.deleteFrom("orgs").execute();
    res.send("Orgs deleted!");
  } catch (error) {
    console.error("Error deleting Orgs:", error);
    res.status(500).send("Error deleting Orgs!");
  }
});

/**
 * @route GET /api/orgs/user/:username
 * @description Fetch all organizations that a user belongs to
 * @access Public
 * @param {string} username - The username of the user
 * @returns {OrgInfo[]} Array of organizations the user belongs to
 * @returns {Error} 500 - Server error if organizations cannot be fetched
 */
orgRouter.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const userOrgs = await db
      .selectFrom("orgs as o")
      .innerJoin("userorgs as uo", "o.org_id", "uo.org_id")
      .innerJoin("users as u", "uo.user_id", "u.user_id")
      .leftJoin("orgslugs as s", "o.org_id", "s.org_id")
      .where("u.user_name", "=", username)
      .select([
        "o.org_id",
        "o.org_name",
        "o.org_email",
        "o.org_description",
        "o.org_icon",
        "o.org_verified",
        "o.org_reputation",
        "o.org_building",
        "o.org_room",
        "s.org_slug",
        "uo.user_role",
      ])
      .execute();

    // Transform the result to match OrgInfo type
    const transformedOrgs = userOrgs.map((org) => ({
      ...org,
      org_slug: org.org_slug || null,
      org_role: org.user_role,
    }));

    res.json(transformedOrgs as UserOrgInfo[]);
  } catch (error) {
    console.error("Error fetching user's organizations:", error);
    res.status(500).send("Error fetching user's organizations!");
  }
});

orgRouter.get("/current/user/", authMiddleware, async (req, res) => {
  console.log("Fetching current user's organizations...");
  try {
    const user = (req.user! as UserStorage).user_name;

    const userOrgs = await db
      .selectFrom("orgs as o")
      .innerJoin("userorgs as uo", "o.org_id", "uo.org_id")
      .innerJoin("users as u", "uo.user_id", "u.user_id")
      .leftJoin("orgslugs as s", "o.org_id", "s.org_id")
      .where("u.user_name", "=", user)
      .select([
        "o.org_id",
        "o.org_name",
        "o.org_email",
        "o.org_description",
        "o.org_icon",
        "o.org_verified",
        "o.org_reputation",
        "o.org_building",
        "o.org_room",
        "s.org_slug",
        "uo.user_role",
      ])
      .execute();

    const transformedOrgs = userOrgs.map((org) => ({
      ...org,
      org_slug: org.org_slug || null,
      org_role: org.user_role,
    }));

    console.log("Transformed Orgs: ", transformedOrgs);

    res.json(transformedOrgs as UserOrgInfo[]);
  } catch (error) {
    console.error("Error fetching user's organizations:", error);
    res.status(500).send("Error fetching user's organizations!");
  }
});

/**
 * @route GET /api/orgs/:org_id/members
 * @description Fetch all members of an organization
 * @access Public
 * @param {number} org_id - The ID of the organization
 * @returns {Object[]} Array of organization members with their roles
 * @returns {Error} 404 - Organization not found
 * @returns {Error} 500 - Server error if members cannot be fetched
 */
orgRouter.get("/:org_id/members", async (req, res) => {
  try {
    const org_id: number = parseInt(req.params.org_id, 10);

    // Check if organization exists
    const org = await db
      .selectFrom("orgs")
      .where("org_id", "=", org_id)
      .select(["org_id"])
      .executeTakeFirst();

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Get all members with their roles
    const members = await db
      .selectFrom("userorgs as uo")
      .where("uo.org_id", "=", org_id)
      .innerJoin("users as u", "uo.user_id", "u.user_id")
      .select([
        "u.user_id",
        "u.user_name",
        "u.user_displayname",
        "u.user_profile_img",
        "u.user_major",
        "u.user_year",
        "uo.user_role",
        "uo.date_created as join_date",
      ])
      .execute();

    res.json(members);
    console.log(`Members for organization ${org_id} requested!`);
  } catch (error) {
    console.error("Error fetching organization members:", error);
    res.status(500).send("Error fetching organization members!");
  }
});
