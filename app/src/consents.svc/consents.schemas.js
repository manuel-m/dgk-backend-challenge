export const consentsSchemas = {
  POST_consents: {
    req: {
      body: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
            },
            required: ["id"],
            additionalProperties: false,
          },
          consents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                enabled: { type: "boolean" },
              },
              required: ["id", "enabled"],
              additionalProperties: false,
            },
          },
        },
      },
    },
  },
};
