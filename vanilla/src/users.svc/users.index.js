import express from "express";

import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "users";

const { port } = mservices_net[mservice_id];

const app = express();

app.get("/users", function (req, res) {
  res.send(mservice_id + "ok");
});

app.listen(port, () => {
  console.log("listening on :" + port);
});
