import axios from "axios";

import { conf } from "../../../devops/conf.mjs";

_main();

async function _main() {
  const response = await axios.post(_url("users"));

  const { data, status } = response;

  console.log({ data, status });
}

function _url(uri) {
  return "http://localhost:" + conf.mservicesMap.nginx.port + "/" + uri;
}
