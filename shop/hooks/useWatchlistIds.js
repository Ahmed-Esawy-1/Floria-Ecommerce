"use client";

import { useSelector } from "react-redux";
import { useGetWatchlistIdsQuery } from "@/lib/api/watchlistApi";

export default function useWatchlistIds() {
    const isLoggedIn = useSelector((state) => !!state.auth.user);

    const { data = [] } = useGetWatchlistIdsQuery(undefined, {
        skip: !isLoggedIn,
    });

    return isLoggedIn ? (data ?? []) : [];
}
