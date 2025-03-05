import { fetchUtil } from "@/api/fetch";
import { Organization } from "@/config/dbtypes";
import { OrgPageInformation } from "@/config/query-types";
import { useQuery } from "@tanstack/react-query";

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

export const useOrgPageInformation = async (org_name: string) => {
  return useQuery<OrgPageInformation | null, Error>({
    queryKey: ["org", org_name],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/${org_name}`,
      );
      return response.json() ?? null;
    },
    retry: false,
  });
};

/**
 * Fetch all organizations
 * @returns List of organizations
 */
export const fetchOrganization = async (): Promise<Organization[]> => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/orgs`,
      {
        method: "GET",
      },
    );
    return response.json() ?? [];
  } catch (error) {
    throw new Error("Error fetching Organization");
  }
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
