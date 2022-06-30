import postgres from "postgres";

import mservices_net from "../generated/mservices_net";

export function PgPiBackend() {
  const { PI_USER, PI_PASSWORD } = process.env;

  return PgBackend({
    database: PI_USER,
    host: mservices_net.postgrespi.host,
    // host: "postgrespi-deploy-0",
    hooks: {
      async onStart(sql) {
        // CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        await sql`CREATE TABLE IF NOT EXISTS camel_case (a_test INTEGER, b_test TEXT)`;
        // const r = await sql`SELECT uuid_generate_v4()`;
        // console.log(r);
      },
    },
    password: PI_PASSWORD,
    port: mservices_net.postgrespi.port,
    user: PI_USER,
  });
}

function PgBackend({ host, database, hooks, password, port, user }) {
  const sql = postgres(
    `postgres://${user}:${password}@${host}:${port}/${database}`
  );

  if (hooks.onStart) {
    hooks.onStart(sql);
  }
  return { sql };
}
