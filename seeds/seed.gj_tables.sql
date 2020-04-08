BEGIN;

TRUNCATE
  gj_plants,
  gj_users
  RESTART IDENTITY CASCADE;

INSERT INTO gj_users (user_name, password)
VALUES
  ('s_loach', '$2a$12$YPfELLcVbzdJOJcrcvfamOE55aFJM6VmYr3UgYoUG574qbcgsg/uu'),
  ('demo_user', '$2a$12$N2adADytKTjo6Janc/RVDOhj1emCMD/ALp3IY1Odycu6VLhbdU.BC'),
  ('pamela', '$2a$12$JdOOeNPzrO.D88a.8P.JDO9YCHzJjQaKovWCGOiA5u.SRXKU2ToqK');

INSERT INTO gj_plants (name, type, description, sunlight, water, fertilize, repot, image, user_id )
VALUES
  ('Brom', 'bromeliad', 'Will produce pups that can be pulled off to grow new plants.', 'bright', 7, 4, 12, 'https://live.staticflickr.com/65535/48245873492_100da3b527_b.jpg', 1),
  ('Peter Parker', 'spider plant', 'Super easy to grow and propagate. Darker color when in the sun more.', 'low', 6, 2, 6, 'https://live.staticflickr.com/65535/48245873492_100da3b527_b.jpg', 2),
  ('Palmy', 'parlor palm', 'Likes humidity.', 'bright', 9, 6, 12, 'https://live.staticflickr.com/65535/48245873492_100da3b527_b.jpg', 3);

COMMIT;