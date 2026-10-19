"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";

import PriceSlider from "./PriceSlider";

const SECTION_TITLE = "uppercase text-[10px] font-bold text-text mb-4";

export default function Filters({
    data,
    filters,
    price,
    onToggle,
    onPriceChange,
    onClear,
    open,
    setOpen,
}) {
    const locale = useLocale();
    const t = useTranslations("shop.filter");

    const { categories, occasions, colors, priceRange } = data;

    const isRtl = locale === "ar";
    const hiddenClass = isRtl ? "translate-x-full" : "-translate-x-full";
    const label = (item) => (isRtl ? item.nameAr : item.nameEn);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, setOpen]);

    // Price counts as an active filter only after the user narrowed it
    const hasActiveFilters =
        filters.categoryIds.length > 0 ||
        filters.occasionIds.length > 0 ||
        filters.colorIds.length > 0 ||
        price !== null;

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-primary-dark/40 lg:hidden z-20"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed lg:static inset-x-0 top-16 bottom-0 z-30
                    w-full sm:w-80 lg:w-64
                    lg:h-auto lg:min-h-screen
                    bg-marble-light lg:bg-marble
                    flex flex-col
                    px-4 pb-5 pt-4 lg:pt-10
                    overflow-y-auto
                    transition-transform duration-300
                    ${open ? "translate-x-0" : hiddenClass}
                    lg:translate-x-0
                `}
            >
                <div className="sticky top-0 z-10 -mx-4 px-4 pb-4 pt-0 mb-4 flex items-center justify-between bg-marble-light lg:bg-transparent">
                    <div>
                        <h2 className="font-serif text-2xl text-primary">
                            {t("title")}
                        </h2>
                        <p className="text-text text-xs uppercase tracking-widest mt-1">
                            {t("description")}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="lg:hidden text-ink"
                        onClick={() => setOpen(false)}
                        aria-label={t("close")}
                    >
                        <X />
                    </button>
                </div>

                <div className="space-y-10">
                    {/* CATEGORIES */}
                    <CheckboxSection
                        title={t("categories")}
                        items={categories}
                        selected={filters.categoryIds}
                        onToggle={(id) => onToggle("categoryIds", id)}
                        label={label}
                    />

                    {/* COLORS */}
                    <section>
                        <h3 className={SECTION_TITLE}>{t("palette")}</h3>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((c) => {
                                const selected = filters.colorIds.includes(
                                    c.id,
                                );
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() =>
                                            onToggle("colorIds", c.id)
                                        }
                                        aria-pressed={selected}
                                        aria-label={label(c)}
                                        title={label(c)}
                                        className={`w-6 h-6 rounded-full transition-shadow ${
                                            selected ? "ring-4 ring-gold" : ""
                                        }`}
                                        style={{ backgroundColor: c.hexCode }}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    {/* PRICE */}
                    <PriceSlider
                        priceRange={priceRange}
                        value={price}
                        onChange={onPriceChange}
                    />

                    {/* OCCASIONS */}
                    <CheckboxSection
                        title={t("occasions")}
                        items={occasions}
                        selected={filters.occasionIds}
                        onToggle={(id) => onToggle("occasionIds", id)}
                        label={label}
                    />

                    {/* CLEAR */}
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasActiveFilters}
                        className="w-full py-3 mt-8 border border-gold/40 rounded-full text-ink hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
                    >
                        {t("clear")}
                    </button>
                </div>
            </aside>
        </>
    );
}

function CheckboxSection({ title, items, selected, onToggle, label }) {
    return (
        <section>
            <h3 className={SECTION_TITLE}>{title}</h3>
            <div className="flex flex-col gap-3">
                {items.map((item) => (
                    <label
                        key={item.id}
                        className="flex items-center gap-3 text-ink cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(item.id)}
                            onChange={() => onToggle(item.id)}
                            className="accent-primary"
                        />
                        <span>{label(item)}</span>
                    </label>
                ))}
            </div>
        </section>
    );
}
