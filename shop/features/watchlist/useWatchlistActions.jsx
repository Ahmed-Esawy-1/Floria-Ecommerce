"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
    useAddToWatchlistMutation,
    useRemoveFromWatchlistMutation,
} from "@/lib/api/watchlistApi";

export function useWatchlistActions() {
    const t = useTranslations("watchlist");

    const [addItem, { isLoading: adding }] = useAddToWatchlistMutation();
    const [removeItem, { isLoading: removing }] =
        useRemoveFromWatchlistMutation();

    const add = async (productId) => {
        try {
            await addItem(productId).unwrap();
            toast.success(t("toast.add"));
        } catch {
            toast.error(t("toast.actionFailed"));
        }
    };

    const remove = async (productId) => {
        try {
            await removeItem(productId).unwrap();
            toast.success(t("toast.remove"));
        } catch {
            toast.error(t("toast.actionFailed"));
        }
    };

    return { add, remove, isPending: adding || removing };
}
