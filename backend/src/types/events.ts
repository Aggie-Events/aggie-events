import { EventStatus } from "./schema";

export interface EventInfo {
    event_id: number; 
    event_name: string; 
    event_description: string | null; 
    event_location: string | null; 
    event_img: string | null;
    event_status: EventStatus;

    event_views: number; 
    event_likes: number;
    event_going: number;

    start_time: Date; 
    end_time: Date; 
    date_created: Date; 
    date_modified: Date; 

    contributor_name: string; 
    org_name: string | null; 
    tags: string[]; 
}