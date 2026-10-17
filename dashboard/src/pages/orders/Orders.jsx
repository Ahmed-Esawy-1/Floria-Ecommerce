import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import api from "@/api/axios";
import DeletedModal from "@/components/DeleteModal";
import Pagination from "@/components/Pagination";
import { resolveImageUrl } from "@/helpers/resolveImageUrl";
import { useLanguage } from "@/contexts/LanguageContext";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

import {
    ORDERS_PER_PAGE,
    MAX_VISIBLE_PAGES,
    ALL_STATUSES,
    STATUS_OPTIONS,
    STATUS_STYLES,
    TABLE_HEADER,
    DEFAULT_AVATAR,
} from "./constants";
import { toast } from "sonner";

const Orders = () => {
    const { t } = useTranslation("orders");
    const navigate = useNavigate();
    const { language } = useLanguage();

    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(ALL_STATUSES);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [openDeletedModal, setOpenDeletedModal] = useState(false);
    const [deleteOrder, setDeleteOrder] = useState(null);

    // ---- LOAD ORDERS ----
    useEffect(() => {
        const controller = new AbortController();

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const statusParam =
                    selectedStatus !== ALL_STATUSES
                        ? `&status=${selectedStatus}`
                        : "";
                const { data } = await api.get(
                    `/orders?page=${currentPage - 1}&size=${ORDERS_PER_PAGE}${statusParam}`,
                    { signal: controller.signal },
                );
                setOrders(data.content);
                setTotalOrders(data.totalElements);
            } catch (error) {
                if (controller.signal.aborted) return;
                console.error("Failed to fetch orders:", error);
                setOrders([]);
                setTotalOrders(0);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchOrders();
        return () => controller.abort();
    }, [currentPage, selectedStatus, refreshKey]);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    const clearFilter = () => {
        setSelectedStatus(ALL_STATUSES);
        setCurrentPage(1);
    };

    const handleOpenDelete = (order) => {
        setDeleteOrder(order);
        setOpenDeletedModal(true);
    };

    const closeDeleteModal = () => {
        setOpenDeletedModal(false);
        setDeleteOrder(null);
    };

    // ---- DELETE ORDER ----
    const handleDeleteOrder = async () => {
        if (!deleteOrder) return;
        try {
            await api.delete(`/order/delete/${deleteOrder.id}/permanent`);

            toast.success(t("toast.deleteSuccess"));

            const newTotalPages = Math.max(
                1,
                Math.ceil((totalOrders - 1) / ORDERS_PER_PAGE),
            );

            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
            } else {
                setRefreshKey((k) => k + 1);
            }
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error(
                error.response?.data?.message || t("toast.deleteError"),
            );
        }
    };

    const startIndex =
        totalOrders === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * ORDERS_PER_PAGE, totalOrders);
    const hasResults = !loading && orders.length > 0;
    const noResults = !loading && orders.length === 0;
    const statusLabel =
        selectedStatus !== ALL_STATUSES
            ? t(`status.${selectedStatus.toLowerCase()}`)
            : "";

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="page-title">{t("title")}</h1>
                <p className="page-subtitle">{t("subtitle")}</p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                {/* FILTER */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <FilterAltIcon className="absolute start-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                            <select
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                aria-label={t("table.filter")}
                                className="ps-10 pe-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg appearance-none"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s === ALL_STATUSES
                                            ? t("table.filter")
                                            : t(`status.${s.toLowerCase()}`)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {totalOrders > 0 && (
                            <p className="text-on-surface-variant text-sm whitespace-nowrap hidden sm:block">
                                {t("table.showingResults", {
                                    from: startIndex,
                                    to: endIndex,
                                    total: totalOrders,
                                })}
                                {statusLabel && (
                                    <span className="ms-2 text-primary font-medium">
                                        ({statusLabel})
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled
                            aria-label={t("actions.export")}
                            className="p-2 text-on-surface-variant rounded-lg opacity-50 cursor-not-allowed"
                        >
                            <DownloadIcon />
                        </button>
                        <button
                            type="button"
                            disabled
                            aria-label={t("actions.print")}
                            className="p-2 text-on-surface-variant rounded-lg opacity-50 cursor-not-allowed"
                        >
                            <PrintIcon />
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-[860px] w-full border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-start">
                                {TABLE_HEADER.map((h) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-4 text-on-surface-variant border-b border-outline-variant text-start ${
                                            h === "actions" ? "text-end" : ""
                                        }`}
                                    >
                                        {t(`table.${h}`)}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-outline-variant">
                            {/* LOADING */}
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={TABLE_HEADER.length}
                                        className="py-20"
                                    >
                                        <div className="flex justify-center items-center">
                                            <div
                                                role="status"
                                                aria-label={t("table.loading")}
                                                className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* EMPTY */}
                            {noResults && (
                                <tr>
                                    <td
                                        colSpan={TABLE_HEADER.length}
                                        className="py-16"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                                            <ShoppingBagIcon fontSize="large" />
                                            <p>
                                                {t("table.noOrders")}
                                                {statusLabel &&
                                                    ` ${t("table.forStatus", { status: statusLabel })}`}
                                            </p>
                                            {selectedStatus !==
                                                ALL_STATUSES && (
                                                <button
                                                    type="button"
                                                    onClick={clearFilter}
                                                    className="text-primary underline text-sm"
                                                >
                                                    {t("table.clearFilter")}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* ROWS */}
                            {hasResults &&
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-surface-container-low transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-primary font-bold">
                                            <span dir="ltr">
                                                #{order.orderId}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        order.customerImage
                                                            ? resolveImageUrl(
                                                                  order.customerImage,
                                                              )
                                                            : DEFAULT_AVATAR
                                                    }
                                                    onError={(e) => {
                                                        e.currentTarget.onerror =
                                                            null;
                                                        e.currentTarget.src =
                                                            DEFAULT_AVATAR;
                                                    }}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-on-surface leading-5">
                                                        {order.fullName}
                                                    </p>
                                                    <p
                                                        className="text-on-surface-variant text-xs"
                                                        dir="ltr"
                                                    >
                                                        {order.customerEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-on-surface font-medium">
                                            {order.createdAt?.split("T")[0]}
                                        </td>

                                        <td className="px-6 py-4 text-on-surface font-medium">
                                            {order.totalPrice}{" "}
                                            {t("table.pound")}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    STATUS_STYLES[
                                                        order.status
                                                    ] ?? STATUS_STYLES.PENDING
                                                }`}
                                            >
                                                {t(
                                                    `status.${order.status?.toLowerCase()}`,
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-on-surface font-medium">
                                            {language == "en"
                                                ? order.cityNameEn
                                                : order.cityNameAr}
                                        </td>

                                        <td className="px-6 py-4 text-end">
                                            {/* Always visible on touch screens; hover-only on large screens */}
                                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    aria-label={t(
                                                        "actions.view",
                                                    )}
                                                    className="p-1 hover:text-primary transition-colors"
                                                >
                                                    <VisibilityIcon fontSize="medium" />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={t(
                                                        "actions.edit",
                                                    )}
                                                    onClick={() =>
                                                        navigate(
                                                            `/orders/${order.id}/edit/status`,
                                                        )
                                                    }
                                                    className="p-1 hover:text-primary transition-colors"
                                                >
                                                    <EditIcon fontSize="medium" />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={t(
                                                        "actions.delete",
                                                    )}
                                                    onClick={() =>
                                                        handleOpenDelete(order)
                                                    }
                                                    className="p-1 hover:text-red-500 transition-colors"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    itemsPerPage={ORDERS_PER_PAGE}
                    maxVisiblePages={MAX_VISIBLE_PAGES}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalOrders}
                    loading={loading}
                />
            </div>

            {openDeletedModal && deleteOrder && (
                <DeletedModal
                    isOpen={openDeletedModal}
                    name={`#${deleteOrder.orderId}`}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteOrder}
                    mode="hard"
                />
            )}
        </>
    );
};

export default Orders;
