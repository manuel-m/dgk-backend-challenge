export default `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS pi_users (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT DEFAULT ''
);
`;