/**
 * Organization Router module for handling organization-related API routes.
 * @module routers/api-router/orgs
 */

import { authMiddleware } from "../../middlewares/authMiddleware";
import { db } from "../../database";
import express from "express";
import { OrgInfo } from "../../types/orgs";

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
        "s.slug as org_slug"
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
      org = await db
        .selectFrom("orgslugs")
        .where("slug", "=", org_param)
        .innerJoin("orgs as o", "orgslugs.org_id", "o.org_id")
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
          "orgslugs.slug as org_slug"
        ])
        .executeTakeFirst() || null;
    } else {
      // If param is a number, treat it as org_id
      org = await db
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
          "s.slug as org_slug"
        ])
        .executeTakeFirst() || null;
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
