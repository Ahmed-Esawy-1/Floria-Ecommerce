"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const COMMIT_DELAY = 400;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function PriceSlider({ priceRange, value, onChange }) {
    const t = useTranslations("shop.filter");

    // Whole numbers keep the slider step clean
    const min = Math.floor(Number(priceRange.minPrice ?? 0));
    const max = Math.ceil(Number(priceRange.maxPrice ?? 0));

    const committed = {
        min: value?.minPrice ?? min,
        max: value?.maxPrice ?? max,
    };
    const [local, setLocal] = useState(committed);

    // Follow the parent when it changes (clear all, new bounds)
    useEffect(() => {
        setLocal({ min: value?.minPrice ?? min, max: value?.maxPrice ?? max });
    }, [value?.minPrice, value?.maxPrice, min, max]);

    // Commit once the user stops moving, so we don't refetch on every tick
    useEffect(() => {
        if (local.min === committed.min && local.max === committed.max) return;

        const id = setTimeout(() => {
            const lo = clamp(Math.round(local.min), min, max - 1);
            const hi = clamp(Math.round(local.max), lo + 1, max);
            setLocal({ min: lo, max: hi });
            // Full range means "no price filter"
            onChange(lo <= min && hi >= max ? null : { min: lo, max: hi });
        }, COMMIT_DELAY);

        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local]);

    if (max <= min) return null;

    const range = max - min;
    const left = clamp(((local.min - min) / range) * 100, 0, 100);
    const width = clamp(((local.max - local.min) / range) * 100, 0, 100);

    const setMin = (v) =>
        setLocal((p) => ({ ...p, min: clamp(v, min, p.max - 1) }));
    const setMax = (v) =>
        setLocal((p) => ({ ...p, max: clamp(v, p.min + 1, max) }));

    return (
        <section className="w-full space-y-4">
            <h3 className="uppercase text-[10px] font-bold text-text">
                {t("priceTitle")}
            </h3>

            <div className="flex justify-between text-[11px] text-stone-400 uppercase tracking-widest">
                <span>
                    {t("currency")} {min}
                </span>
                <span>
                    {t("currency")} {max}
                </span>
            </div>

            <div className="relative h-6">
                <div className="absolute top-1/2 w-full h-1 bg-stone-200 -translate-y-1/2 rounded-full" />

                {/* insetInlineStart flips automatically in RTL */}
                <div
                    className="absolute top-1/2 h-1 bg-primary -translate-y-1/2 rounded-full"
                    style={{ insetInlineStart: `${left}%`, width: `${width}%` }}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={clamp(local.min, min, max)}
                    onChange={(e) => setMin(Number(e.target.value))}
                    // Keeps the min thumb reachable when both thumbs meet at the right end
                    style={{ zIndex: local.min > max - range / 10 ? 5 : 3 }}
                    className="range-slider"
                    aria-label="Minimum price"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={clamp(local.max, min, max)}
                    onChange={(e) => setMax(Number(e.target.value))}
                    style={{ zIndex: 4 }}
                    className="range-slider"
                    aria-label="Maximum price"
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="number"
                    min={min}
                    max={local.max}
                    value={local.min}
                    onChange={(e) =>
                        setLocal((p) => ({ ...p, min: Number(e.target.value) }))
                    }
                    onBlur={() => setMin(local.min)}
                    className="w-full border border-stone-200 px-2 py-1 text-sm rounded"
                    aria-label="Minimum price"
                />
                <span className="text-stone-400">-</span>
                <input
                    type="number"
                    min={local.min}
                    max={max}
                    value={local.max}
                    onChange={(e) =>
                        setLocal((p) => ({ ...p, max: Number(e.target.value) }))
                    }
                    onBlur={() => setMax(local.max)}
                    className="w-full border border-stone-200 px-2 py-1 text-sm rounded"
                    aria-label="Maximum price"
                />
            </div>
        </section>
    );
}
