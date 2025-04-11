import { createAddress, deleteAddress, getAddress, getAddressById, updateAddress } from "@/api/address/controller";
import { insertAddressSchema, updateAddressSchema } from "@/api/address/schema/index";
import { validateRequestBody, validateRequestParams } from "@/lib/middlewares/validate";
import { addressByIdSchemaParams, getByIDSchemaParams, userByIdSchemaParams } from "@/lib/shared-schema/index";

export const address = (router) => {
    router.post(
      "/address",
      validateRequestBody(insertAddressSchema),
      createAddress
    );
  
    router.get("/address", getAddress); 
  
    router.get(
      "/address/:userId/:addressId",
      validateRequestParams(userByIdSchemaParams,addressByIdSchemaParams),
      getAddressById
    );
  
    router.put(
      "/address/:userId/:addressId",
      validateRequestParams(userByIdSchemaParams,addressByIdSchemaParams), 
      validateRequestBody(updateAddressSchema),
      updateAddress
    );
  
    router.delete(
      "/address/:userId/:addressId",
      validateRequestParams(userByIdSchemaParams,addressByIdSchemaParams),
      deleteAddress
    );
  
    return router;
  };