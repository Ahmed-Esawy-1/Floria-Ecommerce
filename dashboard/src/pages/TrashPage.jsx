import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { toast } from "sonner";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import ColorIcon from "@mui/icons-material/ColorLens";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import DeletedModal from "../components/DeleteModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "@/api/config";

const iconMap = {
    product: Inventory2Icon,
    category: CategoryIcon,
    occasion: EventIcon,
    user: PersonIcon,
    color: ColorIcon,
};

//  Props:
//        endpoint        => End Point to: Fetch the Inactive Items [Products, Categories, Occasions, Users]
//        backPath        => The list page this trash belongs to (e.g. "/products") & For Bulk Operation
//        type            => Icon lookup key: product | category | occasion | user & For Single Operation

const TrashPage = ({ endpoint, backPath, type }) => {
    const { language } = useLanguage();
    const { t } = useTranslation("trash");
    const Icon = iconMap[type];

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Bulk Select
    const [selectMode, setSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [deleteMode, setDeleteMode] = useState("single"); // single | bulk
    const [deleteId, setDeleteId] = useState(null);

    const title = t(`types.${type}.title`);
    const subtitle = t(`types.${type}.subtitle`);
    const backLabel = t(`types.${type}.backLabel`);

    // Fetch Trash Items
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const { data } = await api.get(endpoint);
                setItems(data);
            } catch (err) {
                toast.error(t("toast.loadFailed"));
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [endpoint]);

    // -- Checkbox ----------------------------------------------------------------------
    const allSelected =
        items.length > 0 && selectedItems.length === items.length;
    const someSelected = selectedItems.length > 0 && !allSelected;

    function toggleSelect(id) {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    }

    function handleSelectAll() {
        setSelectedItems(allSelected ? [] : items.map((i) => i.id));
    }

    function exitSelectMode() {
        setSelectMode(false);
        setSelectedItems([]);
    }

    // -- Modal ----------------------------------------------------------------------
    function openSingleDelete(id) {
        setDeleteMode("single");
        setDeleteId(id);
        setOpenModal(true);
    }

    function openBulkDelete() {
        setDeleteMode("bulk");
        setOpenModal(true);
    }

    function closeModal() {
        setOpenModal(false);
        setDeleteId(null);
    }

    // -- Restore ----------------------------------------------------------------------
    async function handleRestore(id) {
        try {
            await api.patch(`${type}/restore/${id}`);
            setItems((prev) => prev.filter((i) => i.id !== id));
            setSelectedItems((prev) => prev.filter((x) => x !== id));
            toast.success(t("toast.restoreSuccess"));
        } catch (err) {
            toast.error(t("toast.restoreFailed"));
        }
    }

    async function handleBulkRestore() {
        try {
            await api.patch(`${backPath}/restore/bulk`, selectedItems);
            setItems((prev) =>
                prev.filter((i) => !selectedItems.includes(i.id)),
            );
            setSelectedItems([]);
            toast.success(t("toast.bulkRestoreSuccess"));
        } catch (err) {
            toast.error(t("toast.bulkRestoreFailed"));
        }
    }

    // -- Delete ----------------------------------------------------------------------
    async function handleDelete(id) {
        try {
            await api.delete(`${type}/delete/${id}/permanent`);
            setItems((prev) => prev.filter((i) => i.id !== id));
            setSelectedItems((prev) => prev.filter((x) => x !== id));
            toast.success(t("toast.deleteSuccess"));
        } catch (err) {
            toast.error(t("toast.deleteFailed"));
        } finally {
            closeModal();
        }
    }

    async function handleBulkDelete() {
        try {
            await api.delete(`${backPath}/delete/permanent/bulk`, {
                data: selectedItems,
            });
            setItems((prev) =>
                prev.filter((i) => !selectedItems.includes(i.id)),
            );
            setSelectedItems([]);
            toast.success(t("toast.bulkDeleteSuccess"));
        } catch (err) {
            toast.error(t("toast.bulkDeleteFailed"));
        } finally {
            closeModal();
        }
    }

    //  Confirm Router
    function handleConfirm() {
        if (deleteMode === "bulk") {
            handleBulkDelete();
        } else {
            handleDelete(deleteId);
        }
    }

    //  Modal Name
    const modalName =
        deleteMode === "single"
            ? (items.find((i) => i.id === deleteId)?.userName ??
              items.find((i) => i.id === deleteId)?.nameEn ??
              t("modal.item"))
            : t("modal.selected", { count: selectedItems.length });

    return (
        <section className="p-4 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    {backPath && backLabel && (
                        <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                            <Link
                                to={backPath}
                                className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                            >
                                {backLabel}
                            </Link>
                            <ChevronRightIcon
                                fontSize="small"
                                className="rtl:rotate-180"
                            />
                            <span className="text-indigo-600 font-bold">
                                {t("breadcrumb")}
                            </span>
                        </nav>
                    )}
                    <h2 className="text-on-surface">{title}</h2>
                    {subtitle && (
                        <p className="page-subtitle mt-1">{subtitle}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {selectMode ? (
                        <button
                            onClick={exitSelectMode}
                            className="flex items-center gap-1 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:opacity-90 transition-all"
                        >
                            <CloseIcon fontSize="small" />
                            {t("buttons.cancel")}
                        </button>
                    ) : (
                        <button
                            onClick={() => setSelectMode(true)}
                            className="flex items-center gap-1 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:opacity-90 transition-all"
                        >
                            <ChecklistIcon fontSize="small" />
                            {t("buttons.select")}
                        </button>
                    )}
                </div>
            </div>

            {/* Count */}
            <div className="glass-card p-4 rounded-xl">
                <p className="text-sm text-on-surface-variant">
                    {t("stats.pendingDeletion")}
                </p>
                <h3 className="text-3xl font-bold">{items.length}</h3>
            </div>

            {/* BULK ACTION BAR */}
            {selectMode && selectedItems.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-primary/10 px-4 py-3 rounded-xl border border-outline-variant">
                    <span className="text-sm font-medium text-on-surface">
                        {t("bulk.selected", { count: selectedItems.length })}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBulkRestore}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary border border-primary/30 hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <RestoreIcon className="!text-sm" />
                            {t("buttons.restoreSelected")}
                        </button>
                        <button
                            onClick={openBulkDelete}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-error border border-error/30 hover:bg-error/10 rounded-lg transition-colors"
                        >
                            <DeleteForeverIcon className="!text-sm" />
                            {t("buttons.deletePermanently")}
                        </button>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <div className="bg-surface-container rounded-xl overflow-hidden border border-surface-variant">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-variant ltr:text-left rtl:text-right">
                                {selectMode && (
                                    <th className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            ref={(el) => {
                                                if (el)
                                                    el.indeterminate =
                                                        someSelected;
                                            }}
                                            onChange={handleSelectAll}
                                            disabled={items.length === 0}
                                        />
                                    </th>
                                )}
                                <th className="p-4">{t("table.item")}</th>
                                <th className="p-4">{t("table.deletedAt")}</th>
                                <th className="p-4">{t("table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={selectMode ? 4 : 3}
                                        className="py-16 text-center"
                                    >
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : // NO ITEMS
                            items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={selectMode ? 4 : 3}
                                        className="py-16 text-center text-on-surface-variant"
                                    >
                                        {t("table.empty")}
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`ltr:text-left rtl:text-right border-b transition-colors ${selectedItems.includes(item.id) ? "bg-primary/5" : ""}`}
                                    >
                                        {selectMode && (
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        item.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(item.id)
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {item?.imageUrl && (
                                                    <img
                                                        alt={`${item.nameEn ?? item.userName} Image`}
                                                        className="w-10 h-10 shrink-0 object-cover border border-slate-200 rounded-lg"
                                                        src={`${BASE_URL}${item.imageUrl}`}
                                                    />
                                                )}
                                                {type === "color" &&
                                                    item?.hexCode && (
                                                        <div
                                                            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                                            style={{
                                                                background:
                                                                    item.hexCode,
                                                            }}
                                                        />
                                                    )}
                                                <p className="truncate">
                                                    {(language === "en"
                                                        ? item.nameEn
                                                        : item.nameAr) ??
                                                        item.userName}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {item.deletedAt
                                                ? new Date(
                                                      item.deletedAt,
                                                  ).toLocaleDateString()
                                                : t("table.recently")}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex  gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleRestore(item.id)
                                                    }
                                                    className="text-on-surface-variant hover:text-primary"
                                                >
                                                    <RestoreIcon />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openSingleDelete(
                                                            item.id,
                                                        )
                                                    }
                                                    className="text-on-surface-variant hover:text-error"
                                                >
                                                    <DeleteForeverIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <DeletedModal
                isOpen={openModal}
                onClose={closeModal}
                onConfirm={handleConfirm}
                mode="hard"
                name={modalName}
            />
        </section>
    );
};

export default TrashPage;
