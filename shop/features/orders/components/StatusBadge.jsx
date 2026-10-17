"use client";

import { useTranslations } from "next-intl";
import { STATUS_STYLES, STATUSES } from "../constants";

export default function StatusBadge({ status }) {
    const t = useTranslations("orders");

    const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
    const label = STATUSES.includes(status) ? t(`statuses.${status}`) : status;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
            {label}
        </span>
    );
}
