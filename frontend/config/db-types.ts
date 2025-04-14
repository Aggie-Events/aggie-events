export interface Event {
  event_id: number;
  contributor_id: number;
  org_id?: number;
  org_name?: string;
  contributor_name: string;
  event_name: string;
  event_description: string;
  event_location: string | null;
  event_img: string | null;
  event_likes: number;
  start_time: Date;
  end_time: Date;
  date_created: Date;
  date_modified: Date;
  tags: string[];
}

export interface Organization {
  org_name: string;
  org_email: string | null;
  org_description: string;
  org_icon: string;
  org_verified: boolean;
  org_reputation: number;
  org_building: string | null;
  org_room: string | null;
}
