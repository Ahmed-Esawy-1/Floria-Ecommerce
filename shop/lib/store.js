import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import { authApi } from "./api/authApi";
import { homeApi } from "./api/homeApi";
import { collectionsApi } from "./api/collectionsApi";
import { shopApi } from "./api/shopApi";
import { productSearchApi } from "./api/productSearchApi";
import { watchlistApi } from "./api/watchlistApi";
import { ordersApi } from "./api/ordersApi";
import { citiesApi } from "./api/citiesApi";
import { contactApi } from "./api/contactApi";
import { chatApi } from "./api/chatApi";


export const makeStore = (preloadedState) =>
    configureStore({
        reducer: {
            cart: cartReducer,
            auth: authReducer,
            [authApi.reducerPath]: authApi.reducer,
            [homeApi.reducerPath]: homeApi.reducer,
            [collectionsApi.reducerPath]: collectionsApi.reducer,
            [shopApi.reducerPath]: shopApi.reducer,
            [productSearchApi.reducerPath]: productSearchApi.reducer,
            [watchlistApi.reducerPath]: watchlistApi.reducer,
            [ordersApi.reducerPath]: ordersApi.reducer,
            [citiesApi.reducerPath]: citiesApi.reducer,
            [contactApi.reducerPath]: contactApi.reducer,
            [chatApi.reducerPath]: chatApi.reducer,
        },

        preloadedState,

        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(authApi.middleware)
                .concat(homeApi.middleware)
                .concat(collectionsApi.middleware)
                .concat(shopApi.middleware)
                .concat(productSearchApi.middleware)
                .concat(watchlistApi.middleware)
                .concat(ordersApi.middleware)
                .concat(citiesApi.middleware)
                .concat(contactApi.middleware)
                .concat(chatApi.middleware),
    });
