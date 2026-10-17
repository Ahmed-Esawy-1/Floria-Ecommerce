"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Search, Loader2 } from "lucide-react";
import { useSearchProductsQuery } from "@/lib/api/productSearchApi";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { encodeId } from "@/lib/hashId";
import useDebouncedValue from "./useDebouncedValue";

// ---- Constants -------------------------------
const MIN_CHARS = 2;
const MAX_RESULTS = 5;
const DEBOUNCE_MS = 500;

export default function ProductSearch({ variant = "desktop", onSelect }) {
    const locale = useLocale();
    const t = useTranslations("navigation");

    const containerRef = useRef(null);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);

    const term = input.trim();

    // Only changes after the user stops typing for DEBOUNCE_MS
    const debounced = useDebouncedValue(term, DEBOUNCE_MS);

    const shouldSearch = debounced.length >= MIN_CHARS;

    const { data, isFetching, isError } = useSearchProductsQuery(debounced, {
        skip: !shouldSearch,
    });

    const results = (data ?? []).slice(0, MAX_RESULTS);
    const showDropdown = open && term.length >= MIN_CHARS;
    const isDesktop = variant === "desktop";

    // ---- Close when clicking outside the search box ----
    useEffect(() => {
        if (!showDropdown) return;

        function handleClickOutside(e) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    function handleSelect() {
        setInput("");
        setOpen(false);
        onSelect?.();
    }

    function handleKeyDown(e) {
        if (e.key === "Escape") setOpen(false);
    }

    return (
        <div
            ref={containerRef}
            className={
                isDesktop ? "relative hidden md:block" : "relative w-full"
            }
        >
            <div className="flex items-center gap-2 bg-rose/10 rounded-full px-4 py-2">
                <Search className="text-rose !text-xl shrink-0" />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("searchPlaceholder")}
                    className={`bg-transparent border-none focus:ring-0 text-sm outline-none placeholder:text-text ${
                        isDesktop ? "w-48" : "w-full"
                    }`}
                />
                {isFetching && (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-rose" />
                )}
            </div>

            {showDropdown && (
                <div
                    className={
                        isDesktop
                            ? "absolute start-0 top-full mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-200 z-50"
                            : "mt-2 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200"
                    }
                >
                    {isError && (
                        <p className="p-4 text-sm text-red-600">
                            {t("search.error")}
                        </p>
                    )}

                    {!isError &&
                        !isFetching &&
                        shouldSearch &&
                        results.length === 0 && (
                            <p className="p-4 text-sm text-stone-500">
                                {t("search.noResults")}
                            </p>
                        )}

                    {results.length > 0 && (
                        <ul className="divide-y divide-stone-100">
                            {results.map((p) => (
                                <li key={p.id}>
                                    <Link
                                        href={`/shop/${encodeId(p.id)}`}
                                        onClick={handleSelect}
                                        className="flex items-center gap-3 p-3 transition hover:bg-rose/10"
                                    >
                                        {p.primaryImageUrl ? (
                                            <img
                                                src={resolveImageUrl(
                                                    p.primaryImageUrl,
                                                )}
                                                alt=""
                                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-100" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-ink">
                                                {locale === "ar"
                                                    ? p.nameAr
                                                    : p.nameEn}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
