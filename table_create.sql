CREATE TABLE orgs
(
    org_id          SERIAL PRIMARY KEY,
    org_name        VARCHAR(255)          NOT NULL,
    org_email       VARCHAR(255)          NULL UNIQUE,
    org_description TEXT                  NULL,
    org_icon        VARCHAR(255)          NULL,
    org_verified    BOOLEAN DEFAULT FALSE NOT NULL,
    org_reputation  INT     DEFAULT 0     NOT NULL,

    org_building    VARCHAR(255)          NULL,
    org_room        VARCHAR(255)          NULL
);
CREATE UNIQUE INDEX org_name_unique_upper ON orgs (UPPER(org_name));

CREATE TABLE users
(
    user_id          SERIAL PRIMARY KEY,
    -- user_name is NULL for users who have not assigned their username yet
    user_name        VARCHAR(255)          NULL UNIQUE,
    user_displayname VARCHAR(255)          NOT NULL,
    user_email       VARCHAR(255)          NOT NULL UNIQUE,
    user_verified    BOOLEAN DEFAULT FALSE NOT NULL,
    user_mod         BOOLEAN DEFAULT FALSE NOT NULL,

    user_major       VARCHAR(255)          NULL,
    user_year        INT                   NULL,
    user_description TEXT                  NULL,
    user_profile_img VARCHAR(255)          NULL,
    user_banned      BOOLEAN DEFAULT FALSE NOT NULL
);
ALTER TABLE users
  ADD CONSTRAINT username_length CHECK (length(user_name) >= 3 AND length(user_name) <= 20),
  ADD CONSTRAINT username_no_special_chars CHECK (user_name ~ '^[a-zA-Z0-9]+$'),
  ADD CONSTRAINT username_no_spaces CHECK (user_name NOT LIKE '% %');
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
    contributor_id    INT                                   NOT NULL,
    event_name        VARCHAR(255)                          NOT NULL,
    event_description TEXT                                  NULL,
    event_location    VARCHAR(255),
    event_views       INT         DEFAULT 0                 NOT NULL,

    event_img         VARCHAR(255)                          NULL,

    start_time        TIMESTAMPTZ                           NOT NULL,
    end_time          TIMESTAMPTZ                           NOT NULL,
    date_created      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- If both start_time and end_time are not null, then start_time must be less than end_time
    CHECK (start_time < end_time),
    FOREIGN KEY (contributor_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- This will update the date_modified column to the current time
CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.date_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This will automatically call the update_timestamp() function when events is updated
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON events
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TYPE membership_type AS ENUM (
    -- Any of the below, but can also add/remove other owners and editors, can change organization information
    'owner',
    -- Can add/edit events
    'editor'
    );

-- Stores all user official affiliations
CREATE TABLE userorgs
(
    user_id       INT                                   NOT NULL,
    org_id        INT                                   NOT NULL,
    role          membership_type,
    date_created  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, org_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- This will automatically call the update_timestamp() function when userorgs is updated
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON userorgs
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Stores all of the slugs for each verified organization
CREATE TABLE orgslugs
(
    org_id INT NOT NULL,
    slug VARCHAR(255) NOT NULL,
    PRIMARY KEY (org_id, slug),
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX orgslug_unique_lower ON orgslugs (LOWER(slug));

-- Stores all of the events that a user saves
CREATE TABLE savedevents
(
    user_id      INT                                   NOT NULL,
    event_id     INT                                   NOT NULL,
    date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);


-- Stores event org affiliations
CREATE TABLE eventorgs
(
    event_id INT     NOT NULL,
    org_id   INT     NOT NULL,
    -- Users can still associate events with organizations even if they aren't authorized, but it is considered unofficial
    -- Authorized organization members will still have control over event along with the original poster
    official BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (event_id, org_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);


-- Stores all tags for each event
CREATE TABLE eventtags
(
    event_id INT NOT NULL,
    tag_id   INT NOT NULL,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

-- Stores all tags for each org
CREATE TABLE orgtags
(
    org_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (org_id, tag_id),
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

-- Stores all alternate org names
CREATE TABLE alternateorgnames
(
    alternate_name_id SERIAL PRIMARY KEY,
    org_id            INT          NOT NULL,
    alternate_name    VARCHAR(255) NOT NULL,
    FOREIGN KEY (org_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- Stores what users have liked
CREATE TABLE userlikes
(
    user_id      INT                                   NOT NULL,
    event_id     INT                                   NOT NULL,
    date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

-- Stores where a user has marked that they are attending an event
CREATE TABLE userattendance
(
    user_id      INT                                   NOT NULL,
    event_id     INT                                   NOT NULL,
    date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

-- Stores all user subscriptions
CREATE TABLE usersubs
(
    user_id      INT                                   NOT NULL,
    org_id       INT                                   NOT NULL,
    date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    user1_id     INT                                         NOT NULL,
    user2_id     INT                                         NOT NULL,
    status       friendship_status DEFAULT 'pending', -- Use the enum type here, and set a default
    date_created TIMESTAMPTZ       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES orgs (org_id) ON DELETE CASCADE
);

-- Stores user blocks (blocked user's events won't show up in search
CREATE TABLE blocks
(
    user_id      INT                                   NOT NULL,
    blocked_id   INT                                   NOT NULL,
    date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, blocked_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users (user_id) ON DELETE CASCADE
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
    reporter_user_id  INT                                     NULL,
    reported_event_id INT                                     NULL,
    reported_org_id   INT                                     NULL,
    report_reason     TEXT                                    NOT NULL,

    report_status     report_status DEFAULT 'pending'         NOT NULL,
    admin_notes       TEXT                                    NULL,

    date_created      TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified     TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolution_date   TIMESTAMP                               NULL,

    FOREIGN KEY (reporter_user_id) REFERENCES users (user_id) ON DELETE SET NULL,
    FOREIGN KEY (reported_event_id) REFERENCES events (event_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_org_id) REFERENCES orgs (org_id) ON DELETE CASCADE,
    CHECK (
        reporter_user_id IS NOT NULL OR reported_event_id IS NOT NULL OR reported_org_id IS NOT NULL
        )
);

-- This will automatically call the update_timestamp() function when reports is updated
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON reports
    FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


