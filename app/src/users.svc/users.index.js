import { RestApp } from "../RestApp.js";
import { PgPiBackend } from "../PgBackend.js";

import mservices_net from "../../generated/mservices_net.js";

import { usersSchemas } from "../../schemas/json/users.schemas.js";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import init_query from "../../generated/postgrespi.db.init.sql";

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
  const pi_sql = await PgPiBackend({ init_query });

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
    const { email, phone } = Object.assign({ phone: "" }, req.body);
    let err_code = 0;

    await pi_sql`INSERT INTO pi_users (email, phone) values (${email}, ${phone})`.catch(
      function (err) {
        err_code = err.code;
        console.warn(err.message);
      }
    );

    if (err_code !== 0) {
      return res.status(422).end();
    }

    res.json(req.body);
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
