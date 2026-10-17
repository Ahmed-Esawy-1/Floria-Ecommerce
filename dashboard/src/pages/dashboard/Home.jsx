import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axios";
import PageHeader from "@/components/PageHeader";
import TopProductsChart from "./TopProductsChart.jsx";
import StatCard from "./StatCard";
import OrderRow from "./OrderRow";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CategoryIcon from "@mui/icons-material/Category";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Link } from "react-router";

// STATE CARD
const STAT_CARDS = [
    {
        statKey: "totalProducts",
        labelKey: "totalProducts",
        Icon: LocalFloristIcon,
        iconBg: "bg-primary-container",
        iconColor: "text-on-primary",
    },
    {
        statKey: "totalCategories",
        labelKey: "totalCategories",
        Icon: CategoryIcon,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        statKey: "totalOccasions",
        labelKey: "totalOccasions",
        Icon: CelebrationIcon,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        statKey: "totalOrders",
        labelKey: "totalOrders",
        Icon: ReceiptLongIcon,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        statKey: "pendingOrders",
        labelKey: "pendingOrders",
        Icon: HourglassTopIcon,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
    {
        statKey: "deliveredOrders",
        labelKey: "deliveredOrders",
        Icon: LocalShippingIcon,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        statKey: "monthlyRevenue",
        labelKey: "monthlyRevenue",
        Icon: PaymentsIcon,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
    },
    {
        statKey: "yearlyRevenue",
        labelKey: "yearlyRevenue",
        Icon: TrendingUpIcon,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
    },
];

const Home = () => {
    const { t } = useTranslation("dashboard");
    const { language } = useLanguage();

    // ---- STATE -------------------------------------------------
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---- FETCH DATA ------------------------------------------------------
    const getInfoSummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/dashboard");
            setData(data);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getInfoSummary();
    }, [getInfoSummary]);

    return (
        <>
            {/* HEADER */}
            <PageHeader title={t("title")} subtitle={t("subtitle")}>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-secondary bg-surface-container hover:bg-surface-container-low border border-surface-variant rounded-lg transition-all">
                        <CalendarTodayIcon fontSize="small" />
                        {t("dateRange")}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-secondary bg-surface-container hover:bg-surface-container-low border border-surface-variant rounded-lg transition-all">
                        <DownloadIcon fontSize="small" />
                        {t("exportReport")}
                    </button>
                </div>
            </PageHeader>

            {/* ERROR (when fetch data) */}
            {error && (
                <div className="my-4 p-4 rounded-lg bg-red-50 text-red-600">
                    {t("errors.loadFailed", {
                        defaultValue: "Failed to load dashboard data.",
                    })}
                </div>
            )}

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
                {STAT_CARDS.map(
                    ({ statKey, labelKey, Icon, iconBg, iconColor }) => (
                        <StatCard
                            key={statKey}
                            label={t(`cards.${labelKey}`)}
                            value={loading ? undefined : data?.stats?.[statKey]}
                            Icon={Icon}
                            iconBg={iconBg}
                            iconColor={iconColor}
                        />
                    ),
                )}
            </div>

            {/* CHARTS & ACTIVITY */}
            <div className="overflow-x-auto flex flex-wrap gap-6 mb-8">
                {/* Top Products */}
                {data?.topProducts?.length > 0 && (
                    <TopProductsChart topProducts={data?.topProducts} />
                )}

                {/* Latest Orders */}
                {data?.latestOrders?.length > 0 && (
                    <div className="min-w-100 flex-1 flex-col bg-surface-container border border-surface-variant rounded-xl shadow-sm">
                        <div className="p-6 border-b border-surface-variant">
                            <h4 className="">{t("orders.title")}</h4>
                            <p className="text-secondary">
                                {t("orders.subtitle")}
                            </p>
                        </div>
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            {data?.latestOrders?.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    t={t}
                                    language={language}
                                />
                            ))}
                        </div>
                        <div className="p-4 border-t border-surface-variant text-center">
                            <Link
                                to="/orders"
                                className="text-primary hover:underline transition-all"
                            >
                                {t("orders.viewAll")}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
