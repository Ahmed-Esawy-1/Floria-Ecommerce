import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const citiesApi = createApi({
    reducerPath: "citiesApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        getAvailableCities: builder.query({
            query: () => "/cities/available",
        }),
    }),
});

export const { useGetAvailableCitiesQuery } = citiesApi;
