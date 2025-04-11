import { addOrder, cancelOrder, capturePayment, createOrder, deleteOrder, deleteOrderForAdmin, deleteOrderForUser, getOrder, getOrderById, updateOrder } from "@/api/order/controller";
import { insertOrderSchema, updateOrderSchema } from "@/api/order/schema/index";
import { validateRequestBody, validateRequestParams } from "@/lib/middlewares/validate";
import { getByIDSchemaParams } from "@/lib/shared-schema/index";

export const order = (router) => {
    router.post(
        "/order",
        validateRequestBody(insertOrderSchema), 
        createOrder,
    );

    router.post(
        "/add-order",
        validateRequestBody(insertOrderSchema), 
        addOrder,
    );

    router.post("/order/capture", capturePayment);

    router.get("/order", getOrder);

    router.get("/order/:id", validateRequestParams(getByIDSchemaParams), getOrderById);

    router.put(
        "/order/:id",
        validateRequestParams(getByIDSchemaParams),
        validateRequestBody(updateOrderSchema),
        updateOrder,
    );

    router.put("/order/delete/:id", validateRequestParams(getByIDSchemaParams), deleteOrderForUser);

    router.put("/order/admin-delete/:id", validateRequestParams(getByIDSchemaParams), deleteOrderForAdmin);

    router.delete("/order/:id", validateRequestParams(getByIDSchemaParams), deleteOrder);

    router.post(
        "/order/cancel/:id", 
        validateRequestParams(getByIDSchemaParams), 
        cancelOrder
      );

    return router;
};