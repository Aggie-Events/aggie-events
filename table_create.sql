CREATE TABLE orgs
(
    org_id          SERIAL PRIMARY KEY,
    org_name        VARCHAR(255)          NOT NULL UNIQUE,
    org_email       VARCHAR(255)          NULL UNIQUE,
    org_description TEXT                  NULL,
    org_icon        VARCHAR(255)          NULL,
    org_verified    BOOLEAN DEFAULT FALSE NOT NULL,
    org_reputation  INT     DEFAULT 0     NOT NULL,

    org_building    VARCHAR(255)          NULL,
    org_room        VARCHAR(255)          NULL
);

CREATE TABLE users
(
    user_id          SERIAL PRIMARY KEY,
    user_name        VARCHAR(255)          NOT NULL,
    user_displayname VARCHAR(255)          NOT NULL,
    user_email       VARCHAR(255)          NOT NULL UNIQUE,
    user_mod         BOOLEAN DEFAULT FALSE NOT NULL,

    user_major       VARCHAR(255)          NULL,
    user_year        INT                   NULL,
    user_description TEXT                  NULL,
    user_profile_img VARCHAR(255)          NULL
);

CREATE TABLE tags
(
    tag_id          SERIAL PRIMARY KEY,
    tag_name        VARCHAR(255)          NOT NULL,
    tag_description TEXT                  NULL,
    tag_official    BOOLEAN DEFAULT FALSE NOT NULL
);
CREATE UNIQUE INDEX tag_name_unique_lower ON tags (LOWER(tag_name));

CREATE TYPE event_status AS ENUM (
    'draft',
    'published',
    'cancelled'
);

CREATE TABLE events
(
    event_id          SERIAL PRIMARY KEY,
    contributor_id    INT                                 NOT NULL,
    event_name        VARCHAR(255)                        NOT NULL,
    event_description TEXT                                NULL,
    event_likes       INT       DEFAULT 0                 NOT NULL,
    event_views       INT       DEFAULT 0                 NOT NULL,
    event_location    VARCHAR(255),
    event_img         VARCHAR(255)                        NULL,

    start_time        TIMESTAMP                           NOT NULL,
    end_time          TIMESTAMP                           NOT NULL,
    date_created      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- If both start_time and end_time are not null, then start_time must be less than end_time
    CHECK (start_time < end_time),
    FOREIGN KEY (contributor_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.date_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON events
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Stores all user offical affiliations
CREATE TABLE userorgs
(
    user_id INT,
    org_id  INT,
    PRIMARY KEY (user_id, org_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- Stores all of the events that a user saves
CREATE TABLE savedevents
(
    user_id  INT,
    event_id INT,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

-- Stores event org affiliations
CREATE TABLE eventorgs
(
    event_id INT,
    org_id   INT,
    PRIMARY KEY (event_id, org_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- Stores all tags for each event
CREATE TABLE eventtags
(
    event_id INT,
    tag_id   INT,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

-- Stores all tags for each org
CREATE TABLE orgtags
(
    org_id INT,
    tag_id INT,
    PRIMARY KEY (org_id, tag_id),
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

-- Stores all alternate org names
CREATE TABLE alternateorgnames
(
    alternate_name_id SERIAL PRIMARY KEY,
    org_id            INT,
    alternate_name    VARCHAR(255),
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- Stores what users have liked
CREATE TABLE userlikes
(
    user_id  INT,
    event_id INT,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

-- Stores where a user has marked that they are attending an event
CREATE TABLE userattendance
(
    user_id  INT,
    event_id INT,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

-- Stores all user subscriptions
CREATE TABLE usersubs
(
    user_id INT,
    org_id  INT,
    PRIMARY KEY (user_id, org_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- Create the enum type first
CREATE TYPE friendship_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'blocked'
    );

-- Create the friendships table
CREATE TABLE friendships
(
    id              SERIAL PRIMARY KEY,
    user1_id        INTEGER REFERENCES users (user_id),
    user2_id        INTEGER REFERENCES users (user_id),
    status          friendship_status        DEFAULT 'pending', -- Use the enum type here, and set a default
    friendship_type VARCHAR(50),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user1_id, user2_id)
);

CREATE TYPE report_status AS ENUM (
    'pending',
    'reviewed',
    'resolved',
    'rejected'
);

-- Reports table
CREATE TABLE reports
(
    report_id         SERIAL PRIMARY KEY,
    reporter_user_id  INT                                   REFERENCES users (user_id) ON DELETE SET NULL,
    reported_event_id INT                                   NULL REFERENCES events (event_id) ON DELETE CASCADE,
    reported_org_id   INT                                   NULL REFERENCES orgs (org_id) ON DELETE CASCADE,
    report_reason     TEXT                                  NULL,
    report_date       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    report_status     report_status DEFAULT 'pending'       NOT NULL,
    admin_notes       TEXT                                  NULL,
    resolution_date   TIMESTAMP                             NULL
);


