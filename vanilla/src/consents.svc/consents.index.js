import { RestApp } from "../RestApp.js";

import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "consents";
const { port } = mservices_net[mservice_id];

RestApp({
  mservice_id,
  port,
  routes: [["/consents", "get", GET_consents]],
});

function GET_consents(req, res) {
  res.send("[SUCCESS]" + mservice_id + "\n");
}
