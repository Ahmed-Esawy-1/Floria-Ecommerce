// src/pages/customers/Customers.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { BASE_URL } from "@/api/config";
import api from "@/api/axios";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import Can from "@/components/Can";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permissions";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { resolveImageUrl } from "@/helpers/resolveImageUrl";

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 4;
const TABLE_HEADER = ["userName", "email", "provider"];

const Customers = () => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("customers");
    const { hasPermission } = useAuth();

    // ---- STATE ----------------------------------------
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const canUpdate = hasPermission(PERMISSIONS.UPDATE_CUSTOMER);
    const columnCount = TABLE_HEADER.length + (canUpdate ? 1 : 0);

    // ---- DEBOUNCED SEARCH -----------------------------
    useEffect(() => {
        const id = setTimeout(() => {
            setSearchQuery(searchInput.trim());
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(id);
    }, [searchInput]);

    // ---- FETCH (server-side paging) -------------------
    useEffect(() => {
        let cancelled = false;

        async function fetchCustomers() {
            setLoading(true);
            try {
                const { data } = await api.get("/customers", {
                    params: {
                        page: currentPage - 1,
                        size: ITEMS_PER_PAGE,
                        search: searchQuery || undefined,
                    },
                });
                if (!cancelled) {
                    setCustomers(data.content);
                    setTotalItems(data.totalElements);
                }
            } catch (error) {
                console.error(error);
                if (!cancelled) toast.error(t("toast.loadError"));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchCustomers();
        return () => {
            cancelled = true;
        };
    }, [currentPage, searchQuery, t]);

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")} />

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                {/* FILTER */}
                <div className="flex items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
                    <div className="relative w-full sm:w-64">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={t("searchPlaceholder")}
                            className="pl-10 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-[700px] w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-left rtl:text-right">
                                {TABLE_HEADER.map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-4 text-on-surface-variant border-b border-outline-variant"
                                    >
                                        {t(`table.${h}`)}
                                    </th>
                                ))}
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
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="px-8 py-10 text-center text-on-surface-variant"
                                    >
                                        {t("noResults")}
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-surface-container-low transition-colors group text-left rtl:text-right"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    alt="User Avatar"
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                                    src={
                                                        customer?.imageUrl
                                                            ? `${resolveImageUrl(customer.imageUrl)}`
                                                            : `/images/default_userImage.svg`
                                                    }
                                                />
                                                <p className="text-on-surface text-sm font-semibold">
                                                    {customer.userName}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600 text-sm">
                                            {customer.email}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="bg-slate-100 px-2.5 py-0.5 text-slate-700 text-xs font-medium border border-slate-200 rounded-full">
                                                {customer.provider}
                                            </span>
                                        </td>
                                        {canUpdate && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Can
                                                    permission={
                                                        PERMISSIONS.UPDATE_CUSTOMER
                                                    }
                                                >
                                                    <Link
                                                        to={`/customers/${customer.id}/edit`}
                                                        className="text-on-surface hover:text-primary transition-colors inline-block"
                                                    >
                                                        <EditIcon />
                                                    </Link>
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
                    totalItems={totalItems}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default Customers;
