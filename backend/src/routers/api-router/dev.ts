import { Router } from "express";
import { db } from "../../database";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const devRouter = Router();

// Clear database function
async function clearDatabase() {
  // Delete in correct order to respect foreign key constraints
  await db.deleteFrom("eventtags").execute();
  await db.deleteFrom("orgtags").execute();
  await db.deleteFrom("eventorgs").execute();
  await db.deleteFrom("savedevents").execute();
  await db.deleteFrom("userlikes").execute();
  await db.deleteFrom("userattendance").execute();
  await db.deleteFrom("usersubs").execute();
  await db.deleteFrom("userorgs").execute();
  await db.deleteFrom("alternateorgnames").execute();
  await db.deleteFrom("reports").execute();
  await db.deleteFrom("events").execute();
  await db.deleteFrom("orgs").execute();
  await db.deleteFrom("tags").execute();
}

// Clear database endpoint
devRouter.post("/clear", authMiddleware, async (req, res) => {
  try {
    await clearDatabase();
    res.json({ message: "Database cleared successfully (excluding users)" });
  } catch (error) {
    console.error("Error clearing database:", error);
    res.status(500).json({ error: "Failed to clear database" });
  }
});

devRouter.post("/populate", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // First, create sample tags
    const sampleTags = [
      // Event Types
      {
        tag_name: "Workshop",
        tag_description: "Hands-on learning sessions",
        tag_official: true,
      },
      {
        tag_name: "Career Fair",
        tag_description: "Professional networking and job opportunities",
        tag_official: true,
      },
      {
        tag_name: "Social",
        tag_description: "Social gatherings and meetups",
        tag_official: true,
      },
      {
        tag_name: "Academic",
        tag_description: "Academic-focused events",
        tag_official: true,
      },
      {
        tag_name: "Sports",
        tag_description: "Athletic events and activities",
        tag_official: true,
      },
      {
        tag_name: "Free Food",
        tag_description: "Events with complimentary food",
        tag_official: true,
      },
      {
        tag_name: "Performance",
        tag_description: "Live performances and shows",
        tag_official: true,
      },
      {
        tag_name: "Seminar",
        tag_description: "Educational presentations",
        tag_official: true,
      },

      // Academic Areas
      {
        tag_name: "Engineering",
        tag_description: "Engineering-related events",
        tag_official: true,
      },
      {
        tag_name: "Business",
        tag_description: "Business-focused events",
        tag_official: true,
      },
      {
        tag_name: "Arts",
        tag_description: "Arts and creative events",
        tag_official: true,
      },
      {
        tag_name: "Science",
        tag_description: "Science-related events",
        tag_official: true,
      },
    ];

    // Insert tags
    for (const tag of sampleTags) {
      await db.insertInto("tags").values(tag).execute();
    }

    // Create sample organizations
    const sampleOrgs = [
      {
        org_name: "Engineering Student Council",
        org_email: "esc@tamu.edu",
        org_description: "The voice of engineering students at TAMU",
        org_building: "ZACH",
        org_room: "401",
        org_verified: true,
      },
      {
        org_name: "MSC Town Hall",
        org_email: "townhall@tamu.edu",
        org_description: "Bringing entertainment to campus",
        org_building: "MSC",
        org_room: "2406",
        org_verified: true,
      },
      {
        org_name: "TAMU Computing Society",
        org_email: "tacs@tamu.edu",
        org_description: "Computing enthusiasts unite",
        org_building: "PETR",
        org_room: "207",
        org_verified: true,
      },
    ];

    // Insert organizations
    for (const org of sampleOrgs) {
      await db.insertInto("orgs").values(org).execute();
    }

    // Create sample events
    const now = new Date();
    const sampleEvents = [
      // Career Events
      {
        contributor_id: user_id,
        event_name: "Engineering Career Fair",
        event_description:
          "Fall 2024 Engineering Career Fair - Meet top employers in engineering fields",
        event_location: "Reed Arena",
        start_time: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
        ),
      },
      {
        contributor_id: user_id,
        event_name: "Business Career Fair",
        event_description:
          "Connect with leading companies in business, finance, and consulting",
        event_location: "MSC Bethancourt Ballroom",
        start_time: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
        ),
      },

      // Workshops
      {
        contributor_id: user_id,
        event_name: "Python Programming Workshop",
        event_description:
          "Learn the basics of Python programming with hands-on exercises",
        event_location: "ZACH 310",
        start_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
        ),
      },
      {
        contributor_id: user_id,
        event_name: "Resume Writing Workshop",
        event_description:
          "Learn how to craft an effective resume with industry experts",
        event_location: "MSC 2406",
        start_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 5 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000,
        ),
      },

      // Social Events
      {
        contributor_id: user_id,
        event_name: "Movie Night: Inception",
        event_description: "Watch Inception with free pizza and drinks",
        event_location: "MSC 2406",
        start_time: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
        ),
      },
      {
        contributor_id: user_id,
        event_name: "Game Night",
        event_description: "Join us for board games, video games, and snacks",
        event_location: "Commons",
        start_time: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 4 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
        ),
      },

      // Academic Events
      {
        contributor_id: user_id,
        event_name: "Research Symposium",
        event_description:
          "Annual research showcase featuring student projects",
        event_location: "MSC Bethancourt Ballroom",
        start_time: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 10 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
        ),
      },
      {
        contributor_id: user_id,
        event_name: "Guest Lecture: AI Ethics",
        event_description:
          "Distinguished lecture on ethical considerations in AI development",
        event_location: "ZACH 350",
        start_time: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 6 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000,
        ),
      },

      // Sports Events
      {
        contributor_id: user_id,
        event_name: "Intramural Soccer Tournament",
        event_description: "Annual soccer tournament open to all skill levels",
        event_location: "Penberthy Fields",
        start_time: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 8 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
        ),
      },
      {
        contributor_id: user_id,
        event_name: "Basketball Tournament",
        event_description: "3v3 basketball tournament with prizes",
        event_location: "Student Rec Center",
        start_time: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 9 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
        ),
      },

      // Performance Events
      {
        contributor_id: user_id,
        event_name: "Spring Concert",
        event_description: "Annual spring concert featuring student performers",
        event_location: "Rudder Auditorium",
        start_time: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
        ),
      },
      {
        contributor_id: user_id,
        event_name: "Theater Performance",
        event_description:
          'Student theater production of "A Midsummer Night\'s Dream"',
        event_location: "Rudder Theater",
        start_time: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        end_time: new Date(
          now.getTime() + 12 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000,
        ),
      },
    ];

    // Insert events and their tags
    for (const event of sampleEvents) {
      const insertedEvent = await db
        .insertInto("events")
        .values(event)
        .returningAll()
        .executeTakeFirst();

      if (!insertedEvent) continue;

      // Add relevant tags to each event
      if (event.event_name.includes("Career Fair")) {
        await addEventTags(insertedEvent.event_id, [
          "Career Fair",
          event.event_name.includes("Engineering") ? "Engineering" : "Business",
        ]);
      } else if (event.event_name.includes("Workshop")) {
        await addEventTags(insertedEvent.event_id, [
          "Workshop",
          event.event_name.includes("Python") ? "Engineering" : "Academic",
        ]);
      } else if (
        event.event_name.includes("Movie") ||
        event.event_name.includes("Game")
      ) {
        await addEventTags(insertedEvent.event_id, ["Social", "Free Food"]);
      } else if (
        event.event_name.includes("Research") ||
        event.event_name.includes("Lecture")
      ) {
        await addEventTags(insertedEvent.event_id, ["Academic", "Seminar"]);
      } else if (event.event_name.includes("Tournament")) {
        await addEventTags(insertedEvent.event_id, ["Sports"]);
      } else if (
        event.event_name.includes("Concert") ||
        event.event_name.includes("Theater")
      ) {
        await addEventTags(insertedEvent.event_id, ["Performance", "Arts"]);
      }
    }

    res.json({ message: "Sample data populated successfully" });
  } catch (error) {
    console.error("Error populating sample data:", error);
    res.status(500).json({ error: "Failed to populate sample data" });
  }
});

async function addEventTags(eventId: number, tagNames: string[]) {
  // Get tag IDs
  const tags = await db
    .selectFrom("tags")
    .select(["tag_id"])
    .where("tag_name", "in", tagNames)
    .execute();

  // Add tags to event
  for (const tag of tags) {
    await db
      .insertInto("eventtags")
      .values({
        event_id: eventId,
        tag_id: tag.tag_id,
      })
      .execute();
  }
}
