import axios from "axios";
import fs from "node:fs";

import { conf } from "./devops/conf.mjs";

_main();

async function _main() {
  const file = "data/requests.backup";

  const lines = fs.readFileSync(file).toString().split("\n");

  for (const line of lines) {
    // console.log(line);
    try {
      const { method, body, protocol, url } = JSON.parse(line);

      const _url =
        protocol + "://localhost:" + conf.mservicesMap.nginx.port + url;

      const opt = {
        url: _url,
        method,
        validateStatus(status) {
          return status < 500;
        },
      };

      if (Object.keys(body).length > 0) {
        opt.data = body;
      }

      await axios(opt).catch(function (err) {
        console.log(err.message);
      });
    } catch (err) {}
  }
}
