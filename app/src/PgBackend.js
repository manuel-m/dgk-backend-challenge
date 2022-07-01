// https://github.com/porsager/postgres

import postgres from "postgres";

import mservices_net from "../generated/mservices_net";

export function PgPiBackend({ init_query }) {
  const { PI_USER, PI_PASSWORD } = process.env;

  return PgBackend({
    database: PI_USER,
    host: mservices_net.postgrespi.host,
    hooks: {
      onConnected(sql) {
        // [!] trusted
        return sql.unsafe(init_query).catch(function (err) {
          console.warn(err.message);
        });
      },
    },
    password: PI_PASSWORD,
    port: mservices_net.postgrespi.port,
    user: PI_USER,
  });
}

function PgBackend({ host, database, hooks, password, port, user }) {
  return new Promise(function (resolve) {
    const sql = postgres(
      `postgres://${user}:${password}@${host}:${port}/${database}`
    );

    _loopConnect().then(function () {
      console.log(database + " db connecting...");
      if (hooks.onConnected) {
        hooks.onConnected(sql).then(function () {
          console.log(database + " db connected");
          resolve(sql);
        });
      } else {
        resolve(sql);
      }
    });

    async function _loopConnect() {
      return new Promise(function (resolve) {
        _loopConnect();
        function _loopConnect() {
          let error_flag = false;
          sql`SELECT 1`
            .catch(function (err) {
              console.warn(err.message);
              error_flag = true;
            })
            .then(function () {
              if (error_flag === false) {
                resolve();
              } else {
                error_flag = false;
                setTimeout(_loopConnect, 2000);
              }
            });
        }
      });
    }
  });
}
