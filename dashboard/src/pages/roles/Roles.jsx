import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "@/api/axios";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import Can from "@/components/Can";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PERMISSIONS } from "@/constants/permissions";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 4;

const Roles = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("roles");
    const { hasPermission } = useAuth();
    const { language } = useLanguage();
    const isAr = language === "ar";

    // ---- STATE ----------------------------------------
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const canUpdate = hasPermission(PERMISSIONS.UPDATE_ROLE);
    const columnCount = 2 + (canUpdate ? 1 : 0);

    // ---- FETCH ----------------------------------------
    useEffect(() => {
        let cancelled = false;

        async function fetchRoles() {
            setLoading(true);
            try {
                const { data } = await api.get("/roles");
                if (!cancelled) setRoles(data);
            } catch (error) {
                console.error(error);
                if (!cancelled) toast.error(t("toast.loadError"));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchRoles();
        return () => {
            cancelled = true;
        };
    }, [t]);

    // ---- HELPERS --------------------------------------
    const getName = (role) => (isAr ? role.nameAr : role.nameEn);
    const getDescription = (role) =>
        isAr ? role.descriptionAr : role.descriptionEn;

    // ---- FILTER + PAGINATE ----------------------------
    const filteredRoles = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return roles;
        return roles.filter(
            (r) =>
                r.nameEn?.toLowerCase().includes(q) ||
                r.nameAr?.toLowerCase().includes(q) ||
                r.code?.toLowerCase().includes(q),
        );
    }, [roles, searchQuery]);

    const pagedRoles = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRoles.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRoles, currentPage]);

    // reset to page 1 when the search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex flex-wrap gap-3">
                    <Can permission={PERMISSIONS.CREATE_ROLE}>
                        <Link
                            to="/roles/create"
                            className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-all"
                        >
                            <AddIcon fontSize="small" />
                            {t("create")}
                        </Link>
                    </Can>
                </div>
            </PageHeader>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                {/* FILTER */}
                <div className="flex items-center gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
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
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-[600px] w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-left rtl:text-right">
                                <th className="px-6 py-4 text-on-surface-variant border-b border-outline-variant">
                                    {t("table.name")}
                                </th>
                                <th className="px-6 py-4 text-on-surface-variant border-b border-outline-variant">
                                    {t("table.description")}
                                </th>
                                {canUpdate && (
                                    <th className="px-6 py-4 text-on-surface-variant border-b border-outline-variant">
                                        {tCommon("actions")}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="px-8 py-10 text-center text-on-surface-variant"
                                    >
                                        {t("loading")}
                                    </td>
                                </tr>
                            ) : pagedRoles.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="px-8 py-10 text-center text-on-surface-variant"
                                    >
                                        {t("noResults")}
                                    </td>
                                </tr>
                            ) : (
                                pagedRoles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="hover:bg-surface-container-low transition-colors group text-left rtl:text-right"
                                    >
                                        <td className="px-8 py-4">
                                            <p className="text-on-surface text-sm font-semibold">
                                                {getName(role)}
                                            </p>
                                            <p
                                                dir="ltr"
                                                className="text-xs text-on-surface-variant"
                                            >
                                                {role.code}
                                            </p>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600 text-sm">
                                            {getDescription(role)}
                                        </td>
                                        {canUpdate && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {/* Edit is disabled until the edit page and API exist */}
                                                <button
                                                    type="button"
                                                    disabled
                                                    title={t("editDisabled")}
                                                    className="text-on-surface-variant opacity-40 cursor-not-allowed inline-block"
                                                >
                                                    <EditIcon />
                                                </button>
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
                    totalItems={filteredRoles.length}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default Roles;
