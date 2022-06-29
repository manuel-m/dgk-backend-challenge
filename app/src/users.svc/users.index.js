import { RestApp } from "../RestApp.js";

import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "users";
const { port } = mservices_net[mservice_id];

RestApp({
  mservice_id,
  port,
  routes: [["/users", "get", GET_users]],
});

function GET_users(req, res) {
  res.send("[SUCCESS]" + mservice_id + "\n");
}
