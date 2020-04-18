CREATE TABLE gj_logs (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    image TEXT,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    plant_id INTEGER
        REFERENCES gj_plants(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES gj_users(id) ON DELETE CASCADE NOT NULL
);
