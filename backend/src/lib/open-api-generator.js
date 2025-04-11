import { API_PATH, SWAGGER_PATH } from "@/lib/config";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { getAuthDetails } from "@/lib/utils/swagger-docs";
import { getHeartBeatRegistry } from "@/api/status/heartbeat";
import { getUserRegistry } from "@/api/user/docs";
import { getProductRegistry} from "@/api/product/docs";
import { getCartRegistry } from "@/api/cart/docs";
import { getOrderRegistry } from "@/api/order/docs";
import { getAddressRegistry } from "@/api/address/docs";
import { getNewsletterRegistry } from "@/api/newsletter/docs";
import { env } from "@/lib/config";


export const generateOpenAPIDocument = async () => {
  const registry = new OpenAPIRegistry([
    getHeartBeatRegistry(),
    getUserRegistry(),
    getProductRegistry(),
    getCartRegistry(),
    getOrderRegistry(),
    getAddressRegistry(),
    getNewsletterRegistry()
  ]);

  const authDetails = await getAuthDetails(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "v1",
      title: "Flexxy API",
    },
    servers: [{ url: `${env.API_BASE_URL}` }],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: `${API_PATH}${SWAGGER_PATH}/json`,
    },
    security: authDetails.security,
    components: authDetails.components,
  });
};