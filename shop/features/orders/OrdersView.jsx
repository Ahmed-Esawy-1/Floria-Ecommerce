"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { useGetMyOrdersQuery } from "@/lib/api/ordersApi";
import Spinner from "@/components/loading/spinner";
import OrderCard from "./components/OrderCard";
import StatusFilter from "./components/StatusFilter";
import { PAGE_SIZE } from "./constants";

export default function OrdersView() {
    const t = useTranslations("orders");

    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState("ALL");
    const [orders, setOrders] = useState([]);

    const status = filter === "ALL" ? undefined : filter;

    const { currentData, isLoading, isFetching, isError, refetch } =
        useGetMyOrdersQuery({ page, size: PAGE_SIZE, status });

    useEffect(() => {
        if (!currentData) return;

        setOrders((prev) => {
            const base = page === 0 ? [] : prev;
            const map = new Map(base.map((o) => [o.orderId, o]));
            currentData.content.forEach((o) => map.set(o.orderId, o));
            return [...map.values()];
        });
    }, [currentData, page]);

    const hasMore = currentData ? !currentData.last : false;

    const changeFilter = (value) => {
        setOrders([]);
        setFilter(value);
        setPage(0);
    };

    const loadMore = () => setPage((p) => p + 1);

    return (
        <div className="flex-1 px-6 md:px-20 py-10 bg-marble-light">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Package className="text-primary" size={28} />
                    <h1 className="text-ink text-3xl font-bold">
                        {t("title")}
                    </h1>
                </div>

                <StatusFilter value={filter} onChange={changeFilter} />

                {isLoading && <Spinner />}

                {isError && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gold/15">
                        <p className="text-slate-600 mb-4">{t("loadFailed")}</p>
                        <button
                            type="button"
                            onClick={refetch}
                            className="px-6 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-all"
                        >
                            {t("retry")}
                        </button>
                    </div>
                )}

                {!isLoading && !isError && orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gold/15">
                        <h2 className="text-2xl font-bold text-ink mb-2">
                            {t("emptyTitle")}
                        </h2>
                        <p className="text-slate-500 mb-6">{t("emptyDesc")}</p>
                        <Link
                            href="/"
                            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all"
                        >
                            {t("startShopping")}
                        </Link>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <OrderCard key={order.orderId} order={order} />
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={isFetching}
                            className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-40 transition-all"
                        >
                            {isFetching ? t("loading") : t("showMore")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
