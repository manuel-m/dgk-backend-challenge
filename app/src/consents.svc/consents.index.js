import { RestApp } from "../RestApp.js";

import mservices_net from "../../generated/mservices_net.js";

import { consentsSchemas } from "./consents.schemas";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import { ConsentsBackend } from "./consents.backend";

const ajv = new Ajv();
addFormats(ajv);

const mservice_id = "consents";
const { port } = mservices_net[mservice_id];

const validate = {
  POST_events: {
    req: {
      body: ajv.compile(consentsSchemas.POST_consents.req.body),
    },
  },
};

_main();

async function _main() {
  const backend = await ConsentsBackend();

  RestApp({
    mservice_id,
    port,
    routes: [["/events", "post", POST_events]],
  });

  async function POST_events(req, res) {
    if (validate.POST_events.req.body(req.body) === false) {
      console.warn(req.body);
      return res.status(422).end();
    }

    const [err] = await backend.create(req.body);

    if (err !== null) {
      console.warn(err);
      return res.status(422).end();
    }
    res.status(200).end();
  }
}
