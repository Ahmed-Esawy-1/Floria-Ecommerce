import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";
import DeletedModal from "@/components/DeleteModal";
import PageHeader from "@/components/PageHeader";
import CityFormModal from "./CityFormModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "@/constants/permissions";

const TABLE_HEADER = ["city", "nameEn", "nameAr", "deliveryPrice", "available"];

const Cities = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("cities");
    const { language } = useLanguage();
    const { hasPermission } = useAuth();

    // ---- STATE -----------------------------
    const [cities, setCities] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openDeletedModal, setOpenDeletedModal] = useState(false);
    const [deleteCity, setDeleteCity] = useState(null);

    const [search, setSearch] = useState("");

    const canManage =
        hasPermission(PERMISSIONS.UPDATE_CITY) ||
        hasPermission(PERMISSIONS.DELETE_CITY);

    const columnCount = TABLE_HEADER.length + (canManage ? 1 : 0);

    // ---- FETCH CITIES -------------------------------------------------------------------
    useEffect(() => {
        async function getCities() {
            try {
                const { data } = await api.get("cities");
                setCities(Array.isArray(data) ? data : []);
                setCities((prev) => [data, ...prev]);
            } catch (err) {
                console.error(err);
                toast.error(t("toast.fetchError"));
            }
        }
        getCities();
    }, [t]);

    // ---- FILTER -------------------------------------------------------------------------------
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return cities;
        return cities.filter(
            (c) =>
                (c.nameEn ?? "").toLowerCase().includes(q) ||
                (c.nameAr ?? "").toLowerCase().includes(q),
        );
    }, [search, cities]);

    // --- ACTIONS --------------------------------------------------------
    const handleAdd = async (form) => {
        try {
            const { data } = await api.post("/city/add", form);
            setCities((prev) => [data, ...prev]);
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
            const { data } = await api.put(`/city/update/${editData.id}`, form);
            setCities((prev) => prev.map((c) => (c.id === data.id ? data : c)));
            toast.success(t("toast.updateSuccess"));
            setEditData(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.updateError"));
            throw err;
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`city/delete/${deleteCity.id}/permanent`);
            setCities((prev) => prev.filter((c) => c.id !== deleteCity.id));
            const name =
                language === "en" ? deleteCity.nameEn : deleteCity.nameAr;
            toast.success(
                t("toast.deleteSuccess", {
                    name: name,
                }),
            );
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.deleteError"));
        } finally {
            setOpenDeletedModal(false);
            setDeleteCity(null);
        }
    };

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex gap-2">
                    <Can permission={PERMISSIONS.CREATE_CITY}>
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
                                {
                                    count: filtered.length,
                                },
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
                                            <LocationCityIcon className="!text-4xl opacity-30" />
                                            <p className="text-sm">
                                                {t("empty")}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((city) => (
                                    <tr
                                        key={city.id}
                                        className="hover:bg-surface-container-low transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <LocationCityIcon className="text-primary" />
                                        </td>

                                        {/* NAME En */}
                                        <td className="px-6 py-4">
                                            <p className="text-on-surface text-sm font-semibold">
                                                {city.nameEn}
                                            </p>
                                        </td>

                                        {/* NAME AR */}
                                        <td className="px-6 py-4">
                                            <p className="text-on-surface text-sm font-semibold">
                                                {city.nameAr}
                                            </p>
                                        </td>

                                        {/* PRICE */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-on-surface font-semibold">
                                                    {city.deliveryPrice}
                                                </span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                                    EGP
                                                </span>
                                            </div>
                                        </td>

                                        {/* AVAILABLE */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                    city.available
                                                        ? "bg-success-container text-on-success-container"
                                                        : "bg-error-container text-on-error-container"
                                                }`}
                                            >
                                                {city.available
                                                    ? t("available.yes")
                                                    : t("available.no")}
                                            </span>
                                        </td>

                                        {/* BUTTONS */}
                                        {canManage && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Can
                                                    permission={
                                                        PERMISSIONS.UPDATE_CITY
                                                    }
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setEditData(city);
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                </Can>
                                                <Can
                                                    permission={
                                                        PERMISSIONS.DELETE_CITY
                                                    }
                                                >
                                                    <button
                                                        className="ml-2 text-on-surface hover:text-error transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setDeleteCity(city);
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD | EDIT MODAL */}
            <Can anyOf={[PERMISSIONS.CREATE_CITY, PERMISSIONS.UPDATE_CITY]}>
                <CityFormModal
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
            <Can permission={PERMISSIONS.DELETE_CITY}>
                {openDeletedModal && deleteCity && (
                    <DeletedModal
                        isOpen={openDeletedModal}
                        name={
                            language === "en"
                                ? deleteCity.nameEn
                                : deleteCity.nameAr
                        }
                        onClose={() => {
                            setOpenDeletedModal(false);
                            setDeleteCity(null);
                        }}
                        onConfirm={handleDelete}
                        mode="permanent"
                    />
                )}
            </Can>
        </>
    );
};

export default Cities;
