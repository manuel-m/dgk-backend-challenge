import crypto from "crypto";

export function consents_e2e() {
  return {
    id: "consents CRUD",
    tests: [consents_POST__valid],
  };

  async function consents_POST__valid({ expect, GET, POST }) {
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
      const { status } = await POST("events", {
        user: { id: new_user.id },
        consents: [
          {
            id: "email_notifications",
            enabled: true,
          },
        ],
      });

      expect({ expected: { status: 200 }, got: { status } });
    }

    // check 1st consents
    {
      const { data } = await GET("users", { id: new_user.id });
      expect({
        expected: {
          user: {
            id: new_user.id,
            email: new_user.email,
            consents: [{ id: "email_notifications", enabled: true }],
          },
        },
        got: { user: data },
      });
    }

    // post 2nd consents
    {
      const { status } = await POST("events", {
        user: { id: new_user.id },
        consents: [
          {
            id: "sms_notifications",
            enabled: true,
          },
        ],
      });

      expect({ expected: { status: 200 }, got: { status } });
    }

    // check 2nd consents
    {
      const { data } = await GET("users", { id: new_user.id });
      expect({
        expected: {
          user: {
            id: new_user.id,
            email: new_user.email,
            consents: [
              { id: "email_notifications", enabled: true },
              { id: "sms_notifications", enabled: true },
            ],
          },
        },
        got: { user: data },
      });
    }
  }
}
