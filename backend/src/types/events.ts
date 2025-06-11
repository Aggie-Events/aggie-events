import { EventStatus } from "./schema";

export interface EventInfo {
  event_id: number;
  event_name: string;
  event_description: string | null;
  event_location: string | null;
  event_img: string | null;

  start_time: Date | null;
  end_time: Date | null;
  event_status: EventStatus;
  date_created: Date;
  date_modified: Date;

  event_saves: number;
  max_capacity: number | null;

  contributor_name: string;
  org_name: string | null;
  org_id: number | null;
  tags: string[];
}
