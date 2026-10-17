import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const contactApi = createApi({
    reducerPath: "contactApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        sendContactMessage: builder.mutation({
            query: (body) => ({
                url: "/shop/contact",
                method: "POST",
                body,
                responseHandler: "text",
            }),
        }),
    }),
});

export const { useSendContactMessageMutation } = contactApi;
