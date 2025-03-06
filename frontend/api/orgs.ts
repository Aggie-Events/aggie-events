import { fetchUtil } from "@/api/fetch";
import { Organization } from "@/config/dbtypes";
import { OrgPageInformation } from "@/config/query-types";
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
* @param {CreateOrgData} org - The organization to create
* @returns {Promise<number>} The created organization ID
*/
export const createOrg = async (org: CreateOrgData) => {
  try {
      const response = await fetchUtil(
          `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
          {
              method: "POST",
              body: org,
          },
      );
      return response.json() ?? null;
  } catch (error) {
      throw new Error("Error creating organization");
  }
};

/**
 * Add an organization
 * @param username - The username of the organization
 * @param email - The email of the organization
 * @returns The response from the fetch
 */
export const addOrganization = async (username: string, email: string) => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
      {
        method: "POST",
        body: { username, email },
      },
    );
    console.log("Organization added successfully", response);
  } catch (error) {
    throw new Error("Error adding Organization");
  }
};

export function useOrgPageInformation(org_name: string) {
  return useQuery<OrgPageInformation | null, Error>({
    queryKey: ["org", org_name],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/${org_name}`,
      );
      const data = await response.json();
      return data ?? null;
    },
    retry: false,
  });
};

/**
 * Deletes all organizations
 * @returns The response from the fetch
 */
export const deleteOrganization = async () => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
      {
        method: "DELETE",
      },
    );
    console.log("Organizations deleted successfully", response);
  } catch (error) {
    throw new Error("Error deleting Organization");
  }
};

/**
 * React Query hook to fetch all organizations
 * @returns {UseQueryResult<OrgPageInformation[], Error>} The organizations
 */
export function useOrganizationList() {
  return useQuery<OrgPageInformation[], Error>({
      queryKey: ["organizations"],
      queryFn: async () => {
          const response = await fetchUtil(
              `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
              {
                  method: "GET",
              },
          );
          return response.json() ?? [];
      },
  });
}
