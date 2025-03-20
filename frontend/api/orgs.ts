import { fetchUtil } from "@/api/fetch";
import { OrgPageInformation } from "@/config/query-types";
import { useQuery } from "@tanstack/react-query";

export interface CreateOrgData {
  org_name: string;
  org_email: string | null;
  org_description: string | null;
  org_icon: string;
  org_verified: boolean;
  org_reputation: number;
  org_building: string | null;
  org_room: string | null;
}

export interface UserOrgInfo {
  org_id: number;
  org_name: string;
  org_description: string | null;
  org_icon: string | null;
  org_verified: boolean;
  org_reputation: number;
  org_building: string | null;
  org_room: string | null;
  org_email: string | null;
  org_slug: string | null;
  org_role: string;
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

/**
 * React Query hook to fetch organizations for a specific user
 * @param {string} username - The username of the user
 * @returns {UseQueryResult<UserOrgInfo[], Error>} The user's organizations
 */
export function useUserOrgs(username: string) {
  return useQuery<UserOrgInfo[], Error>({
    queryKey: ['organizations', { 'user': username }],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/user/${username}`,
        {
          method: "GET",
        },
      );
      return response.json() ?? [];
    },
    enabled: !!username, // Only run the query if username is provided
  });
}
