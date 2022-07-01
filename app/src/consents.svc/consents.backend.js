import { PgBackend } from "../PgBackend.js";

import mservices_net from "../../generated/mservices_net.js";

export async function ConsentsBackend() {
  const { AD_USER, AD_PASSWORD } = process.env;

  const ad_sql = await PgBackend({
    database: AD_USER,
    host: mservices_net.postgresad.host,
    password: AD_PASSWORD,
    port: mservices_net.postgresad.port,
    user: AD_USER,
  });
  return { create, get };

  async function create({ id, consents }) {
    const user = {};

    let err = null;

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
}
