import { PgBackend } from "./PgBackend";

export function PgPiBackend() {
  return PgBackend({
    database: PI_USER,
    host: mservices_net.postgrespi.host,
    hooks: {
      onsStart(sql) {
        console.log(sql);
      },
    },
    password: PI_PASSWORD,
    port: mservices_net.postgrespi.port,
    user: PI_USER,
  });
}
