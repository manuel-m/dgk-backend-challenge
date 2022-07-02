import express from "express";

import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "mirror";
const { port } = mservices_net[mservice_id];

_main();

async function _main() {
  const app = express();
  app.use(express.json());

  app.listen(port, () => {
    console.log(mservice_id + " listening on :" + port);
  });
}
