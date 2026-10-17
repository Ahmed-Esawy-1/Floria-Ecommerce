"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useGetProductCommentsQuery } from "@/lib/api/shopApi";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { Stars } from "./Rating";
import { COMMENTS_PER_PAGE } from "../constants";

export default function ProductComments({ productId }) {
    const t = useTranslations("product");
    const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

    const {
        data: comments = [],
        isLoading,
        isError,
    } = useGetProductCommentsQuery(productId, { skip: !productId });

    // Newest first (ids grow with time)
    const sorted = useMemo(
        () => [...comments].sort((a, b) => b.id - a.id),
        [comments],
    );

    // ---- AVERAGE OF COMMENTS ----------------------------------
    const { average, ratedCount } = useMemo(() => {
        const rated = comments.filter((c) => c.rating != null);
        const total = rated.reduce((sum, c) => sum + c.rating, 0);
        return {
            ratedCount: rated.length,
            average: rated.length ? total / rated.length : 0,
        };
    }, [comments]);

    const visible = sorted.slice(0, visibleCount);
    const hasMore = sorted.length > visibleCount;

    return (
        <section className="mt-24">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold text-ink">
                    {t("commentsTitle")}
                </h2>

                {ratedCount > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">
                            {average.toFixed(1)}
                        </span>
                        <div>
                            <Stars value={average} />
                            <p className="text-xs text-slate-400 mt-0.5">
                                {t("reviewsCount", { count: ratedCount })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* FORM */}
            <CommentForm productId={productId} />

            <div className="mt-8">
                {isLoading && (
                    <p className="text-slate-400 text-sm">
                        {t("loadingComments")}
                    </p>
                )}

                {isError && (
                    <p className="text-red-500 text-sm">{t("commentsError")}</p>
                )}

                {!isLoading && !isError && comments.length === 0 && (
                    <p className="text-slate-400 text-sm">{t("noComments")}</p>
                )}

                {/* COMMENTS */}
                {visible.length > 0 && (
                    <ul className="space-y-6">
                        {visible.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </ul>
                )}

                {/* LOAD MORE */}
                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <button
                            type="button"
                            onClick={() =>
                                setVisibleCount((n) => n + COMMENTS_PER_PAGE)
                            }
                            className="px-6 py-2.5 border border-primary text-primary text-sm font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                            {t("showMoreComments")}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
