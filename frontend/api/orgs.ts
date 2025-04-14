import { fetchUtil } from "@/api/fetch";
import { useAuth } from "@/components/auth/AuthContext";
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

export interface OrgMember {
  user_id: number;
  user_name: string;
  user_displayname: string;
  user_profile_img: string | null;
  user_major: string | null;
  user_year: number | null;
  user_role: "owner" | "editor";
  join_date: string;
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
}

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
    queryKey: ["organizations", { user: username }],
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

/**
 * React Query hook to fetch the current user's organizations
 * @returns {UseQueryResult<UserOrgInfo[], Error>} The current user's organizations
 */
export function useCurrentUserOrgs() {
  return useQuery<UserOrgInfo[], Error>({
    queryKey: ["organizations", { user: "current" }],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/current/user/`,
        {
          method: "GET",
        },
      );
      return response.json() ?? [];
    },
  });
}

/**
 * React Query hook to fetch members of an organization
 * @param {number} orgId - The ID of the organization
 * @returns {UseQueryResult<OrgMember[], Error>} The organization members
 */
export function useOrgMembers(orgId: number) {
  return useQuery<OrgMember[], Error>({
    queryKey: ["organizations", orgId, "members"],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/members`,
        {
          method: "GET",
        },
      );

      // Parse dates
      const members = await response.json();
      return members.map((member: any) => ({
        ...member,
        join_date: new Date(member.join_date),
      }));
    },
    enabled: !!orgId,
  });
}
