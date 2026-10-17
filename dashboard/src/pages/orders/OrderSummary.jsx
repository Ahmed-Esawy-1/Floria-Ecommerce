import React from "react";
import { useTranslation } from "react-i18next";
import { STATUS_STYLES, DEFAULT_AVATAR } from "./constants";
import { resolveImageUrl } from "@/helpers/resolveImageUrl";

const hasValue = (value) =>
    value !== null && value !== undefined && value !== "";

const formatDate = (value) => (value ? value.split("T")[0] : "-");

const Field = ({ label, children }) => (
    <div>
        <dt className="text-on-surface-variant text-sm">{label}</dt>
        <dd className="font-medium mt-1">{children}</dd>
    </div>
);

const OrderSummary = ({ order }) => {
    const { t, i18n } = useTranslation("orders");

    if (!order) return null;

    const isArabic = i18n.language?.startsWith("ar");
    const cityName = isArabic ? order.cityNameAr : order.cityNameEn;
    const pound = t("table.pound");

    return (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">{t("details.title")}</h2>
                <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING
                    }`}
                >
                    {t(`status.${order.status?.toLowerCase()}`)}
                </span>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 mb-6">
                <img
                    src={resolveImageUrl(order.customerImage) || DEFAULT_AVATAR}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    {hasValue(order.fullName) && (
                        <p className="font-medium">{order.fullName}</p>
                    )}
                    {hasValue(order.customerEmail) && (
                        <p
                            className="text-sm text-on-surface-variant"
                            dir="ltr"
                        >
                            {order.customerEmail}
                        </p>
                    )}
                </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <Field label={t("table.orderId")}>
                    <span dir="ltr" className="inline-block text-primary">
                        {order.orderId}
                    </span>
                </Field>

                <Field label={t("table.date")}>
                    {formatDate(order.createdAt)}
                </Field>

                {hasValue(cityName) && (
                    <Field label={t("table.city")}>{cityName}</Field>
                )}

                {hasValue(order.totalPrice) && (
                    <Field label={t("table.amount")}>
                        {order.totalPrice} {pound}
                    </Field>
                )}
            </dl>
        </section>
    );
};

export default OrderSummary;
