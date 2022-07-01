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
  return { create };

  async function create(evt) {
    let err = null;
    let consents = [];

    // push event
    const evt_json = JSON.stringify(evt);

    await ad_sql`
INSERT INTO ad_events
  (evt_type, evt) 
  VALUES ('consent', ${evt_json})`.catch(onError);

    // get current consent state
    await ad_sql`
SELECT consents FROM ad_users 
  WHERE id = ${evt.user.id}`
      .then(function mergeConsents([data]) {
        consents = JSON.parse(data.consents);

        // merge consents
        evt.consents.reduce(function (acc, new_consent) {
          const found = acc.find((o) => o.id === new_consent.id);
          if (found) {
            found.enabled = new_consent;
          } else {
            acc.push(new_consent);
          }
          return acc;
        }, consents);
      })
      .catch(onError);

    if (err !== null) {
      return [err];
    }

    // update consents
    await ad_sql`
UPDATE ad_users
  SET consents = ${JSON.stringify(consents)}
  WHERE id = ${evt.user.id}
    `.catch(onError);

    return [err];

    function onError(error) {
      err = error.message;
    }
  }
}
