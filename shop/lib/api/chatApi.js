import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        askBot: builder.mutation({
            query: (message) => ({
                url: "/chat/ask",
                method: "GET",
                params: { message },
                responseHandler: "text",
            }),
        }),
    }),
});

export const { useAskBotMutation } = chatApi;
