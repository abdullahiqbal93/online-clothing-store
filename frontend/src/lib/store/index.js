import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/store/features/user/userSlice";
import adminUserReducer from "@/lib/store/features/user/adminUserSlice";
import searchReducer from "@/lib/store/features/search/searchSlice";
import productReducer from "@/lib/store/features/product/productSlice";
import cartReducer from "@/lib/store/features/cart/cartSlice";
import addressReducer from "@/lib/store/features/address/addressSlice";
import orderReducer from "@/lib/store/features/order/orderSlice";
import adminOrderReducer from "@/lib/store/features/order/adminOrderSlice";
import wishlistReducer from "@/lib/store/features/wishlist/wishlistSlice";
import newsletterReducer from "@/lib/store/features/newsletter/newsletterSlice";

import { usersApi } from "@/lib/store/api/userService";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      adminUser: adminUserReducer,
      search: searchReducer,
      product: productReducer,
      cart: cartReducer,
      address: addressReducer,
      order: orderReducer,
      adminOrder: adminOrderReducer,
      wishlist: wishlistReducer,
      newsletter: newsletterReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        usersApi.middleware,
      ),
  });
};

const store = makeStore();

export default store;
