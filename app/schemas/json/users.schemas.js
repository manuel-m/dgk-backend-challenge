export const usersSchemas = {
  DELETE_users: {
    req: {
      query: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
  POST_users: {
    req: {
      body: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
        },
        required: ["id", "email"],
        additionalProperties: false,
      },
    },
    res: {
      data: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          consents: {
            type: "array",
            items: { $ref: "#/$defs/consents" },
          },
        },
        required: ["id", "email", "consents"],
        additionalProperties: false,
        $defs: {
          consents: {
            type: "object",
            properties: {
              id: { type: "string" },
              enabled: { type: "boolean" },
            },
          },
        },
      },
    },
  },
};
