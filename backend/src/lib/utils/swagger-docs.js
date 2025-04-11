import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { generateToken } from "./auth";

export const getAuthDetails = async (registry) => {
  const testToken = await generateToken({ user: 'testUser' });

  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: `Use the following token for testing: <br /> <br /> **\`${testToken}\`**`,
  });

  return {
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
            description: `Use the following token for testing: <br /> <br /> **\`${testToken}\`**`,
        },
      },
    },
  };
};
