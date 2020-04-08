CREATE TABLE gj_plants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  sunlight TEXT NOT NULL,
  water INTEGER,
  fertilize INTEGER,
  repot INTEGER,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
