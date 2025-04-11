import { addToCart, deleteCartItem, fetchUserCartItems, updateCartItemQuantity } from "@/api/cart/controller";
import { deleteCartSchema, insertCartSchema, updateCartSchema } from "@/api/cart/schema/index";
import { validateRequestBody } from "@/lib/middlewares/validate";

export const cart = (router) => {
    router.post(
        "/cart",
        validateRequestBody(insertCartSchema),
        addToCart,
    );

    router.get("/cart/:userId", fetchUserCartItems);

    router.put(
        "/cart",
        validateRequestBody(updateCartSchema),
        updateCartItemQuantity,
    );

    router.delete("/cart", validateRequestBody(deleteCartSchema), deleteCartItem);

    return router;
};