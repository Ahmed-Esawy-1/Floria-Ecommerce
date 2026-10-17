import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";
import api from "@/api/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import Loading from "@/components/Loading";
import CollectionCard from "@/components/CollectionCard";
import DeletedModal from "@/components/DeleteModal";
import Pagination from "@/components/Pagination";
import PageHeader from "@/components/PageHeader";
import CollectionFormModal from "@/components/CollectionFormModal";

import CategoryIcon from "@mui/icons-material/Category";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 6;

const Categories = () => {
    const { t: tCommon } = useTranslation();
    const { t } = useTranslation("categories");
    const { language } = useLanguage();

    // ---- STATE -------------------------------------
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Form Modal
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null); // null => create mode

    // Delete Modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState(null);

    // ---- FETCH Categories --------------------------------------
    useEffect(() => {
        async function getCategories() {
            try {
                setLoading(true);
                const { data } = await api.get("/categories");
                setCategories(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getCategories();
    }, []);

    // Reset Page on Search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Scroll to Top When Page Change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    //---- FILTER ----------------------------------------------------------------------------------
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        return categories.filter(
            (c) =>
                c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.nameAr?.includes(searchQuery),
        );
    }, [categories, searchQuery]);

    //---- PAGINATION ----------------------------------------------------------------------------------
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredCategories, currentPage]);

    const startIndex =
        filteredCategories.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(
        currentPage * ITEMS_PER_PAGE,
        filteredCategories.length,
    );

    // ---- MODAL -----------------------------------------------------------------------------------------------------------
    // Create
    const handleOpenCreate = () => {
        setEditCategory(null);
        setFormModalOpen(true);
    };

    // Edit
    const handleOpenEdit = (category) => {
        setEditCategory(category);
        setFormModalOpen(true);
    };

    // ---- FORM SUCCESS -----------------------------------------------------------------------------------------
    const handleFormSuccess = (saved, mode) => {
        if (mode === "create") {
            setCategories((prev) => [saved, ...prev]);
            toast.success(t("toast.createSuccess"));
        } else {
            setCategories((prev) =>
                prev.map((c) => (c.id === saved.id ? { ...c, ...saved } : c)),
            );
            toast.success(t("toast.updateSuccess"));
        }
    };

    //---- DELETE ----------------------------------------------------------------------------------
    async function handleDeleteCategory() {
        if (!deleteCategory) return;
        try {
            await api.delete(`category/delete/${deleteCategory.id}`);

            setCategories((prev) => {
                const updated = prev.filter((c) => c.id !== deleteCategory.id);

                const newFilteredLen = searchQuery.trim()
                    ? updated.filter(
                          (c) =>
                              c.name
                                  ?.toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                              c.nameEn
                                  ?.toLowerCase()
                                  .includes(searchQuery.toLowerCase()),
                      ).length
                    : updated.length;

                const newTotalPages = Math.max(
                    1,
                    Math.ceil(newFilteredLen / ITEMS_PER_PAGE),
                );
                if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

                return updated;
            });

            setDeleteCategory(null);
            setOpenDeleteModal(false);
            toast.success(t("toast.deleteSuccess"));
        } catch (error) {
            console.log(error);
            toast.error(t("toast.deleteError"));
        }
    }

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex gap-2">
                    <Can permission={PERMISSIONS.DELETE_CATEGORY}>
                        <Link
                            to="/categories/trash"
                            className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
                        >
                            {tCommon("trash")}
                        </Link>
                    </Can>
                    <Can permission={PERMISSIONS.CREATE_CATEGORY}>
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
                        {filteredCategories.length > 0 && (
                            <div className="text-body-sm text-on-surface-variant">
                                {t("showing", {
                                    from: startIndex,
                                    to: endIndex,
                                    total: filteredCategories.length,
                                })}{" "}
                                <span className="text-on-surface font-semibold">
                                    {t(searchQuery ? "results" : "categories")}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* NOT FOUND */}
                    {filteredCategories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 mb-6 border border-dashed border-outline-variant rounded-xl">
                            <CategoryIcon
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
                                {currentItems.map((category) => (
                                    <CollectionCard
                                        key={category.id}
                                        data={category}
                                        fallbackIcon={CategoryIcon}
                                        type="category"
                                        setDeletedata={setDeleteCategory}
                                        setOpenDeletedModal={setOpenDeleteModal}
                                        onEdit={handleOpenEdit}
                                        permissions={{
                                            edit: PERMISSIONS.UPDATE_CATEGORY,
                                            delete: PERMISSIONS.DELETE_CATEGORY,
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
                                totalItems={filteredCategories.length}
                                loading={loading}
                            />
                        </>
                    )}
                </>
            )}

            {/* CREATE | EDIT MODAL */}
            <Can
                anyOf={[
                    PERMISSIONS.CREATE_CATEGORY,
                    PERMISSIONS.UPDATE_CATEGORY,
                ]}
            >
                <CollectionFormModal
                    isOpen={formModalOpen}
                    onClose={() => setFormModalOpen(false)}
                    onSuccess={handleFormSuccess}
                    type="category"
                    editData={editCategory}
                />
            </Can>

            {/* DELETE MODAL */}
            <Can permission={PERMISSIONS.DELETE_CATEGORY}>
                {openDeleteModal && deleteCategory && (
                    <DeletedModal
                        isOpen={openDeleteModal}
                        name={
                            language === "en"
                                ? deleteCategory.nameEn
                                : deleteCategory.nameAr
                        }
                        onClose={() => {
                            setOpenDeleteModal(false);
                            setDeleteCategory(null);
                        }}
                        status="trash"
                        onConfirm={handleDeleteCategory}
                    />
                )}
            </Can>
        </>
    );
};

export default Categories;
