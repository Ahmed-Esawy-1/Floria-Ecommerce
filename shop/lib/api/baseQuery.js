import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logout } from "@/features/auth/authSlice";
import { BASE } from "../config";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

// A 401 from these means "wrong credentials", not "expired token"
const NO_REAUTH = [
    "/auth/login",
    "/auth/refresh",
    "/auth/signup",
    "/account/change-password",
];

// ONE refresh
let refreshPromise = null;

// Returns true when new tokens were saved
const refreshTokens = async (api, extraOptions) => {
    const { refreshToken } = api.getState().auth;
    if (!refreshToken) return "invalid";

    const res = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST", body: { refreshToken } },
        api,
        extraOptions,
    );

    if (res.data?.accessToken) {
        api.dispatch(
            setCredentials({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken ?? refreshToken,
            }),
        );
        return "ok";
    }

    const status = res.error?.status;
    return status === 400 || status === 401 || status === 403
        ? "invalid"
        : "error";
};

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    const tokenUsed = api.getState().auth.accessToken;
    let result = await rawBaseQuery(args, api, extraOptions);

    const url = typeof args === "string" ? args : args.url;
    if (
        result.error?.status !== 401 ||
        !tokenUsed ||
        NO_REAUTH.some((p) => url.startsWith(p))
    ) {
        return result;
    }

    // Another request already refreshed while this one was in flight: retry.
    if (api.getState().auth.accessToken !== tokenUsed) {
        return rawBaseQuery(args, api, extraOptions);
    }

    refreshPromise ??= refreshTokens(api, extraOptions).finally(() => {
        refreshPromise = null;
    });

    const refreshResult = await refreshPromise;

    if (refreshResult === "invalid") {
        api.dispatch(logout());
        return result;
    }

    if (refreshResult !== "ok") {
        return result; // خطأ مؤقت: لا تسجّل الخروج
    }

    return rawBaseQuery(args, api, extraOptions);
};
