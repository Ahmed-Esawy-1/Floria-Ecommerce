"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function ProductDescription({ text }) {
    const t = useTranslations("product");
    const [open, setOpen] = useState(false);
    const panelId = useId();

    return (
        <div className="pt-4">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={panelId}
                className="w-full py-4 border border-gold/20 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-marble/50 hover:border-gold/40 transition-colors text-ink"
            >
                {t("description")}
                <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <div
                id={panelId}
                className={`grid transition-all duration-300 ease-in-out ${
                    open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <p className="py-4 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {text || t("noDescription")}
                    </p>
                </div>
            </div>
        </div>
    );
}
