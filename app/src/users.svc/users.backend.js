import { PgBackend } from "../PgBackend.js";

import mservices_net from "../../generated/mservices_net.js";

import ad_init_query from "../../generated/postgresad.db.init.sql";
import pi_init_query from "../../generated/postgrespi.db.init.sql";

export async function UsersBackend() {
  const { AD_USER, AD_PASSWORD, PI_USER, PI_PASSWORD } = process.env;

  const pi_sql = await PgBackend({
    database: PI_USER,
    host: mservices_net.postgrespi.host,
    init_query: pi_init_query,
    password: PI_PASSWORD,
    port: mservices_net.postgrespi.port,
    user: PI_USER,
  });

  const ad_sql = await PgBackend({
    database: AD_USER,
    host: mservices_net.postgresad.host,
    init_query: ad_init_query,
    password: AD_PASSWORD,
    port: mservices_net.postgresad.port,
    user: AD_USER,
  });
  return { ad_sql, pi_sql, create, get, remove };

  async function create({ id, email }) {
    const user = {};

    let err = null;

    await pi_sql`
INSERT INTO pi_users (id, email) 
  VALUES (${id}, ${email}) 
  RETURNING id, email
`
      .then(function ([data]) {
        Object.assign(user, {
          id: data.id,
          email: data.email,
        });
      })
      .catch(onError);

    if (err !== null) {
      return [err];
    }

    await ad_sql`
INSERT INTO ad_users (id) 
  VALUES (${id}) 
  RETURNING id, consents
`
      .then(function ([data]) {
        user.consents = JSON.parse(data.consents);
      })
      .catch(onError);

    return [err, user];

    function onError(error) {
      err = error.message;
    }
  }
  async function get({ id }) {
    const user = {};

    let err = null;

    await pi_sql`
SELECT id, email FROM pi_users 
  WHERE id = ${id}
`
      .then(function ([data]) {
        Object.assign(user, {
          id: data.id,
          email: data.email,
        });
      })
      .catch(onError);

    if (err !== null) {
      return [err];
    }

    await ad_sql`
SELECT consents FROM ad_users
  WHERE id = ${id}
`
      .then(function ([data]) {
        user.consents = JSON.parse(data.consents);
      })
      .catch(onError);

    return [err, user];

    function onError(error) {
      err = error.message;
    }
  }

  async function remove({ id }) {
    let err = null;

    await pi_sql`DELETE from pi_users WHERE id = ${id} RETURNING *`
      .then(function (data) {
        if (data.length !== 1) {
          err = "user remove: no user with id " + id;
        }
      })
      .catch(function (error) {
        err = error.message;
      });

    return [err];
  }
}
