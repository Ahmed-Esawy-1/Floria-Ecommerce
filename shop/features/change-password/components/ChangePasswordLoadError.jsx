import { useTranslations } from "next-intl";
import PageShell from "./PageShell";

export default function ChangePasswordLoadError() {
    const { t } = useTranslations();

    return (
        <PageShell centered>
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-red-200">
                <p className="font-medium text-red-700">
                    {t("shared.loadError.title")}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                    {t("shared.loadError.hint")}
                </p>
            </div>
        </PageShell>
    );
}
