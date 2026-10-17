import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";
import DeletedModal from "@/components/DeleteModal";
import PageHeader from "@/components/PageHeader";
import ColorFormModal from "./ColorFormModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";

const TABLE_HEADER = ["color", "nameEn", "nameAr", "hex"];

const Colors = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("colors");
    const { language } = useLanguage();
    const { hasPermission } = useAuth();

    // ---- STATE -----------------------------
    const [colors, setColors] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openDeletedModal, setOpenDeletedModal] = useState(false);
    const [deleteColor, setDeleteColor] = useState(null);

    const [search, setSearch] = useState("");

    const canManage =
        hasPermission(PERMISSIONS.UPDATE_COLOR) ||
        hasPermission(PERMISSIONS.DELETE_COLOR);

    const columnCount = TABLE_HEADER.length + (canManage ? 1 : 0);
    // ---- FETCH COLORS -------------------------------------------------------------------
    useEffect(() => {
        async function getColors() {
            try {
                const { data } = await api.get("colors");
                setColors(data);
            } catch (err) {
                console.error(err);
            }
        }
        getColors();
    }, []);

    // ---- FILTER -------------------------------------------------------------------------------
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return colors.filter(
            (c) =>
                c.nameEn.toLowerCase().includes(q) ||
                c.nameAr.toLowerCase().includes(q) ||
                c.hexCode?.toLowerCase().includes(q),
        );
    }, [search, colors]);

    // --- ACTIONS --------------------------------------------------------
    const handleAdd = async (form) => {
        try {
            const { data } = await api.post("/color/add", form);
            setColors((prev) => [data, ...prev]);
            toast.success(t("toast.createSuccess"));
        } catch (error) {
            toast.error(
                error?.response?.data?.message || t("toast.createError"),
            );
        }
    };

    const handleEdit = async (form) => {
        try {
            const { data } = await api.put(`color/update/${editData.id}`, form);
            setColors((prev) => [
                data,
                ...prev.filter((c) => c.id !== data.id),
            ]);
            toast.success(t("toast.updateSuccess"));
            setEditData(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.updateError"));
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`color/delete/${deleteColor.id}`);
            setColors((prev) => prev.filter((c) => c.id !== deleteColor.id));
            const name =
                language === "en" ? deleteColor.nameEn : deleteColor.nameAr;
            toast.success(
                t("toast.deleteSuccess", {
                    name: name,
                }),
            );
        } catch (err) {
            toast.error(err?.response?.data?.message || t("toast.deleteError"));
        } finally {
            setOpenDeletedModal(false);
            setDeleteColor(null);
        }
    };

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex gap-2">
                    <Can permission={PERMISSIONS.DELETE_COLOR}>
                        <Link
                            to="/colors/trash"
                            className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
                        >
                            {tCommon("trash")}
                        </Link>
                    </Can>
                    <Can permission={PERMISSIONS.CREATE_COLOR}>
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
                                            <PaletteIcon className="!text-4xl opacity-30" />
                                            <p className="text-sm">
                                                {t("empty")}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((color) => (
                                    <tr
                                        key={color.id}
                                        className="hover:bg-surface-container-low transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                                style={{
                                                    background: color.hexCode,
                                                }}
                                            />
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-on-surface text-sm font-semibold">
                                                {color.nameEn}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-on-surface text-sm font-semibold">
                                                {color.nameAr}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs px-2.5 py-1 bg-surface-container border border-outline-variant rounded-lg text-on-surface-variant">
                                                {color.hexCode}
                                            </span>
                                        </td>

                                        {canManage && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Can
                                                    permission={
                                                        PERMISSIONS.UPDATE_COLOR
                                                    }
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setEditData(color);
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                </Can>
                                                <Can
                                                    permission={
                                                        PERMISSIONS.DELETE_COLOR
                                                    }
                                                >
                                                    <button
                                                        className="ml-2 text-on-surface hover:text-error transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setDeleteColor(
                                                                color,
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD | EDIT MODAL */}
            <Can anyOf={[PERMISSIONS.CREATE_COLOR, PERMISSIONS.UPDATE_COLOR]}>
                <ColorFormModal
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
            <Can permission={PERMISSIONS.DELETE_COLOR}>
                {openDeletedModal && deleteColor && (
                    <DeletedModal
                        isOpen={openDeletedModal}
                        name={
                            language === "en"
                                ? deleteColor.nameEn
                                : deleteColor.nameAr
                        }
                        onClose={() => {
                            setOpenDeletedModal(false);
                            setDeleteColor(null);
                        }}
                        onConfirm={handleDelete}
                        mode="soft"
                    />
                )}
            </Can>
        </>
    );
};

export default Colors;
