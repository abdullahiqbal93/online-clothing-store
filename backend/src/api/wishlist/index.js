import { addToWishlist, removeFromWishlist, getUserWishlist } from "@/api/wishlist/controller";
import { validateRequestBody, validateRequestParams } from "@/lib/middlewares/validate";
import { wishlistSchema, updateWishlistSchema } from "@/api/wishlist/schema/index";
import { userByIdSchemaParams } from "@/lib/shared-schema";

export const wishlist = (router) => {
  router.post(
    "/wishlist",
    validateRequestBody(wishlistSchema),
    addToWishlist
  );

  router.delete(
    "/wishlist",
    validateRequestBody(updateWishlistSchema),
    removeFromWishlist
  );

  router.get(
    "/wishlist/:userId",
    validateRequestParams(userByIdSchemaParams),
    getUserWishlist
  );

  return router;
};