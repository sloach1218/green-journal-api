BEGIN;

TRUNCATE
  gj_users
  RESTART IDENTITY CASCADE;

INSERT INTO gj_users (user_name, password)
VALUES
  ('s_loach', '$2a$12$YPfELLcVbzdJOJcrcvfamOE55aFJM6VmYr3UgYoUG574qbcgsg/uu'),
  ('demo_user', '$2a$12$N2adADytKTjo6Janc/RVDOhj1emCMD/ALp3IY1Odycu6VLhbdU.BC'),
  ('pamela', '$2a$12$JdOOeNPzrO.D88a.8P.JDO9YCHzJjQaKovWCGOiA5u.SRXKU2ToqK');


COMMIT;
