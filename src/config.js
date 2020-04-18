module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASEB_URL: process.env.DATABASE_URL || 'postgresql://green-journal@localhost/green-journal',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://green-journal@localhost/green-journal-test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  }