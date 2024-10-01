import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Alternateorgnames {
  alternate_name: string | null;
  alternate_name_id: Generated<number>;
  org_id: number | null;
}

export interface Eventorgs {
  event_id: number;
  org_id: number;
}

export interface Events {
  contributor_id: number;
  date_created: Generated<Timestamp>;
  date_modified: Generated<Timestamp>;
  end_time: Timestamp | null;
  event_description: string | null;
  event_id: Generated<number>;
  event_likes: Generated<number>;
  event_name: string;
  start_time: Timestamp | null;
}

export interface Eventtags {
  event_id: number;
  tag_id: number;
}

export interface Orgs {
  org_description: string | null;
  org_email: string | null;
  org_icon: string | null;
  org_id: Generated<number>;
  org_name: string;
  org_reputation: Generated<number>;
  org_verified: Generated<boolean>;
}

export interface Orgtags {
  org_id: number;
  tag_id: number;
}

export interface Tags {
  tag_id: Generated<number>;
  tag_name: string;
  tag_official: Generated<boolean>;
}

export interface Userorgs {
  org_id: number;
  user_id: number;
}

export interface Users {
  user_email: string;
  user_id: Generated<number>;
  user_mod: Generated<boolean>;
  user_name: string;
}

export interface DB {
  alternateorgnames: Alternateorgnames;
  eventorgs: Eventorgs;
  events: Events;
  eventtags: Eventtags;
  orgs: Orgs;
  orgtags: Orgtags;
  tags: Tags;
  userorgs: Userorgs;
  users: Users;
}