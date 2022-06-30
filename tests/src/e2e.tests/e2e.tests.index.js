import axios from "axios";

import { conf } from "../../../devops/conf.mjs";

const users_url = _url("users");
_main();

async function _main() {
  await users_create_empty();
}

async function users_create_empty() {
  const payload = {
    consents: [],
  };

  const { data, status } = await axios.post(users_url, payload);

  const expected = { data: { carote: "mlmù" }, status: 422 };

  expect({ expected, got: { data, status } });
}

function _url(uri) {
  return "http://localhost:" + conf.mservicesMap.nginx.port + "/" + uri;
}

function expect({ expected, got }) {
  const jexpected = JSON.stringify(expected);
  const jgot = JSON.stringify(got);

  if (jexpected !== jgot) {
    console.error("[EXP] " + jexpected + "\n" + "[GOT] " + jgot);
    process.exit(1);
  }
}
