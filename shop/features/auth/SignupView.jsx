"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useTranslations } from "next-intl";
import { Flower, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { useSignupMutation } from "@/lib/api/authApi";
import Spinner from "@/components/loading/Spinner";
import GoogleAuthButton from "@/components/GoogleAuthButton";

import FormField from "./components/FormField";
import PasswordField from "./components/PasswordField";
import AuthDivider from "./components/AuthDivider";
import { EMAIL_REGEX, PASSWORD_REGEX, EMPTY_ERRORS } from "./constants";
import getErrorMessage from "@/utils/getErrorMessage";

const inputClass = (hasError) =>
    `block w-full rounded-xl border-0 outline-none py-4 px-12 text-slate-900 shadow-sm ring-1 ring-inset bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm ${
        hasError
            ? "ring-red-300 focus:ring-red-500"
            : "ring-slate-200 focus:ring-primary"
    }`;

export default function SignupView() {
    const t = useTranslations("auth.signup");
    const router = useRouter();

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [signup, { isLoading }] = useSignupMutation();

    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [error, setError] = useState(EMPTY_ERRORS);

    const isFormComplete =
        form.userName.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim() &&
        form.terms;

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) router.replace("/");
    }, [isAuthLoading, isAuthenticated, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = { ...EMPTY_ERRORS };

        if (!form.userName.trim()) next.userName = t("errors.userNameRequired");
        if (!EMAIL_REGEX.test(form.email.trim()))
            next.email = t("errors.emailInvalid");

        if (form.password.length < 8)
            next.password = t("errors.passwordTooShort");
        else if (!PASSWORD_REGEX.test(form.password))
            next.password = t("errors.passwordPattern");

        if (form.password && form.confirmPassword !== form.password) {
            next.confirmPassword = t("errors.passwordMismatch");
        }

        setError(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await signup({
                userName: form.userName.trim(),
                email: form.email.trim(),
                password: form.password,
            }).unwrap();

            router.push(
                `/verify-email?email=${encodeURIComponent(form.email.trim())}`,
            );
        } catch (err) {
            const message =
                err?.status === 409
                    ? t("errors.emailAlreadyExists")
                    : err?.data?.message ||
                      getErrorMessage(t("errors.genericError"));
            setError((prev) => ({ ...prev, general: message }));
        }
    };

    if (isAuthLoading || isAuthenticated) {
        return <Spinner />;
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* BRAND PANEL */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center bg-primary/10 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover"
                        alt="Elegant luxury floral arrangement in a minimalist vase"
                        src="/images/signup_background.png"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative z-10 px-12 text-center text-white">
                    <Flower size={60} className="mx-auto mb-6" />
                    <h1 className="text-5xl font-black tracking-tight mb-4">
                        {t("brandTitle")}
                    </h1>
                    <p className="text-xl font-light max-w-md mx-auto opacity-90">
                        {t("brandTagline")}
                    </p>
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/70 text-sm">
                    <span>{t("copyright")}</span>
                    <div className="flex gap-4">
                        <span>{t("privacy")}</span>
                        <span>{t("terms")}</span>
                    </div>
                </div>
            </div>

            {/* FORM */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-background-light">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            {t("title")}
                        </h2>
                        <p className="mt-3 text-slate-600">{t("subtitle")}</p>
                    </div>

                    {error.general && (
                        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-inset ring-red-200">
                            {error.general}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        noValidate
                    >
                        <FormField
                            id="userName"
                            label={t("fullNameLabel")}
                            error={error.userName}
                        >
                            <div className="relative">
                                <User
                                    className="absolute inset-y-0 my-auto ltr:left-4 rtl:right-4 text-slate-400 pointer-events-none"
                                    size={18}
                                />
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    autoComplete="name"
                                    placeholder={t("fullNamePlaceholder")}
                                    value={form.userName}
                                    onChange={handleChange}
                                    className={inputClass(error.userName)}
                                />
                            </div>
                        </FormField>

                        <FormField
                            id="email"
                            label={t("emailLabel")}
                            error={error.email}
                        >
                            <div className="relative">
                                <Mail
                                    className="absolute inset-y-0 my-auto ltr:left-4 rtl:right-4 text-slate-400 pointer-events-none"
                                    size={18}
                                />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder={t("emailPlaceholder")}
                                    value={form.email}
                                    onChange={handleChange}
                                    className={inputClass(error.email)}
                                />
                            </div>
                        </FormField>

                        <FormField
                            id="password"
                            label={t("passwordLabel")}
                            error={error.password}
                            hint={t("passwordHint")}
                        >
                            <PasswordField
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                error={error.password}
                                autoComplete="new-password"
                            />
                        </FormField>

                        <FormField
                            id="confirmPassword"
                            label={t("confirmPasswordLabel")}
                            error={error.confirmPassword}
                        >
                            <PasswordField
                                id="confirmPassword"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                error={error.confirmPassword}
                                autoComplete="new-password"
                            />
                        </FormField>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={form.terms}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        terms: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor="terms"
                                className="ltr:ml-3 rtl:mr-3 block text-sm text-slate-600"
                            >
                                {t("agreeTerms")}{" "}
                                <span className="font-semibold text-primary">
                                    {t("termsOfService")}
                                </span>{" "}
                                {t("and")}{" "}
                                <span className="font-semibold text-primary">
                                    {t("privacyPolicy")}
                                </span>
                                .
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormComplete || isLoading}
                            className="flex w-full justify-center rounded-xl bg-primary px-3 py-4 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {isLoading
                                ? t("creatingAccount")
                                : t("createAccount")}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm text-slate-600">
                        {t("alreadyHaveAccount")}{" "}
                        <Link
                            className="font-bold text-primary hover:text-primary/80"
                            href="/login"
                        >
                            {t("signInHere")}
                        </Link>
                    </p>

                    <AuthDivider label={t("orJoinWith")} />
                    <GoogleAuthButton label={t("google")} />
                </div>
            </div>
        </div>
    );
}
