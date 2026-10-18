import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { BASE_URL } from "@/api/config";
import api from "@/api/axios";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/contexts/AuthContext";

import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeletedModal from "@/components/DeleteModal";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";
import { resolveImageUrl } from "@/helpers/resolveImageUrl";

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 4;

const TABLE_HEADER = ["userName", "email", "role"];

const Employees = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("employees");
    const { hasPermission } = useAuth();

    // ---- STATE ----------------------------------------
    const [currentPage, setCurrentPage] = useState(1);
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Single Delete
    const [openDeletedModal, setOpenDeletedModal] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);

    // Bulk Select & Delete
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const headerCheckboxRef = useRef(null);

    const canManage =
        hasPermission(PERMISSIONS.UPDATE_EMPLOYEE) ||
        hasPermission(PERMISSIONS.DELETE_EMPLOYEE);
    const columnCount =
        TABLE_HEADER.length + (selectMode ? 1 : 0) + (canManage ? 1 : 0);

    // ---- FETCH DATA ----------------------------------------------------
    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const { data } = await api.get("/employees");
                setAllEmployees(data.content);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    // ---- FILTER --------------------------------------
    const filteredUsers = useMemo(() => {
        return allEmployees.filter((employee) => {
            const q = searchQuery.trim().toLowerCase();

            return (
                !q ||
                employee.userName?.toLowerCase().includes(q) ||
                employee.email?.toLowerCase().includes(q)
            );
        });
    }, [allEmployees, searchQuery]);

    // ---- PAGINATE --------------------------------------------------------
    const currentUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    // reset to page 1 whenever the filtered set changes shape
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // ---- RECOMPUTE PAGE NUMBER -------------------------------------------------------
    const recomputeCurrentPage = (updatedList) => {
        const q = searchQuery.trim().toLowerCase();
        const newFilteredLength = q
            ? updatedList.filter(
                  (u) =>
                      u.userName?.toLowerCase().includes(q) ||
                      u.email?.toLowerCase().includes(q),
              ).length
            : updatedList.length;

        const newTotalPages = Math.ceil(newFilteredLength / ITEMS_PER_PAGE);
        setCurrentPage((prev) =>
            prev > newTotalPages ? newTotalPages || 1 : prev,
        );
    };

    // ---- SELECTION HELPERS -----------------------------------------------
    const currentPageIds = useMemo(
        () => currentUsers.map((u) => u.id),
        [currentUsers],
    );

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

    function toggleSelectOne(id) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function toggleSelectAllOnPage() {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allOnPageSelected) {
                currentPageIds.forEach((id) => next.delete(id));
            } else {
                currentPageIds.forEach((id) => next.add(id));
            }
            return next;
        });
    }

    function exitSelectMode() {
        setSelectMode(false);
        setSelectedIds(new Set());
    }

    // ---- SINGLE DELETE ----------------------------------------------------
    async function handleDeleteUser() {
        if (!deleteUser) return;

        try {
            await api.delete(`/employee/delete/${deleteUser.id}`);

            setAllEmployees((prev) => {
                const updated = prev.filter((u) => u.id !== deleteUser.id);
                recomputeCurrentPage(updated);
                return updated;
            });

            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(deleteUser.id);
                return next;
            });

            toast.success(
                t("toast.moveToTrashSuccess", { name: deleteUser.userName }),
            );
        } catch (error) {
            toast.error(
                t("toast.moveToTrashError", { name: deleteUser.userName }),
            );
        } finally {
            setDeleteUser(null);
            setOpenDeletedModal(false);
        }
    }

    // ---- BULK DELETE --------------------------------------------------------
    async function handleBulkDeleteUsers() {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        setBulkDeleting(true);
        try {
            const results = await Promise.allSettled(
                ids.map((id) => api.delete(`/employees/delete/${id}`)),
            );

            const succeededIds = ids.filter(
                (_, index) => results[index].status === "fulfilled",
            );
            const failedCount = ids.length - succeededIds.length;
            const succeededSet = new Set(succeededIds);

            setAllEmployees((prev) => {
                const updated = prev.filter((u) => !succeededSet.has(u.id));
                recomputeCurrentPage(updated);
                return updated;
            });

            setSelectedIds((prev) => {
                const next = new Set(prev);
                succeededIds.forEach((id) => next.delete(id));
                return next;
            });

            if (succeededIds.length > 0) {
                toast.success(
                    t("toast.bulkMoveToTrashSuccess", {
                        count: succeededIds.length,
                    }),
                );
            }
            if (failedCount > 0) {
                toast.error(
                    t("toast.bulkMoveToTrashError", { count: failedCount }),
                );
            }
        } finally {
            setBulkDeleting(false);
            setOpenBulkDeleteModal(false);
        }
    }

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex flex-wrap gap-3">
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
                    <Can permission={PERMISSIONS.DELETE_EMPLOYEE}>
                        <Link
                            to="/employees/trash"
                            className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
                        >
                            {tCommon("trash")}
                        </Link>
                    </Can>
                    <Can permission={PERMISSIONS.CREATE_EMPLOYEE}>
                        <Link
                            to="/employees/create"
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
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("searchPlaceholder")}
                            className="pl-10 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                            <DownloadIcon />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                            <PrintIcon />
                        </button>
                    </div>
                </div>

                {/* BULK ACTION BAR */}
                <Can permission={PERMISSIONS.DELETE_EMPLOYEE}>
                    {selectMode && selectedIds.size > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-primary/10 px-4 py-3 border-b border-outline-variant">
                            <span className="text-sm font-medium text-on-surface">
                                {tCommon("selectedCount", {
                                    count: selectedIds.size,
                                })}
                            </span>
                            <button
                                onClick={() => setOpenBulkDeleteModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-error border border-error/30 hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <DeleteIcon fontSize="small" />
                                {tCommon("deleteSelected")}
                            </button>
                        </div>
                    )}
                </Can>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-[850px] w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-left rtl:text-right">
                                {selectMode && (
                                    <th className="w-12 px-6 py-4 border-b border-outline-variant">
                                        <input
                                            ref={headerCheckboxRef}
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
                                        className="px-6 py-4 text-on-surface-variant border-b border-outline-variant"
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
                            {/* LOADING */}
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="px-8 py-10 text-center text-on-surface-variant"
                                    >
                                        {t("loading")}
                                    </td>
                                </tr>
                            ) : // NO USER
                            currentUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="px-8 py-10 text-center text-on-surface-variant"
                                    >
                                        {t("noResults")}
                                    </td>
                                </tr>
                            ) : (
                                // USERS
                                currentUsers.map((employee) => (
                                    <tr
                                        className="hover:bg-surface-container-low transition-colors group text-left rtl:text-right"
                                        key={employee.id}
                                    >
                                        {selectMode && (
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(
                                                        employee.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelectOne(
                                                            employee.id,
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    alt="User Avatar"
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                                    src={
                                                        employee?.imageUrl
                                                            ? resolveImageUrl(
                                                                  employee.imageUrl,
                                                              )
                                                            : `/images/default_userImage.svg`
                                                    }
                                                />

                                                <p className="text-on-surface text-sm font-semibold">
                                                    {employee.userName}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600 text-sm">
                                            {employee.email}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="bg-indigo-50 px-2.5 py-0.5 text-indigo-700 text-xs font-medium border border-indigo-100 rounded-full">
                                                {employee.role}
                                            </span>
                                        </td>
                                        {canManage && (
                                            <td className="flex gap-4 px-6 py-4 text-right whitespace-nowrap">
                                                <Can
                                                    permission={
                                                        PERMISSIONS.UPDATE_EMPLOYEE
                                                    }
                                                >
                                                    <Link
                                                        to={`/employees/${employee.id}/edit`}
                                                        className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <EditIcon />
                                                    </Link>
                                                </Can>
                                                <Can
                                                    permission={
                                                        PERMISSIONS.DELETE_EMPLOYEE
                                                    }
                                                >
                                                    <button
                                                        className="text-on-surface hover:text-error transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setDeleteUser(
                                                                employee,
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

                {/* PAGINATION */}
                <Pagination
                    itemsPerPage={ITEMS_PER_PAGE}
                    maxVisiblePages={MAX_VISIBLE_PAGES}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={filteredUsers.length}
                    loading={loading}
                />

                {/* SINGLE DELETE MODAL */}
                {openDeletedModal && deleteUser && (
                    <DeletedModal
                        isOpen={openDeletedModal}
                        name={deleteUser.userName}
                        onClose={() => {
                            setOpenDeletedModal(false);
                            setDeleteUser(null);
                        }}
                        onConfirm={handleDeleteUser}
                        status="soft"
                    />
                )}

                {/* BULK DELETE MODAL */}
                {openBulkDeleteModal && (
                    <DeletedModal
                        isOpen={openBulkDeleteModal}
                        name={t("selectedCount", { count: selectedIds.size })}
                        onClose={() => setOpenBulkDeleteModal(false)}
                        onConfirm={handleBulkDeleteUsers}
                        status="soft"
                        loading={bulkDeleting}
                    />
                )}
            </div>
        </>
    );
};

export default Employees;
