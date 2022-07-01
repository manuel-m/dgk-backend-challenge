import crypto from "crypto";

import { usersSchemas } from "../../../app/schemas/json/users.schemas";

export default [
  users_POST__valid,
  users_POST__email_duplicate,
  users_POST__missing_id,
  users_POST__bad_email,
  users_POST__empty,
];

async function users_POST__valid({ ajv, expect, post }) {
  const email = `john_${Date.now()}@doe.com`;

  const { status, data } = await post("users", {
    id: crypto.randomUUID(),
    email,
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

async function users_POST__email_duplicate({ expect, post }) {
  const email1 = `john_${Date.now()}@doe.com`;

  // insert 1
  {
    const { status } = await post("users", {
      id: crypto.randomUUID(),
      email: email1,
    });
    expect({ expected: { status: 200 }, got: { status } });
  }

  // insert 2
  {
    const { status } = await post("users", {
      id: crypto.randomUUID(),
      email: email1,
    });
    expect({ expected: { status: 422 }, got: { status } });
  }
}

async function users_POST__missing_id({ expect, post }) {
  const { status } = await post("users", {
    email: "john@doe.com",
  });
  expect({ expected: { status: 422 }, got: { status } });
}

async function users_POST__bad_email({ expect, post }) {
  const { status } = await post("users", {
    id: crypto.randomUUID(),
    email: "invalid_email",
  });
  expect({ expected: { status: 422 }, got: { status } });
}

async function users_POST__empty({ expect, post }) {
  const { status } = await post("users", {});
  expect({ expected: { status: 422 }, got: { status } });
}
