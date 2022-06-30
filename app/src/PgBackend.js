import postgres from "postgres";

import mservices_net from "../generated/mservices_net";

export function PgPiBackend() {
  const { PI_USER, PI_PASSWORD } = process.env;

  return PgBackend({
    database: PI_USER,
    host: mservices_net.postgrespi.host,
    hooks: {
      onStart(sql) {
        console.log("pi:onstart");
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
