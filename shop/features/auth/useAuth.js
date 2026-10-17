"use client";

import { useSelector } from "react-redux";

import { useGetMeQuery } from "@/lib/api/authApi";

export function useAuth() {
    const { accessToken, initialized } = useSelector((s) => s.auth);
    const { data, isLoading } = useGetMeQuery(undefined, {
        skip: !accessToken,
    });

    return {
        user: accessToken ? (data?.user ?? null) : null,
        dashboardAccess: accessToken ? Boolean(data?.dashboardAccess) : false,
        isAuthenticated: Boolean(accessToken && data?.user),
        isLoading: !initialized || (Boolean(accessToken) && isLoading),
    };
}
