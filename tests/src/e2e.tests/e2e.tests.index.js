import crypto from "crypto";
import axios from "axios";

import { usersSchemas } from "../../../app/schemas/users.schemas";

import { conf } from "../../../devops/conf.mjs";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { cp } from "fs";

const ajv = new Ajv();
addFormats(ajv);

_main();

async function _main() {
  for (const test of [
    users_POST__valid,
    users_POST__empty,
    users_POST__missing_id,
    users_POST__bad_email,
  ]) {
    console.log(test.name);
    await test();
  }
}

async function users_POST__valid() {
  const { status, data } = await _post(_url("users"), {
    id: crypto.randomUUID(),
    email: "john@doe.com",
  });
  expect({ expected: { status: 200 }, got: { status } });

  expect({
    expected: { "validate(res.data)": true },
    got: {
      "validate(res.data)": ajv.validate(
        usersSchemas.POST_users.res.data,
        data
      ),
    },
  });
}

async function users_POST__missing_id() {
  const { status } = await _post(_url("users"), {
    email: "john@doe.com",
  });
  expect({ expected: { status: 422 }, got: { status } });
}

async function users_POST__bad_email() {
  const { status } = await _post(_url("users"), {
    id: crypto.randomUUID(),
    email: "invalid_email",
  });
  expect({ expected: { status: 422 }, got: { status } });
}

async function users_POST__empty() {
  const { status } = await _post(_url("users"), {});
  expect({ expected: { status: 422 }, got: { status } });
}

function _post(url, data) {
  return axios({
    url,
    method: "post",
    data,
    validateStatus(status) {
      return status < 500;
    },
  });
}

function _url(uri) {
  return "http://localhost:" + conf.mservicesMap.nginx.port + "/" + uri;
}

function expect({ expected, got }) {
  const jexpected = JSON.stringify(expected);
  const jgot = JSON.stringify(got);

  if (jexpected !== jgot) {
    console.error(">> [EXP] " + jexpected + "\n" + "<< [GOT] " + jgot);
    process.exit(1);
  }
}
