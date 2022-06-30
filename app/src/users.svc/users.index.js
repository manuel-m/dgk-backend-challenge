import { RestApp } from "../RestApp.js";
import { PgPiBackend } from "../PgBackend.js";

import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "users";
const { port } = mservices_net[mservice_id];

PgPiBackend();

console.log("pi:index");

RestApp({
  mservice_id,
  port,
  routes: [
    ["/users", "get", GET_users],
    ["/users", "post", POST_users],
    ["/users", "delete", DELETE_users],
  ],
});

function GET_users(req, res) {
  res.json({
    id: "00000000-0000-0000-0000-000000000000",
    email: "valid@email.com",
    consents: [],
  });
}

function POST_users(req, res) {
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
