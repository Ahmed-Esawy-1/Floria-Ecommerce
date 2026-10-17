"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import getErrorMessage from "@/utils/getErrorMessage";
import { useLoginMutation } from "@/lib/api/authApi";
import { useAuth } from "@/features/auth/useAuth";
import Spinner from "@/components/loading/spinner";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import AuthShell from "./components/AuthShell";
import FormField from "./components/FormField";
import PasswordField from "./components/PasswordField";
import AuthDivider from "./components/AuthDivider";
import { OAUTH_ERROR_KEYS } from "./constants";

import { ArrowUp } from "lucide-react";

const inputClass =
    "w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400";

export default function LoginView() {
    const t = useTranslations("auth.login");
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [login, { isLoading }] = useLoginMutation();

    // Redirect home if already logged in
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) router.replace("/");
    }, [isAuthLoading, isAuthenticated, router]);

    // Show OAuth errors returned in the URL
    useEffect(() => {
        if (isAuthLoading || isAuthenticated) return;
        const key = OAUTH_ERROR_KEYS[searchParams.get("error")];
        if (!key) return;
        toast.error(t(key), { id: "oauth-error" });
        router.replace("/login");
    }, [isAuthLoading, isAuthenticated, searchParams, router, t]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login({ email, password, rememberMe }).unwrap();
        } catch (error) {
            const data = error?.data;
            if (data?.code === "EMAIL_NOT_VERIFIED") {
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                return;
            }
            toast.error(getErrorMessage(data, t("errors.genericError")));
        }
    }

    if (isAuthLoading || isAuthenticated) {
        return <Spinner />;
    }

    return (
        <AuthShell maxWidth="max-w-142">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-black tracking-tight mb-2">
                    {t("title")}
                </h2>
                <p className="text-text">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField id="email" label={t("emailLabel")}>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("emailPlaceholder")}
                        className={inputClass}
                    />
                </FormField>

                <FormField
                    id="password"
                    label={
                        <span className="flex justify-between items-center">
                            {t("passwordLabel")}
                            <a
                                className="text-xs font-bold text-primary hover:underline"
                                href="#"
                            >
                                {t("forgotPassword")}
                            </a>
                        </span>
                    }
                >
                    <PasswordField
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("passwordPlaceholder")}
                    />
                </FormField>

                <label className="flex items-center gap-2 px-1 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-primary"
                    />
                    {t("rememberMe")}
                </label>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {isLoading ? (
                        t("signingIn")
                    ) : (
                        <>
                            <span>{t("signIn")}</span>
                            <ArrowUp className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                        </>
                    )}
                </button>
            </form>

            <AuthDivider label={t("orContinueWith")} />
            <GoogleAuthButton label={t("google")} />

            <p className="mt-12 text-center text-text">
                {t("noAccount")}{" "}
                <Link
                    className="text-primary font-bold hover:underline"
                    href="/signup"
                >
                    {t("createAccount")}
                </Link>
            </p>
        </AuthShell>
    );
}
