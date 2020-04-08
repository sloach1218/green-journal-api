CREATE TABLE gj_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE gj_plants
  ADD COLUMN
    user_id INTEGER REFERENCES gj_users(id)
    ON DELETE SET NULL;
