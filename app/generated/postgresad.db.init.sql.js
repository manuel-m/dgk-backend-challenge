export default `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS ad_users (id uuid PRIMARY KEY, consents TEXT DEFAULT '[]');
`;