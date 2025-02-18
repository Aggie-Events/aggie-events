export interface Event {
  event_id: number;
  contributer_id: number;
  event_name: string;
  event_description: string;
  event_img: string | null;
  event_likes: number;
  start_time: Date;
  end_time: Date;
  event_location: string | null;
  date_created: Date;
  date_modified: Date;
}

export interface Organization {
  org_description: string | null;
  org_email: string | null;
  org_icon: string | null;
  org_id: number;
  org_name: string;
  org_reputation: number;
  org_verified: boolean;
}
