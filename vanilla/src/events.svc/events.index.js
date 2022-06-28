import express from "express";

import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "events";

const { port } = mservices_net[mservice_id];

const app = express();

app.get("/", function (req, res) {
  res.send(mservice_id + "!");
});

app.listen(port, () => {
  console.log("listening on :" + port);
});