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
 * React Query hook to fetch all organizations
 * @returns {UseQueryResult<CreateOrgData[], Error>} The organizations
 */
export function useOrganizations() {
    return useQuery<CreateOrgData[], Error>({
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
 * React Query hook to fetch an organization by ID
 * @param {string} orgId - The ID of the organization to fetch
 * @returns {UseQueryResult<CreateOrgData | null, Error>} The organization
 */
export function useOrganization(orgId: string) {
    return useQuery<CreateOrgData | null, Error>({
        queryKey: ["organization", orgId],
        queryFn: async () => {
            const response = await fetchUtil(
                `${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}`,
                {
                    method: "GET",
                },
            );
            return response.json() ?? null;
        },
        retry: false,
    });
}