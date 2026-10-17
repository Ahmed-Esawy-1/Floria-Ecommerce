import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

export const collectionsApi = createApi({
    reducerPath: "collectionsApi",

    baseQuery: baseQueryWithReauth,

    tagTypes: ["Categories", "Occasions"],

    endpoints: (builder) => ({
        // Collections
        getCategories: builder.query({
            query: () => "/categories/summaries",
            providesTags: ["Categories"],
        }),

        getOccasions: builder.query({
            query: () => "/occasions/summaries",
            providesTags: ["Occasions"],
        }),
    }),
});

export const { useGetCategoriesQuery, useGetOccasionsQuery } = collectionsApi;
