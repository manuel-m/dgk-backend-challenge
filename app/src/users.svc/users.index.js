import { RestApp } from "../RestApp.js";
import { PgBackend } from "../PgBackend.js";

import mservices_net from "../../generated/mservices_net.js";

import { usersSchemas } from "../../schemas/json/users.schemas.js";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import ad_init_query from "../../generated/postgresad.db.init.sql";
import pi_init_query from "../../generated/postgrespi.db.init.sql";

const ajv = new Ajv();
addFormats(ajv);

const mservice_id = "users";
const { port } = mservices_net[mservice_id];

const validate = {
  POST_users: {
    req: {
      body: ajv.compile(usersSchemas.POST_users.req.body),
    },
  },
};

_main();

async function _main() {
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

  RestApp({
    mservice_id,
    port,
    routes: [
      ["/users", "get", GET_users],
      ["/users", "post", POST_users],
      ["/users", "delete", DELETE_users],
    ],
  });

  async function POST_users(req, res) {
    if (validate.POST_users.req.body(req.body) === false) {
      return res.status(422).end();
    }
    const { id, email, phone } = Object.assign({ phone: "" }, req.body);
    let err_code = 0;

    const [pi_user] =
      await pi_sql`INSERT INTO pi_users (id, email, phone) values (${id}, ${email}, ${phone}) RETURNING id, email`.catch(
        onError
      );

    if (err_code !== 0) {
      return res.status(422).end();
    }

    const [ad_user] =
      await ad_sql`INSERT INTO ad_users (id) values (${id}) RETURNING id, consents`.catch(
        onError
      );

    if (err_code !== 0) {
      return res.status(422).end();
    }

    const data = {
      id: pi_user.id,
      email: pi_user.email,
      consents: JSON.parse(ad_user.consents),
    };

    console.log(JSON.stringify(data));

    res.json(data);

    function onError(err) {
      err_code = err.code;
      console.warn(err.message);
    }
  }
}

function GET_users(req, res) {
  res.json({
    id: "00000000-0000-0000-0000-000000000000",
    email: "valid@email.com",
    consents: [],
  });
}

function DELETE_users(req, res) {
  res.json({
    id: "00000000-0000-0000-0000-000000000000",
    email: "valid@email.com",
    consents: [],
  });
}
