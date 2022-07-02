import express from "express";
import mservices_net from "../../generated/mservices_net.js";
import fs from "node:fs";

const mservice_id = "mirror";
const { port } = mservices_net[mservice_id];

_main();

async function _main() {
  const file = fs.createWriteStream("data/requests.backup");

  const app = express();
  app.use(express.json());

  app.use(function (req, res, next) {
    const { method, body, path, protocol, url, query } = req;

    const ts = Date.now();
    file.write(
      JSON.stringify({ ts, method, body, path, protocol, query, url }) + "\n"
    );
    next();
  });

  app.listen(port, () => {
    console.log(mservice_id + " listening on :" + port);
  });
}
