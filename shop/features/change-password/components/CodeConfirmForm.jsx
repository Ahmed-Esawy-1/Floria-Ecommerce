import { useTranslations } from "next-intl";
import { INPUT_CLASS } from "../constants";
import Spinner from "@/components/loading/spinner";

export default function CodeConfirmForm({
    code,
    confirming,
    onCodeChange,
    onSubmit,
    onBack,
}) {
    const { t } = useTranslations();

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"
        >
            <div className="rounded-lg bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-800 ring-1 ring-emerald-200">
                {t("changePassword.codeSent")}
            </div>

            <div>
                <label
                    htmlFor="code"
                    className="block text-sm font-medium text-stone-700"
                >
                    {t("changePassword.codeLabel")}
                </label>
                <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value)}
                    maxLength={6}
                    required
                    className={`${INPUT_CLASS} text-center text-lg tracking-[0.5em]`}
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                    {t("changePassword.back")}
                </button>
                <button
                    type="submit"
                    disabled={confirming || code.trim().length === 0}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {confirming && <Spinner />}
                    {confirming
                        ? t("changePassword.confirming")
                        : t("changePassword.confirm")}
                </button>
            </div>
        </form>
    );
}
