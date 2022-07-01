import axios from "axios";

import { conf } from "../../devops/conf.mjs";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import { users_CRUD_e2e } from "./e2e.tests/users.e2e.inputs";

const ajv = new Ajv();
addFormats(ajv);

_main();

async function _main() {
  for (const { id, tests } of [users_CRUD_e2e()]) {
    console.log(id);
    for (const test of tests) {
      console.log("\t" + test.name);
      await test({ ajv, expect, DELETE, POST });
    }
  }
}

function DELETE(uri, params) {
  return axios({
    url: "http://localhost:" + conf.mservicesMap.nginx.port + "/" + uri,
    method: "delete",
    params,
    validateStatus(status) {
      return status < 500;
    },
  });
}

function POST(uri, data) {
  return axios({
    url: "http://localhost:" + conf.mservicesMap.nginx.port + "/" + uri,
    method: "post",
    data,
    validateStatus(status) {
      return status < 500;
    },
  });
}

function expect({ expected, got }) {
  const jexpected = JSON.stringify(expected);
  const jgot = JSON.stringify(got);

  if (jexpected !== jgot) {
    console.error(">> [EXP] " + jexpected + "\n" + "<< [GOT] " + jgot);
    process.exit(1);
  }
}
