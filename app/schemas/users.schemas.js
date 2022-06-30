export const usersSchemas = {
  POST_users: {
    req: {
      body: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
        },
        required: ["id", "email"],
        additionalProperties: false,
      },
    },
  },
};
