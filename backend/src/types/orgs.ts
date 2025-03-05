export interface OrgInfo {
    org_id: number;
    org_name: string;
    org_description: string | null;
    org_icon: string | null;
    org_verified: boolean;
    org_reputation: number;
    org_building: string | null;
    org_room: string | null;
    org_email: string | null;
}
