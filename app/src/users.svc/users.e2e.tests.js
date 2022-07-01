import crypto from "crypto";

import { usersSchemas } from "./users.schemas";

export function users_e2e() {
  const new_users = [];

  return {
    id: "users CRUD",
    tests: [
      users_POST__valid,
      users_POST__email_duplicate,
      users_POST__missing_id,
      users_POST__bad_email,
      users_POST__empty,
      users_GET,
      users_DELETE,
    ],
  };

  async function users_GET({ expect, GET }) {
    const got_users = [];
    // GET user
    for (const id of new_users.map((o) => o.id)) {
      const { status, data: user } = await GET("users", { id });
      expect({ expected: { status: 200 }, got: { status } });
      got_users.push(user);
    }

    expect({ expected: new_users.sort(), got: got_users.sort() });
  }

  async function users_DELETE({ expect, DELETE }) {
    // delete new users
    for (const id of new_users.map((o) => o.id)) {
      const { status } = await DELETE("users", { id });
      expect({ expected: { status: 200 }, got: { status } });
    }

    // delete already deleted user
    {
      const { id } = new_users[0];
      const { status } = await DELETE("users", { id });
      expect({ expected: { status: 422 }, got: { status } });
    }

    // [!] side effects
    new_users.length = 0;
  }

  async function users_POST__valid({ ajv, expect, POST }) {
    const email = `john_${Date.now()}@doe.com`;

    const { status, data: new_user } = await POST("users", {
      id: crypto.randomUUID(),
      email,
    });

    new_users.push(new_user);

    expect({ expected: { status: 200 }, got: { status } });

    expect({
      expected: { "validate(res.data)": true },
      got: {
        "validate(res.data)": ajv.validate(
          usersSchemas.POST_users.res.data,
          new_user
        ),
      },
    });
  }

  async function users_POST__email_duplicate({ expect, POST }) {
    const email1 = `john_${Date.now()}@doe.com`;

    // insert 1
    {
      const { status, data: new_user } = await POST("users", {
        id: crypto.randomUUID(),
        email: email1,
      });
      expect({ expected: { status: 200 }, got: { status } });

      new_users.push(new_user);
    }

    // insert 2
    {
      const { status } = await POST("users", {
        id: crypto.randomUUID(),
        email: email1,
      });
      expect({ expected: { status: 422 }, got: { status } });
    }
  }

  async function users_POST__missing_id({ expect, POST }) {
    const { status } = await POST("users", {
      email: "john@doe.com",
    });
    expect({ expected: { status: 422 }, got: { status } });
  }

  async function users_POST__bad_email({ expect, POST }) {
    const { status } = await POST("users", {
      id: crypto.randomUUID(),
      email: "invalid_email",
    });
    expect({ expected: { status: 422 }, got: { status } });
  }

  async function users_POST__empty({ expect, POST }) {
    const { status } = await POST("users", {});
    expect({ expected: { status: 422 }, got: { status } });
  }
}
