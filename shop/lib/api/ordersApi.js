import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

export const ordersApi = createApi({
    reducerPath: "ordersApi",

    baseQuery: baseQueryWithReauth,

    tagTypes: ["Order"],

    endpoints: (builder) => ({
        // Place order. Returns { orderId, totalPrice }
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: "/shop/order/place",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Order"],
        }),

        // My orders (paginated). params: { page, size, status }
        getMyOrders: builder.query({
            query: (params) => ({
                url: "/shop/orders/my",
                params,
            }),
            providesTags: ["Order"],
        }),

        // Cancel my order (the backend returns a plain string)
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/shop/order/${orderId}/cancel`,
                method: "PATCH",
                responseHandler: "text",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useCancelOrderMutation,
} = ordersApi;
