import crypto from "crypto";

// import { consentsSchemas } from "./consents.schemas";

export function consents_e2e() {
  return {
    id: "consents CRUD",
    tests: [consents_POST__valid],
  };

  async function consents_POST__valid({ ajv, expect, POST }) {
    let new_user;

    // create new user
    {
      const { status, data } = await POST("users", {
        id: crypto.randomUUID(),
        email: `john_${Date.now()}@doe.com`,
      });
      new_user = data;
      expect({ expected: { status: 200 }, got: { status } });
    }

    // post 1st consents
    {
      const { status, data } = await POST("events", {
        id: new_user.id,
        consents: [
          {
            id: "email_notifications",
            enabled: true,
          },
        ],
      });
    }
  }
}
