import { searchProducts } from "@/api/search/controller";

export const search = (router) => {
    router.get(
        "/search/:keyword",
        searchProducts
    )


    return router;
};