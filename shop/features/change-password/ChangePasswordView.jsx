"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    useGetMeQuery,
    useRequestPasswordChangeMutation,
    useConfirmPasswordChangeMutation,
} from "@/lib/api/authApi";
import { EMPTY_FORM } from "./constants";
import {
    canSubmitPasswordRequest,
    doPasswordsMatch,
    getPasswordChecks,
} from "./helpers";
import getErrorMessage from "@/utils/getErrorMessage";
import PageShell from "./components/PageShell";
import ChangePasswordSkeleton from "./components/ChangePasswordSkeleton";
import ChangePasswordLoadError from "./components/ChangePasswordLoadError";
import GoogleAccountNotice from "./components/GoogleAccountNotice";
import StepIndicator from "./components/StepIndicator";
import PasswordRequestForm from "./components/PasswordRequestForm";
import CodeConfirmForm from "./components/CodeConfirmForm";
import FeedbackBanner from "./components/FeedbackBanner";

export default function ChangePasswordView() {
    const { t } = useTranslations();
    const router = useRouter();
    const { data, isLoading, isError } = useGetMeQuery();
    const [requestChange, { isLoading: requesting }] =
        useRequestPasswordChangeMutation();
    const [confirmChange, { isLoading: confirming }] =
        useConfirmPasswordChangeMutation();

    const [step, setStep] = useState("form"); // "form" | "code"
    const [form, setForm] = useState(EMPTY_FORM);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const provider = data?.user?.provider;
    const checks = getPasswordChecks(form.newPassword);
    const passwordsMatch = doPasswordsMatch(form);
    const canSubmit = canSubmitPasswordRequest(form);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
        setError("");
    }

    function handleBackToForm() {
        setStep("form");
        setError("");
        setMessage("");
    }

    async function handleRequest(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!canSubmit) {
            setError(t("changePassword.requirementsError"));
            return;
        }

        try {
            const result = await requestChange(form).unwrap();
            setMessage(result);
            setStep("code");
        } catch (err) {
            setError(getErrorMessage(err, t("shared.defaultError")));
        }
    }

    async function handleConfirm(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            await confirmChange({ code: code.trim() }).unwrap();
            // The backend logged the session out, so the user must sign in again
            router.replace("/login");
        } catch (err) {
            setError(getErrorMessage(err, t("changePassword.invalidCode")));
        }
    }

    if (isLoading) return <ChangePasswordSkeleton />;
    if (isError) return <ChangePasswordLoadError />;
    if (provider === "GOOGLE") return <GoogleAccountNotice />;

    return (
        <PageShell>
            <div className="mx-auto max-w-md">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-stone-900">
                        {t("changePassword.title")}
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        {step === "form"
                            ? t("changePassword.subtitleForm")
                            : t("changePassword.subtitleCode")}
                    </p>
                </header>

                <StepIndicator step={step} />

                {step === "form" && (
                    <PasswordRequestForm
                        form={form}
                        checks={checks}
                        passwordsMatch={passwordsMatch}
                        canSubmit={canSubmit}
                        requesting={requesting}
                        onChange={handleChange}
                        onSubmit={handleRequest}
                    />
                )}

                {step === "code" && (
                    <CodeConfirmForm
                        code={code}
                        confirming={confirming}
                        onCodeChange={setCode}
                        onSubmit={handleConfirm}
                        onBack={handleBackToForm}
                    />
                )}

                {step === "code" && (
                    <FeedbackBanner type="success" message={message} />
                )}
                <FeedbackBanner type="error" message={error} />
            </div>
        </PageShell>
    );
}
