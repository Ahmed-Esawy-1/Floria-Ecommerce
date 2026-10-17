import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import api from "@/api/axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ORDER_STATUSES } from "./constants";
import OrderSummary from "./OrderSummary";

const UpdateOrderStatus = () => {
    const { orderId: id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("orders");

    const [order, setOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ---- LOAD ORDER --------------------------------------
    useEffect(() => {
        const controller = new AbortController();

        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");
                const { data } = await api.get(`/order/${id}/summary`, {
                    signal: controller.signal,
                });
                setOrder(data);
                setSelectedStatus(data.status);
            } catch (err) {
                if (controller.signal.aborted) return;
                setError(t("statusUpdate.loadError"));
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchOrder();
        return () => controller.abort();
    }, [id, t]);

    const hasChanged = order && selectedStatus !== order.status;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasChanged || saving) return;

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const { data } = await api.patch(
                `/order/update/${id}/status`,
                JSON.stringify(selectedStatus),
                { headers: { "Content-Type": "application/json" } },
            );

            setOrder((prev) => ({ ...prev, ...data }));
            setSelectedStatus(data.status);
            setSuccess(t("statusUpdate.success"));
            toast.success(t("toast.statusUpdated"));
        } catch (err) {
            setError(
                err.response?.data?.message || t("statusUpdate.saveError"),
            );
            toast.error(err.response?.data?.message || t("toast.statusError"));
        } finally {
            setSaving(false);
        }
    };

    // ---- RENDER -------------------------------------

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div
                    role="status"
                    aria-label={t("table.loading")}
                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
                />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="py-20 text-center text-on-surface-variant">
                <p role="alert">{error || t("statusUpdate.loadError")}</p>
                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mt-4 text-primary underline text-sm"
                >
                    {t("statusUpdate.backToOrders")}
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-4 text-sm"
                >
                    <ArrowBackIcon fontSize="small" />
                    {t("statusUpdate.backToOrders")}
                </button>
                <h1 className="page-title">
                    {t("statusUpdate.title", { id: order.orderId })}
                </h1>
                <p className="page-subtitle">{t("statusUpdate.subtitle")}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* DETAILS*/}
                <div className="lg:col-span-2">
                    <OrderSummary order={order} />
                </div>

                {/* STATUS FORM */}
                <aside className="lg:col-span-1">
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm lg:sticky lg:top-6">
                        <h2 className="text-lg font-medium mb-4">
                            {t("statusUpdate.changeStatus")}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="order-status"
                                    className="block text-sm text-on-surface-variant mb-2"
                                >
                                    {t("table.status")}
                                </label>
                                <select
                                    id="order-status"
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        setSuccess("");
                                    }}
                                    disabled={saving}
                                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none focus:border-primary disabled:opacity-60"
                                >
                                    {ORDER_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {t(`status.${s.toLowerCase()}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="text-sm text-red-600"
                                >
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p
                                    role="status"
                                    className="text-sm text-emerald-700"
                                >
                                    {success}
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={!hasChanged || saving}
                                    className="flex-1 px-6 py-2 rounded-lg bg-primary text-on-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving
                                        ? t("statusUpdate.saving")
                                        : t("statusUpdate.save")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedStatus(order.status)
                                    }
                                    disabled={!hasChanged || saving}
                                    className="px-6 py-2 rounded-lg border border-outline-variant disabled:opacity-50"
                                >
                                    {t("statusUpdate.reset")}
                                </button>
                            </div>
                        </form>
                    </section>
                </aside>
            </div>
        </>
    );
};

export default UpdateOrderStatus;
