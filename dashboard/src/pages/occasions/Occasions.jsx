import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axios";
import CollectionCard from "@/components/CollectionCard";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import DeletedModal from "@/components/DeleteModal";
import PageHeader from "@/components/PageHeader";
import CollectionFormModal from "@/components/CollectionFormModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EventIcon from "@mui/icons-material/Event";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 6;

const Occasions = () => {
    const { t: tMain } = useTranslation();
    const { t } = useTranslation("occasions");
    const { language } = useLanguage();

    const [allOccasions, setAllOccasions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Form Modal
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editOccasion, setEditOccasion] = useState(null); // null => Create Mode

    //  Delete Modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteOccasion, setDeleteOccasion] = useState(null);

    // ---- FETCH OCCASIONS -----------------------------------------------------------------------
    useEffect(() => {
        async function getOccasions() {
            try {
                setLoading(true);
                const { data } = await api.get("/occasions");
                setAllOccasions(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getOccasions();
    }, []);

    // Reset Page on Search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Scroll to Top When Page Change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // ---- FILTER -----------------------------------------------------------------------
    const filteredOccasions = useMemo(() => {
        if (!searchQuery.trim()) return allOccasions;
        return allOccasions.filter(
            (o) =>
                o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.nameAr?.includes(searchQuery),
        );
    }, [allOccasions, searchQuery]);

    // ---- PAGINATION -----------------------------------------------------------------------
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOccasions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredOccasions, currentPage]);

    const startIndex =
        filteredOccasions.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(
        currentPage * ITEMS_PER_PAGE,
        filteredOccasions.length,
    );

    // ---- MODAL -----------------------------------------------------------------------
    // Create
    const handleOpenCreate = () => {
        setEditOccasion(null);
        setFormModalOpen(true);
    };

    // Edit
    const handleOpenEdit = (occasion) => {
        setEditOccasion(occasion);
        setFormModalOpen(true);
    };

    // ---- SUBMIT SUCCESS -----------------------------------------------------------------------
    const handleFormSuccess = (saved, mode) => {
        if (mode === "create") {
            setAllOccasions((prev) => [saved, ...prev]);
            toast.success(t("toast.createSuccess"));
        } else {
            setAllOccasions((prev) =>
                prev.map((o) => (o.id === saved.id ? { ...o, ...saved } : o)),
            );
            toast.success(t("toast.updateSuccess"));
        }
    };

    // ---- DELETE -----------------------------------------------------------------------
    async function handleDeleteOccasion() {
        if (!deleteOccasion) return;
        try {
            await api.delete(`occasion/delete/${deleteOccasion.id}`);
            setAllOccasions((prev) =>
                prev.filter((o) => o.id !== deleteOccasion.id),
            );
            setOpenDeleteModal(false);
            setDeleteOccasion(null);
            toast.success(t("toast.deleteSuccess"));
        } catch (error) {
            toast.error(t("toast.deleteError"));
        }
    }

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex gap-2">
                    <Can permission={PERMISSIONS.DELETE_OCCASION}>
                        <Link
                            to="/occasions/trash"
                            className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
                        >
                            {tMain("trash")}
                        </Link>
                    </Can>
                    <Can permission={PERMISSIONS.CREATE_OCCASION}>
                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all"
                        >
                            {t("create")}
                        </button>
                    </Can>
                </div>
            </PageHeader>

            {/* LOADING */}
            {loading ? (
                <Loading />
            ) : (
                <>
                    {/* FILTER */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                        <div className="flex gap-2 w-full md:max-w-md">
                            <div className="relative flex-1">
                                <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                                <input
                                    type="text"
                                    placeholder={t("filter")}
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        setSearchQuery(e.target.value);
                                    }}
                                    className="w-full bg-surface-container-lowest outline-none border border-surface-variant focus:border-primary rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                                />
                            </div>
                        </div>
                        {filteredOccasions.length > 0 && (
                            <div className="text-body-sm text-on-surface-variant">
                                {t("showing", {
                                    from: startIndex,
                                    to: endIndex,
                                    total: filteredOccasions.length,
                                })}{" "}
                                <span className="text-on-surface font-semibold">
                                    {t(searchQuery ? "results" : "occasions")}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* NOT FOUND */}
                    {filteredOccasions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 mb-6 border border-dashed border-outline-variant rounded-xl">
                            <EventIcon
                                style={{ fontSize: 40 }}
                                className="text-outline-variant mb-3"
                            />
                            <h3 className="text-on-surface text-lg font-semibold mb-1">
                                {t("empty.title")}
                            </h3>
                            <p className="text-on-surface-variant text-sm mb-4">
                                {t("empty.subtitle")}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchInput("");
                                        setSearchQuery("");
                                    }}
                                    className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors text-sm"
                                >
                                    {t("empty.clear")}
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {currentItems.map((occasion) => (
                                    <CollectionCard
                                        key={occasion.id}
                                        data={occasion}
                                        fallbackIcon={EventIcon}
                                        type="occasion"
                                        setDeletedata={setDeleteOccasion}
                                        setOpenDeletedModal={setOpenDeleteModal}
                                        onEdit={handleOpenEdit}
                                        permissions={{
                                            edit: PERMISSIONS.UPDATE_OCCASION,
                                            delete: PERMISSIONS.DELETE_OCCASION,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            <Pagination
                                itemsPerPage={ITEMS_PER_PAGE}
                                maxVisiblePages={MAX_VISIBLE_PAGES}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalItems={filteredOccasions.length}
                                loading={loading}
                            />
                        </>
                    )}
                </>
            )}

            {/* CREATE | EDIT MODAL */}
            <Can
                anyOf={[
                    PERMISSIONS.CREATE_OCCASION,
                    PERMISSIONS.UPDATE_OCCASION,
                ]}
            >
                <CollectionFormModal
                    isOpen={formModalOpen}
                    onClose={() => setFormModalOpen(false)}
                    onSuccess={handleFormSuccess}
                    type="occasion"
                    editData={editOccasion}
                />
            </Can>

            {/* DELETE MODAL */}
            <Can permission={PERMISSIONS.DELETE_OCCASION}>
                {openDeleteModal && deleteOccasion && (
                    <DeletedModal
                        isOpen={openDeleteModal}
                        name={
                            language === "en"
                                ? deleteOccasion.nameEn
                                : deleteOccasion.nameAr
                        }
                        onClose={() => {
                            setOpenDeleteModal(false);
                            setDeleteOccasion(null);
                        }}
                        onConfirm={handleDeleteOccasion}
                        status="soft"
                    />
                )}
            </Can>
        </>
    );
};

export default Occasions;
