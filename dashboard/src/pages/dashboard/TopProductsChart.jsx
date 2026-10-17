import React from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function TopProductsChart({ topProducts = [] }) {
    const { t, i18n } = useTranslation("dashboard");
    const isRTL = i18n.dir() === "rtl";

    const getProductName = (product) => {
        const isArabic = i18n.language?.startsWith("ar");
        return (
            (isArabic ? product.nameAr : product.nameEn) ||
            product.nameEn ||
            product.nameAr ||
            ""
        );
    };

    const labels = topProducts.map(getProductName);
    const orderCounts = topProducts.map((p) => Number(p.orderCount) || 0);

    const data = {
        labels,
        datasets: [
            {
                label: t("topProducts.orderCount"),
                data: orderCounts,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        locale: i18n.language,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                rtl: isRTL,
                textDirection: isRTL ? "rtl" : "ltr",
                callbacks: {
                    label: (ctx) =>
                        t("topProducts.ordersTooltip", { count: ctx.raw }),
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { precision: 0 },
                reverse: isRTL,
            },
            y: {
                position: isRTL ? "right" : "left",
            },
        },
    };

    return (
        <div
            dir={i18n.dir()}
            className="min-h-[420px] min-w-[600px] flex-2 flex flex-col bg-surface-container border border-surface-variant rounded-xl shadow-sm"
        >
            <div className="p-6 border-b border-surface-variant">
                <h4>{t("topProducts.title")}</h4>
                <p className="text-secondary">{t("topProducts.subtitle")}</p>
            </div>

            <div className="flex-1 p-6">
                {topProducts.length === 0 ? (
                    <div className="flex h-[360px] items-center justify-center text-secondary">
                        {t("topProducts.empty")}
                    </div>
                ) : (
                    <div className="relative h-[360px] w-full">
                        <Bar data={data} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopProductsChart;
