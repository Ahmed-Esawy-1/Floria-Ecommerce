import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const productSearchApi = createApi({
    reducerPath: "productSearchApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        searchProducts: builder.query({
            query: (keyword) => ({
                url: "/products/search",
                method: "GET",
                params: { keyword },
            }),
        }),
    }),
});

export const { useSearchProductsQuery } = productSearchApi;
