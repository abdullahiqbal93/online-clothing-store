import { heartbeat } from "@/api/status/heartbeat";
import { user } from "@/api/user";
import { product } from "@/api/product";
import { cart } from "@/api/cart";
import { order } from "@/api/order";
import { address } from "@/api/address";
import { search } from "@/api/search";
import { wishlist } from "@/api/wishlist";
import { newsletter } from "@/api/newsletter";

import { Router } from "express";

export const getApiRouter = () => {
    const router = Router();
    heartbeat(router);
    user(router);
    product(router);
    cart(router);
    order(router);
    address(router);
    search(router);
    wishlist(router);
    newsletter(router);

    return router;
};