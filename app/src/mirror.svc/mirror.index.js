import express from "express";
import mservices_net from "../../generated/mservices_net.js";

const mservice_id = "mirror";
const { port } = mservices_net[mservice_id];

_main();

async function _main() {
  const app = express();
  app.use(express.json());

  app.use(function (req, res, next) {
    const { method, body, path, protocol, originalUrl, query } = req;

    const ts = Date.now();
    console.log(
      JSON.stringify({ ts, method, body, path, protocol, originalUrl, query })
    );

    next();
  });

  app.listen(port, () => {
    console.log(mservice_id + " listening on :" + port);
  });
}
