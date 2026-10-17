"use client";

import { useTranslations } from "next-intl";
import { FILTERS } from "../constants";

export default function StatusFilter({ value, onChange }) {
    const t = useTranslations("orders");

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((filter) => {
                const active = value === filter;
                return (
                    <button
                        key={filter}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                            active
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-slate-600 border-gold/20 hover:border-primary/40"
                        }`}
                    >
                        {filter === "ALL"
                            ? t("filterAll")
                            : t(`statuses.${filter}`)}
                    </button>
                );
            })}
        </div>
    );
}
