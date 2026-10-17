import { useTranslations } from "next-intl";

export default function StepIndicator({ step }) {
    const { t } = useTranslations();
    const isVerify = step === "code";

    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                    1
                </span>
                <span className="text-sm font-medium text-stone-700">
                    {t("changePassword.stepData")}
                </span>
            </div>

            <div
                className={`h-px flex-1 ${isVerify ? "bg-emerald-500" : "bg-stone-300"}`}
            />

            <div className="flex items-center gap-2">
                <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        isVerify
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-200 text-stone-500"
                    }`}
                >
                    2
                </span>
                <span
                    className={`text-sm font-medium ${isVerify ? "text-stone-700" : "text-stone-400"}`}
                >
                    {t("changePassword.stepVerify")}
                </span>
            </div>
        </div>
    );
}
