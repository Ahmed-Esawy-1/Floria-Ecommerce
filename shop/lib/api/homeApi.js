import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

export const homeApi = createApi({
    reducerPath: "homeApi",

    baseQuery: baseQueryWithReauth,

    tagTypes: ["SectionProducts"],

    endpoints: (builder) => ({
        // Section Products
        getSectionProducts: builder.query({
            query: (sectionId) => ({
                url: `/section/${sectionId}/products`,
            }),
            providesTags: (result, error, sectionId) => [
                { type: "SectionProducts", id: sectionId },
            ],
        }),
    }),
});

export const { useGetSectionProductsQuery } = homeApi;
