// https://github.com/porsager/postgres

import postgres from "postgres";

export function PgBackend({
  host,
  database,
  init_query,
  password,
  port,
  user,
}) {
  return new Promise(function (resolve) {
    const sql = postgres(
      `postgres://${user}:${password}@${host}:${port}/${database}`
    );

    console.log(database + " db connect");

    _loopConnect().then(function () {
      console.log(database + " db init");

      // [!] trusted
      sql
        .unsafe(init_query)
        .catch(function (err) {
          console.warn(err.message);
        })
        .then(function () {
          resolve(sql);
        });
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
                setTimeout(_loopConnect, 5000);
              }
            });
        }
      });
    }
  });
}
