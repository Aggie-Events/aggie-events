/**
 * This file was generated using Kysely (kysely-codegen) and defines Kysely's knowledge of the database schema.
 * DO NOT MODIFY THIS (unless you know what you are doing).
 */

import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type EventStatus = "draft" | "published" | "cancelled";
export type FriendshipStatus = "pending" | "accepted" | "rejected" | "blocked";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "rejected";

export interface Alternateorgnames {
  alternate_name_id: Generated<number>;
  org_id: number | null;
  alternate_name: string | null;
}

export interface Events {
  event_id: Generated<number>;
  contributor_id: number;
  event_name: string;
  event_description: string | null;
  event_likes: Generated<number>;
  event_views: Generated<number>;
  event_location: string | null;
  event_img: string | null;
  event_status: EventStatus;
  start_time: Timestamp;
  end_time: Timestamp;
  date_created: Generated<Timestamp>;
  date_modified: Generated<Timestamp>;
}

export interface Eventorgs {
  event_id: number;
  org_id: number;
}

export interface Eventtags {
  event_id: number;
  tag_id: number;
}

export interface Friendships {
  id: Generated<number>;
  user1_id: number;
  user2_id: number;
  status: FriendshipStatus;
  friendship_type: string | null;
  created_at: Generated<Timestamp>;
}

export interface Orgs {
  org_id: Generated<number>;
  org_name: string;
  org_email: string | null;
  org_description: string | null;
  org_icon: string | null;
  org_verified: Generated<boolean>;
  org_reputation: Generated<number>;
  org_building: string | null;
  org_room: string | null;
}

export interface Orgtags {
  org_id: number;
  tag_id: number;
}

export interface Orgslugs {
  org_id: number;
  slug: string;
}

export interface Reports {
  report_id: Generated<number>;
  reporter_user_id: number | null;
  reported_event_id: number | null;
  reported_org_id: number | null;
  report_reason: string | null;
  report_date: Generated<Timestamp>;
  report_status: ReportStatus;
  admin_notes: string | null;
  resolution_date: Timestamp | null;
}

export interface Savedevents {
  user_id: number;
  event_id: number;
}

export interface Tags {
  tag_id: Generated<number>;
  tag_name: string;
  tag_description: string | null;
  tag_official: Generated<boolean>;
}

export interface Userattendance {
  user_id: number;
  event_id: number;
}

export interface Userlikes {
  user_id: number;
  event_id: number;
}

export interface Userorgs {
  user_id: number;
  org_id: number;
}

export interface Users {
  user_id: Generated<number>;
  user_name: string | null;
  user_displayname: string;
  user_email: string;
  user_verified: Generated<boolean>;
  user_mod: Generated<boolean>;
  user_major: string | null;
  user_year: number | null;
  user_description: string | null;
  user_profile_img: string | null;
}

export interface Usersubs {
  user_id: number;
  org_id: number;
}

export interface DB {
  alternateorgnames: Alternateorgnames;
  events: Events;
  eventorgs: Eventorgs;
  eventtags: Eventtags;
  friendships: Friendships;
  orgs: Orgs;
  orgtags: Orgtags;
  orgslugs: Orgslugs;
  reports: Reports;
  savedevents: Savedevents;
  tags: Tags;
  userattendance: Userattendance;
  userlikes: Userlikes;
  userorgs: Userorgs;
  users: Users;
  usersubs: Usersubs;
}
