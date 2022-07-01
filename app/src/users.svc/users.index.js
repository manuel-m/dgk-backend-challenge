import { RestApp } from "../RestApp.js";

import mservices_net from "../../generated/mservices_net.js";

import { usersSchemas } from "./users.schemas.js";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import { UsersBackend } from "./users.backend";

const ajv = new Ajv();
addFormats(ajv);

const mservice_id = "users";
const { port } = mservices_net[mservice_id];

const validate = {
  GET_users: {
    req: {
      query: ajv.compile(usersSchemas.GET_users.req.query),
    },
  },
  DELETE_users: {
    req: {
      query: ajv.compile(usersSchemas.DELETE_users.req.query),
    },
  },
  POST_users: {
    req: {
      body: ajv.compile(usersSchemas.POST_users.req.body),
    },
  },
};

_main();

async function _main() {
  const backend = await UsersBackend();

  RestApp({
    mservice_id,
    port,
    routes: [
      ["/users", "get", GET_users],
      ["/users", "post", POST_users],
      ["/users", "delete", DELETE_users],
    ],
  });

  async function GET_users(req, res) {
    const { query } = req;
    if (validate.GET_users.req.query(query) === false) {
      console.warn("GET_USERS invalid query " + query);
      return res.status(422).end();
    }
    const [err, user] = await backend.get({ id: query.id });
    if (err !== null) {
      console.warn("GET_USERS", err);
      return res.status(422).end();
    }

    res.json(user);
  }

  async function POST_users(req, res) {
    if (validate.POST_users.req.body(req.body) === false) {
      return res.status(422).end();
    }
    const { id, email } = req.body;
    const [err, user] = await backend.create({ id, email });

    if (err !== null) {
      console.warn(err);
      return res.status(422).end();
    }
    res.json(user);
  }

  async function DELETE_users(req, res) {
    const { query } = req;
    if (validate.DELETE_users.req.query(query) === false) {
      console.warn("DELETE_users invalid query " + JSON.stringify(query));
      return res.status(422).end();
    }
    const [err] = await backend.remove({ id: query.id });
    if (err !== null) {
      console.warn("DELETE_users", err);
      return res.status(422).end();
    }
    res.status(200).end();
  }
}
