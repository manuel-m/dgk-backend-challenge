CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS ad_users (id uuid PRIMARY KEY, consents TEXT DEFAULT '[]');

CREATE TABLE IF NOT EXISTS ad_events (
  ts timestamp without time zone DEFAULT (NOW() at time zone 'utc'),
  evt_type varchar(24),
  evt TEXT DEFAULT '{}'
);