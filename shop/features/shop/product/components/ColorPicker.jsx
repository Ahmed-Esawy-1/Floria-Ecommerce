"use client";

import { useLocale, useTranslations } from "next-intl";

export default function ColorPicker({ colors, selectedId, onSelect }) {
    const t = useTranslations("product");
    const locale = useLocale();

    if (colors.length === 0) return null;

    return (
        <div className="p-6 border border-gold/20 rounded-xl bg-marble/50">
            <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                {t("selectColor")}
            </span>

            <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                    const selected = selectedId === color.id;

                    return (
                        <button
                            key={color.id}
                            type="button"
                            onClick={() => onSelect(color.id)}
                            aria-pressed={selected}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                                selected
                                    ? "border-primary bg-white shadow-sm"
                                    : "border-gold/20 bg-marble hover:bg-white hover:border-gold/50"
                            }`}
                        >
                            <span
                                className="w-4 h-4 rounded-full border border-black/10"
                                style={{ backgroundColor: color.hexCode }}
                            />
                            <span className="text-sm font-medium text-ink">
                                {locale === "en" ? color.nameEn : color.nameAr}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
