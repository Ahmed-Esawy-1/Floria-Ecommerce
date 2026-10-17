import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const shopApi = createApi({
    reducerPath: "shopApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Colors", "Product", "Comments"],

    endpoints: (builder) => ({
        // Colors
        getColors: builder.query({
            query: () => "/colors",
            providesTags: ["Colors"],
        }),

        // Products
        getShopProducts: builder.query({
            query: ({ page = 0, size = 12, ...filters }) => ({
                url: "/shop/products",
                method: "POST",
                params: { page, size },
                body: filters,
            }),

            // Same key for every page, so the pages merge into one list
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { page, ...rest } = queryArgs;
                return `${endpointName}:${JSON.stringify(rest)}`;
            },

            merge: (currentCache, incoming, { arg }) => {
                // First page replaces the list
                if (!arg.page) return incoming;

                // Later pages are appended, skipping duplicates
                const seen = new Set(currentCache.content.map((p) => p.id));
                return {
                    ...incoming,
                    content: [
                        ...currentCache.content,
                        ...incoming.content.filter((p) => !seen.has(p.id)),
                    ],
                };
            },

            // Refetches when any changes in filters
            forceRefetch: ({ currentArg, previousArg }) =>
                JSON.stringify(currentArg) !== JSON.stringify(previousArg),
        }),

        // Price Range
        getShopPriceRange: builder.query({
            query: (filters) => ({
                url: "/shop/products/price-range",
                method: "POST",
                body: filters,
            }),
        }),

        // Get Product By ID
        getProduct: builder.query({
            query: (id) => `/shop/product/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),

        // Related products (same categories, then newest)
        getRelatedProducts: builder.query({
            query: (id) => `/shop/product/${id}/related`,
        }),

        // Product Comments
        getProductComments: builder.query({
            query: (productId) => `/product/${productId}/comments`,
            providesTags: (result, error, productId) => [
                { type: "Comments", id: productId },
            ],
        }),

        // Add Comment
        addProductComment: builder.mutation({
            query: ({ productId, content, rating }) => ({
                url: `/product/${productId}/comment/add`,
                method: "POST",
                body: { content, rating },
                responseHandler: "text",
            }),

            invalidatesTags: (result, error, { productId }) =>
                error ? [] : [{ type: "Comments", id: productId }],
        }),
    }),
});

export const {
    useGetColorsQuery,
    useGetShopProductsQuery,
    useGetShopPriceRangeQuery,
    useGetProductQuery,
    useGetRelatedProductsQuery,
    useGetProductCommentsQuery,
    useAddProductCommentMutation,
} = shopApi;
