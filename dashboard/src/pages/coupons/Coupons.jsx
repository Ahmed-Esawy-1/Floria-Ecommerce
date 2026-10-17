import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";
import DeletedModal from "@/components/DeleteModal";
import PageHeader from "@/components/PageHeader";
import CouponFormModal from "./CouponFormModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useTranslation } from "react-i18next";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";

const TABLE_HEADER = [
    "code",
    "usage",
    "discount",
    "minOrder",
    "expiry",
    "status",
];

// active | expired | inactive
function getStatus(coupon) {
    if (coupon.endAt && new Date(coupon.endAt) < new Date()) {
        return "expired";
    }
    return coupon.active ? "active" : "inactive";
}

const STATUS_STYLES = {
    active: "bg-success-container text-on-success-container",
    expired: "bg-surface-container-high text-on-surface-variant",
    inactive: "bg-error-container text-on-error-container",
};

const Coupons = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("coupons");
    const { language } = useLanguage();
    const { hasPermission } = useAuth();

    // ---- STATE -----------------------------
    const [coupons, setCoupons] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openDeletedModal, setOpenDeletedModal] = useState(false);
    const [deleteCoupon, setDeleteCoupon] = useState(null);

    const [search, setSearch] = useState("");

    const canManage =
        hasPermission(PERMISSIONS.UPDATE_COUPON) ||
        hasPermission(PERMISSIONS.DELETE_COUPON);

    const columnCount = TABLE_HEADER.length + (canManage ? 1 : 0);

    // ---- FETCH COUPONS -------------------------------------------------------------------
    async function fetchCoupons() {
        try {
            const { data } = await api.get("coupons");
            setCoupons(data);
        } catch (err) {
            console.error(err);
            toast.error(t("toast.fetchError"));
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [t]);

    // ---- FILTER -------------------------------------------------------------------------------
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return coupons.filter((c) => c.code?.toLowerCase().includes(q));
    }, [search, coupons]);

    // --- ACTIONS --------------------------------------------------------
    const handleAdd = async (form) => {
        try {
            await api.post("/coupon/create", form);
            await fetchCoupons();
            toast.success(t("toast.createSuccess"));
            setModalOpen(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.message || t("toast.createError"),
            );
            throw error;
        }
    };

    const handleEdit = async (form) => {
        try {
            await api.put(`/coupon/update/${editData.id}`, form);
            await fetchCoupons();
            toast.success(t("toast.updateSuccess"));
            setEditData(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.updateError"));
            throw err;
        }
    };

    const openEdit = async (coupon) => {
        try {
            const { data } = await api.get(`/coupon/${coupon.id}`);
            setEditData(data);
            setModalOpen(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.fetchError"));
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/coupon/delete/${deleteCoupon.id}/permanent`);
            setCoupons((prev) => prev.filter((c) => c.id !== deleteCoupon.id));
            toast.success(
                t("toast.deleteSuccess", { name: deleteCoupon.code }),
            );
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.deleteError"));
        } finally {
            setOpenDeletedModal(false);
            setDeleteCoupon(null);
        }
    };

    const formatDate = (value) =>
        value
            ? new Date(value).toLocaleDateString(
                  language === "ar" ? "ar-EG" : "en-GB",
              )
            : "—";

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex gap-2">
                    <Can permission={PERMISSIONS.CREATE_COUPON}>
                        <button
                            onClick={() => {
                                setEditData(null);
                                setModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                        >
                            <AddIcon fontSize="small" />
                            {t("add")}
                        </button>
                    </Can>
                </div>
            </PageHeader>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                {/* FILTER */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
                    <div className="relative w-full sm:w-72">
                        <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                        <input
                            type="text"
                            placeholder={t("filter")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-outline"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-outline">
                            {t(
                                filtered.length > 1
                                    ? "count_other"
                                    : "count_one",
                                { count: filtered.length },
                            )}
                        </span>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                            <DownloadIcon />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                            <PrintIcon />
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low ltr:text-left rtl:text-right">
                                {TABLE_HEADER.map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-4 text-on-surface-variant text-sm font-medium border-b border-outline-variant"
                                    >
                                        {t(`table.${h}`)}
                                    </th>
                                ))}
                                {canManage && (
                                    <th className="px-6 py-4 text-on-surface-variant text-sm font-medium border-b border-outline-variant">
                                        {tCommon("actions")}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant ltr:text-left rtl:text-right">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-outline">
                                            <ConfirmationNumberIcon className="!text-4xl opacity-30" />
                                            <p className="text-sm">
                                                {t("empty")}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((coupon) => {
                                    const status = getStatus(coupon);
                                    return (
                                        <tr
                                            key={coupon.id}
                                            className="hover:bg-surface-container-low transition-colors group"
                                        >
                                            {/* CODE */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <ConfirmationNumberIcon className="text-primary" />
                                                    <p className="text-on-surface text-sm font-semibold tracking-wide">
                                                        {coupon.code}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* CODE */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-on-surface text-sm font-semibold tracking-wide">
                                                        {coupon.usage}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* DISCOUNT */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-on-surface font-semibold">
                                                        {coupon.discountValue}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                                        {coupon.discountType ===
                                                        "PERCENTAGE"
                                                            ? "%"
                                                            : "EGP"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* MIN ORDER */}
                                            <td className="px-6 py-4">
                                                {coupon.minimumOrderAmount ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-on-surface text-sm">
                                                            {
                                                                coupon.minimumOrderAmount
                                                            }
                                                        </span>
                                                        <span className="text-xs text-outline">
                                                            EGP
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-outline">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* EXPIRY */}
                                            <td className="px-6 py-4 text-sm text-on-surface">
                                                {formatDate(coupon.endAt)}
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}
                                                >
                                                    {t(`status.${status}`)}
                                                </span>
                                            </td>

                                            {/* BUTTONS */}
                                            {canManage && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Can
                                                        permission={
                                                            PERMISSIONS.UPDATE_COUPON
                                                        }
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                openEdit(coupon)
                                                            }
                                                            className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                    </Can>
                                                    <Can
                                                        permission={
                                                            PERMISSIONS.DELETE_COUPON
                                                        }
                                                    >
                                                        <button
                                                            className="ml-2 text-on-surface hover:text-error transition-colors cursor-pointer"
                                                            onClick={() => {
                                                                setDeleteCoupon(
                                                                    coupon,
                                                                );
                                                                setOpenDeletedModal(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </Can>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD | EDIT MODAL */}
            <Can anyOf={[PERMISSIONS.CREATE_COUPON, PERMISSIONS.UPDATE_COUPON]}>
                <CouponFormModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setEditData(null);
                    }}
                    onSaved={editData ? handleEdit : handleAdd}
                    editData={editData}
                />
            </Can>

            {/* DELETE MODAL */}
            <Can permission={PERMISSIONS.DELETE_COUPON}>
                {openDeletedModal && deleteCoupon && (
                    <DeletedModal
                        isOpen={openDeletedModal}
                        name={deleteCoupon.code}
                        onClose={() => {
                            setOpenDeletedModal(false);
                            setDeleteCoupon(null);
                        }}
                        onConfirm={handleDelete}
                        mode="permanent"
                    />
                )}
            </Can>
        </>
    );
};

export default Coupons;
