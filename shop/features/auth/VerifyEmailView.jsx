"use client";

import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import getErrorMessage from "@/utils/getErrorMessage";
import { toast } from "sonner";

import {
    useVerifySignupMutation,
    useResendCodeMutation,
} from "@/lib/api/authApi";
import AuthShell from "./components/AuthShell";
import { RESEND_COOLDOWN } from "./constants";

export default function VerifyEmailView() {
    const t = useTranslations("auth.verify");
    const router = useRouter();
    const email = useSearchParams().get("email") ?? "";

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);

    const [verify, { isLoading }] = useVerifySignupMutation();
    const [resend, { isLoading: isResending }] = useResendCodeMutation();

    // No email in the URL means nothing to verify
    useEffect(() => {
        if (!email) router.replace("/signup");
    }, [email, router]);

    // Resend countdown
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [secondsLeft]);

    const handleCodeChange = (e) => {
        const cleaned = e.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 6);
        setCode(cleaned);
        setError("");
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (code.length !== 6) {
            setError(t("errors.codeInvalid"));
            return;
        }
        try {
            await verify({ email, code }).unwrap();
            toast.success(t("verified"));
            router.replace("/login");
        } catch (err) {
            setError(
                err?.data?.message || getErrorMessage(t("errors.genericError")),
            );
        }
    }

    async function handleResend() {
        try {
            await resend({ email }).unwrap();
            toast.success(t("codeSent"));
            setCode("");
            setError("");
            setSecondsLeft(RESEND_COOLDOWN);
        } catch (err) {
            toast.error(
                err?.data?.message || getErrorMessage(t("errors.genericError")),
            );
        }
    }

    return (
        <AuthShell>
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black tracking-tight mb-2">
                    {t("title")}
                </h2>
                <p className="text-slate-600">{t("subtitle")}</p>
                <p className="mt-1 font-semibold break-all" dir="ltr">
                    {email}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                    <input
                        value={code}
                        onChange={handleCodeChange}
                        inputMode="text"
                        autoCapitalize="characters"
                        autoComplete="one-time-code"
                        dir="ltr"
                        maxLength={6}
                        placeholder="A1B2C3"
                        aria-label={t("codeLabel")}
                        className={`w-full px-4 py-4 rounded-xl border text-center text-2xl tracking-[0.4em] font-bold uppercase outline-none focus:ring-2 focus:ring-primary ${
                            error ? "border-red-300" : "border-slate-200"
                        }`}
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50"
                >
                    {isLoading ? t("verifying") : t("verify")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
                {secondsLeft > 0 ? (
                    <span>{t("resendIn", { seconds: secondsLeft })}</span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-bold text-primary hover:underline disabled:opacity-50"
                    >
                        {t("resend")}
                    </button>
                )}
            </div>

            <p className="mt-8 text-center text-sm">
                <Link
                    href="/login"
                    className="text-primary font-bold hover:underline"
                >
                    {t("backToLogin")}
                </Link>
            </p>
        </AuthShell>
    );
}
