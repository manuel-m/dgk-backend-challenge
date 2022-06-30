export const usersSchemas = {
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
  },
};
