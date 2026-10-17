import { useTranslations } from "next-intl";
import PageShell from "./PageShell";

export default function GoogleAccountNotice() {
    const { t } = useTranslations();

    return (
        <PageShell centered>
            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl">
                    🔒
                </div>
                <h1 className="text-lg font-bold text-stone-900">
                    {t("changePassword.googleTitle")}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {t("changePassword.googleBody")}
                </p>
            </div>
        </PageShell>
    );
}
