import { RestApp } from "../RestApp.js";
import { PgPiBackend } from "../PgBackend.js";

import mservices_net from "../../generated/mservices_net.js";

import { usersSchemas } from "../../schemas/users.schemas.js";

import Ajv from "ajv";
import addFormats from "ajv-formats";

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
  const pi_sql = await PgPiBackend();

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

    const data = JSON.stringify(req.body);

    await pi_sql`INSERT INTO pi_users (data) values (${data})`;

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
