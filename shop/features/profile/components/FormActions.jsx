import Spinner from "@/components/loading/spinner";
import { useTranslations } from "next-intl";

export default function FormActions({ isDirty, saving, onReset }) {
    const t = useTranslations("profile");
    const disabled = !isDirty || saving;

    return (
        <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-6">
            <button
                type="button"
                onClick={onReset}
                disabled={disabled}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {t("cancel")}
            </button>
            <button
                type="submit"
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving && (
                    <Spinner
                        size="sm"
                        fullScreen={false}
                        className="!border-white/30 !border-t-white"
                    />
                )}
                {saving ? t("saving") : t("save")}
            </button>
        </div>
    );
}
