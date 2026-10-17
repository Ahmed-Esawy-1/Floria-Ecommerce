import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const watchlistApi = createApi({
    reducerPath: "watchlistApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Watchlist"],

    endpoints: (builder) => ({
        // Get full products
        getWatchlistProducts: builder.query({
            query: () => "/customers/me/watchlist",
            providesTags: ["Watchlist"],
        }),

        // Get product ids only
        getWatchlistIds: builder.query({
            query: () => "/customers/me/watchlist/ids",
            providesTags: ["Watchlist"],
        }),

        // Add
        addToWatchlist: builder.mutation({
            query: (productId) => ({
                url: `/customers/me/watchlist/${productId}/add`,
                method: "POST",
                responseHandler: "text",
            }),
            invalidatesTags: ["Watchlist"],
        }),

        // Remove
        removeFromWatchlist: builder.mutation({
            query: (productId) => ({
                url: `/customers/me/watchlist/${productId}/remove`,
                method: "DELETE",
                responseHandler: "text",
            }),
            invalidatesTags: ["Watchlist"],
        }),
    }),
});

export const {
    useGetWatchlistProductsQuery,
    useGetWatchlistIdsQuery,
    useAddToWatchlistMutation,
    useRemoveFromWatchlistMutation,
} = watchlistApi;
