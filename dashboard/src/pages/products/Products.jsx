import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
} from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import api from "@/api/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import DeletedModal from "@/components/DeleteModal";
import HoverRevealText from "@/components/HoverRevealText";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";
import { resolveImageUrl } from "@/helpers/resolveImageUrl";

import InventoryIcon from "@mui/icons-material/Inventory";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CloseIcon from "@mui/icons-material/Close";

const TABLE_HEADER = ["name", "description", "price"];

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 4;

const Products = () => {
    const { t: tCommon } = useTranslation();
    const { t } = useTranslation("products");
    const { language } = useLanguage();
    const { hasPermission } = useAuth();

    // ---- STATE ------------------------------------
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Single Delete
    const [openDeletedModal, setOpenDeletedModal] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(null);

    // Bulk Select
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const headerCheckboxRef = useRef(null);

    const canManage =
        hasPermission(PERMISSIONS.UPDATE_PRODUCT) ||
        hasPermission(PERMISSIONS.DELETE_PRODUCT);

    const columnCount =
        TABLE_HEADER.length + (selectMode ? 1 : 0) + (canManage ? 1 : 0);

    // ---- FETCH PRODUCTS  -----------------
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/products", {
                params: {
                    page: currentPage - 1,
                    size: ITEMS_PER_PAGE,
                    search: searchQuery.trim() || undefined,
                },
            });

            // If the current page became empty (e.g. last item deleted), go back one page
            if (data.content.length === 0 && currentPage > 1) {
                setCurrentPage((p) => p - 1);
                return;
            }

            setProducts(data.content);
            setTotalItems(data.totalElements);
        } catch (error) {
            console.error(error);
            toast.error(t("table.loadError"));
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, t]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to Page 1 When Search Changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const startIndex =
        totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    // Clear Selection when (page | search) Change
    useEffect(() => {
        setSelectedIds(new Set());
    }, [currentPage, searchQuery]);

    // ---- SELECTION HELPERS -----------------------------------------------
    const currentPageIds = useMemo(() => products.map((p) => p.id), [products]);

    const allOnPageSelected =
        currentPageIds.length > 0 &&
        currentPageIds.every((id) => selectedIds.has(id));
    const someOnPageSelected =
        currentPageIds.some((id) => selectedIds.has(id)) && !allOnPageSelected;

    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.indeterminate = someOnPageSelected;
        }
    }, [someOnPageSelected]);

    const toggleSelectAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allOnPageSelected) {
                currentPageIds.forEach((id) => next.delete(id));
            } else {
                currentPageIds.forEach((id) => next.add(id));
            }
            return next;
        });
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelectedIds(new Set());
    };

    // ---- DELETE ----------------------------------------------------------------------------
    async function handleDeleteProduct() {
        if (!deleteProduct) return;

        const productName =
            language === "en" ? deleteProduct.nameEn : deleteProduct.nameAr;

        try {
            await api.delete(`/product/delete/${deleteProduct.id}`);
            toast.success(t("toast.moveToTrashSuccess", { name: productName }));

            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(deleteProduct.id);
                return next;
            });

            await fetchProducts();
        } catch (error) {
            toast.error(t("toast.moveToTrashError", { name: productName }));
        } finally {
            setDeleteProduct(null);
            setOpenDeletedModal(false);
        }
    }

    async function handleBulkDelete() {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        setBulkDeleting(true);
        try {
            await api.delete("/products/delete/bulk", { data: ids });

            toast.success(
                t(
                    ids.length > 1
                        ? "toast.bulkMoveToTrashSuccess_other"
                        : "toast.bulkMoveToTrashSuccess_one",
                    { count: ids.length },
                ),
            );
            setSelectedIds(new Set());
            await fetchProducts();
        } catch (error) {
            toast.error(t("toast.bulkMoveToTrashError"));
        } finally {
            setBulkDeleting(false);
            setOpenBulkDeleteModal(false);
        }
    }

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex flex-wrap gap-2">
                    <Can permission={PERMISSIONS.DELETE_PRODUCT}>
                        {selectMode ? (
                            <button
                                onClick={exitSelectMode}
                                className="flex items-center gap-1 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:opacity-90 transition-all"
                            >
                                <CloseIcon fontSize="small" />
                                {tCommon("cancel")}
                            </button>
                        ) : (
                            <button
                                onClick={() => setSelectMode(true)}
                                className="flex items-center gap-1 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:opacity-90 transition-all"
                            >
                                <ChecklistIcon fontSize="small" />
                                {tCommon("select")}
                            </button>
                        )}
                    </Can>
                    <Can permission={PERMISSIONS.DELETE_PRODUCT}>
                        <Link
                            to="/products/trash"
                            className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
                        >
                            {tCommon("trash")}
                        </Link>
                    </Can>
                    <Can permission={PERMISSIONS.CREATE_PRODUCT}>
                        <Link
                            to="/products/create"
                            className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-all"
                        >
                            {t("create")}
                        </Link>
                    </Can>
                </div>
            </PageHeader>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                {/* FILTER */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
                    <div className="relative w-full sm:w-64">
                        <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                        <input
                            type="text"
                            placeholder={t("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-on-surface-variant sm:mr-2">
                            {totalItems === 0
                                ? t("noResults")
                                : t("showing", {
                                      start: startIndex,
                                      end: endIndex,
                                      count: totalItems,
                                  })}{" "}
                            {t(searchQuery.trim() ? "results" : "products")}
                        </span>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                            <DownloadIcon />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                            <PrintIcon />
                        </button>
                    </div>
                </div>

                {/* BULK ACTION BAR */}
                <Can permission={PERMISSIONS.DELETE_PRODUCT}>
                    {selectMode && selectedIds.size > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-primary/10 px-4 py-3 border-b border-outline-variant">
                            <span className="text-sm font-medium text-on-surface">
                                {selectedIds.size > 1
                                    ? t("selected_other", {
                                          count: selectedIds.size,
                                      })
                                    : t("selected_one", {
                                          count: selectedIds.size,
                                      })}
                            </span>
                            <button
                                onClick={() => setOpenBulkDeleteModal(true)}
                                disabled={bulkDeleting}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-error border border-error/30 hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <DeleteIcon className="!text-sm" />
                                {t("deleteSelected")}
                            </button>
                        </div>
                    )}
                </Can>

                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* TABLE */}
                {!loading && (
                    <div className="overflow-x-auto">
                        <table className="min-w-[850px] w-full text-left">
                            <thead>
                                <tr className="bg-surface-container-low text-left">
                                    {selectMode && (
                                        <th className="px-6 py-4 text-on-surface-variant border-b border-outline-variant">
                                            <input
                                                ref={headerCheckboxRef}
                                                className="text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                type="checkbox"
                                                checked={allOnPageSelected}
                                                onChange={toggleSelectAllOnPage}
                                                disabled={
                                                    currentPageIds.length === 0
                                                }
                                            />
                                        </th>
                                    )}
                                    {TABLE_HEADER.map((h) => (
                                        <th
                                            key={h}
                                            className="px-6 py-4 text-on-surface-variant border-b border-outline-variant ltr:text-left rtl:text-right"
                                        >
                                            {t(`table.${h}`)}
                                        </th>
                                    ))}
                                    {canManage && (
                                        <th className="px-6 py-4 text-on-surface-variant border-b border-outline-variant">
                                            {tCommon("actions")}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {/* NO PRODUCTS */}
                                {products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-6 py-16 text-center text-on-surface-variant"
                                        >
                                            <InventoryIcon
                                                style={{
                                                    fontSize: 40,
                                                    opacity: 0.3,
                                                }}
                                            />
                                            <p className="mt-3">
                                                {t("table.notFound")}
                                            </p>
                                            {searchQuery && (
                                                <button
                                                    className="mt-2 text-primary underline text-sm"
                                                    onClick={() =>
                                                        setSearchQuery("")
                                                    }
                                                >
                                                    {t("table.clear")}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    // PRODUCTS
                                    products.map((product) => (
                                        <tr
                                            className={`hover:bg-surface-container-low transition-colors ${
                                                selectedIds.has(product.id)
                                                    ? "bg-primary/5"
                                                    : ""
                                            }`}
                                            key={product.id}
                                        >
                                            {selectMode && (
                                                <td className="px-6 py-4">
                                                    <input
                                                        className="text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                        type="checkbox"
                                                        checked={selectedIds.has(
                                                            product.id,
                                                        )}
                                                        onChange={() =>
                                                            toggleSelectOne(
                                                                product.id,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        alt={`${product.nameEn} Image`}
                                                        className="w-10 h-10 shrink-0 object-cover border border-slate-200 rounded-lg"
                                                        src={resolveImageUrl(
                                                            product.primaryImageUrl,
                                                        )}
                                                    />
                                                    <div className="min-w-0 max-w-45">
                                                        <HoverRevealText
                                                            className="text-on-surface text-sm font-semibold w-full"
                                                            text={
                                                                language ===
                                                                "en"
                                                                    ? product.nameEn
                                                                    : product.nameAr
                                                            }
                                                        />
                                                        {product.occasion && (
                                                            <p className="text-on-surface-variant text-xs ltr:text-left rtl:text-right truncate">
                                                                {language ===
                                                                "en"
                                                                    ? product
                                                                          ?.occasion[0]
                                                                          ?.nameEn
                                                                    : product
                                                                          ?.occasion[0]
                                                                          ?.nameAr}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 max-w-56">
                                                <HoverRevealText
                                                    className="w-full"
                                                    text={
                                                        language === "en"
                                                            ? product.descriptionEn
                                                            : product.descriptionAr
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-on-surface text-sm font-semibold whitespace-nowrap">
                                                {product.price}
                                            </td>
                                            {canManage && (
                                                <td className="flex gap-4 px-6 py-4 text-right whitespace-nowrap">
                                                    <Can
                                                        permission={
                                                            PERMISSIONS.UPDATE_PRODUCT
                                                        }
                                                    >
                                                        <Link
                                                            to={`/products/${product.id}/edit`}
                                                            className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                        >
                                                            <EditIcon />
                                                        </Link>
                                                    </Can>
                                                    <Can
                                                        permission={
                                                            PERMISSIONS.DELETE_PRODUCT
                                                        }
                                                    >
                                                        <button
                                                            className="text-on-surface hover:text-error transition-colors cursor-pointer"
                                                            onClick={() => {
                                                                setDeleteProduct(
                                                                    product,
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
                )}

                {/* PAGINATION */}
                <Pagination
                    itemsPerPage={ITEMS_PER_PAGE}
                    maxVisiblePages={MAX_VISIBLE_PAGES}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    loading={loading}
                />
            </div>

            {/* SINGLE DELETE MODAL */}
            <Can permission={PERMISSIONS.DELETE_PRODUCT}>
                {openDeletedModal && deleteProduct && (
                    <DeletedModal
                        isOpen={openDeletedModal}
                        name={
                            language === "en"
                                ? deleteProduct.nameEn
                                : deleteProduct.nameAr
                        }
                        onClose={() => {
                            setOpenDeletedModal(false);
                            setDeleteProduct(null);
                        }}
                        onConfirm={handleDeleteProduct}
                        status="soft"
                    />
                )}
            </Can>

            {/* BULK DELETE MODAL */}
            <Can permission={PERMISSIONS.DELETE_PRODUCT}>
                {openBulkDeleteModal && (
                    <DeletedModal
                        isOpen={openBulkDeleteModal}
                        name={
                            selectedIds.size > 1
                                ? t("selected_other", {
                                      count: selectedIds.size,
                                  })
                                : t("selected_one", { count: selectedIds.size })
                        }
                        onClose={() => setOpenBulkDeleteModal(false)}
                        onConfirm={handleBulkDelete}
                        mode="soft"
                        loading={bulkDeleting}
                    />
                )}
            </Can>
        </>
    );
};

export default Products;
