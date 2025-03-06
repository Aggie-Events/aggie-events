import { fetchUtil } from "@/api/fetch";
import { Organization } from "@/config/dbtypes";
import { useQuery } from "@tanstack/react-query";
// Add this interface to match the API expectations
export interface CreateOrgData {
    // org_id          SERIAL PRIMARY KEY,
    // org_name        VARCHAR(255)          NOT NULL,
    // org_email       VARCHAR(255)          NULL UNIQUE,
    // org_description TEXT                  NULL,
    // org_icon        VARCHAR(255)          NULL,
    // org_verified    BOOLEAN DEFAULT FALSE NOT NULL,
    // org_reputation  INT     DEFAULT 0     NOT NULL,

    // org_building    VARCHAR(255)          NULL,
    // org_room        VARCHAR(255)          NULL
    org_name: string;
    org_email: string | null;
    org_description: string | null;
    org_icon: string;
    org_verified: boolean;
    org_reputation: number;
    org_building: string | null;
    org_room: string | null;
  }
/**
 * Create an organization
 * @param {Organization} org - The event to create
 * @returns {Promise<number>} The created event ID
 */
export const createOrg = async (org: CreateOrgData) => {
    try {
      console.log("Formatted org: ", org);
  
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
        {
          method: "POST",
          body: org,
        },
      );
      return response.json() ?? null;
    } catch (error) {
      throw new Error("Error creating event");
    }
  };
  export const getAllOrg = async () => {
    try {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
        {
          method: "GET"
        },
      );
      // Wait for the response to be parsed into JSON
      const orgs = await response.json();
      return orgs; // Return the parsed JSON data (array or object)
    } catch (error) {
      throw new Error("Error getting organizations");
    }
  };