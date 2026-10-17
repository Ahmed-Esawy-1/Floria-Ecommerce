"use client";

import { useId, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { useAddProductCommentMutation } from "@/lib/api/shopApi";

import { RatingInput } from "./Rating";
import { MAX_LENGTH } from "../constants";

export default function CommentForm({ productId }) {
    const t = useTranslations("product");
    const router = useRouter();
    const textareaId = useId();

    const isLoggedIn = useSelector((state) => !!state.auth.user);
    const [addComment, { isLoading }] = useAddProductCommentMutation();

    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    // null | "success" | "error" | "invalid"
    const [status, setStatus] = useState(null);

    // ---- Redirect to Login Page ---
    const goToLogin = () => {
        const current = window.location.pathname + window.location.search;
        router.push(`/login?returnUrl=${encodeURIComponent(current)}`);
    };

    // ---- SUBMIT -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (!content.trim() || rating < 1) {
            setStatus("invalid");
            return;
        }

        try {
            await addComment({
                productId,
                content: content.trim(),
                rating,
            }).unwrap();
            setContent("");
            setRating(0);
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

    // ---- NOT LOGGED IN -------------------------
    if (!isLoggedIn) {
        return (
            <div className="p-5 border border-gold/20 rounded-xl bg-marble/50 text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{t("loginToComment")}</span>
                <button
                    type="button"
                    onClick={goToLogin}
                    className="text-primary font-semibold underline cursor-pointer"
                >
                    {t("login")}
                </button>
            </div>
        );
    }

    // ---- LOGGED IN ---------------------------------
    return (
        <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6 border border-gold/20 rounded-xl bg-marble/50 space-y-4"
        >
            <h3 className="font-semibold text-ink">{t("writeComment")}</h3>

            {/* Rating */}
            <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {t("yourRating")}
                </span>
                <RatingInput
                    value={rating}
                    onChange={(n) => {
                        setRating(n);
                        setStatus(null);
                    }}
                    label={t("yourRating")}
                />
            </div>

            {/* Comment Textarea */}
            <div>
                <label
                    htmlFor={textareaId}
                    className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1"
                >
                    {t("yourComment")}
                </label>
                <textarea
                    id={textareaId}
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setStatus(null);
                    }}
                    maxLength={MAX_LENGTH}
                    rows={4}
                    placeholder={t("commentPlaceholder")}
                    className="w-full border border-gold/20 rounded-lg bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-slate-400 mt-1 text-end">
                    {content.length} / {MAX_LENGTH}
                </p>
            </div>

            {status === "invalid" && (
                <p className="text-sm text-red-500" role="alert">
                    {t("commentInvalid")}
                </p>
            )}
            {status === "error" && (
                <p className="text-sm text-red-500" role="alert">
                    {t("commentFailed")}
                </p>
            )}
            {status === "success" && (
                <p className="text-sm text-green-600" role="status">
                    {t("commentAdded")}
                </p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
                {isLoading ? t("submitting") : t("submitComment")}
            </button>
        </form>
    );
}
