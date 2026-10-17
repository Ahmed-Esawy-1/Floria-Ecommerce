import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CollectionHeader({ config }) {
    const locale = await getLocale();
    const t = await getTranslations(config.namespace);
    const tCommon = await getTranslations("common");

    return (
        <div className="mb-12">
            <nav className="flex items-center gap-2 text-xs text-text mb-4 uppercase tracking-widest">
                <Link className="hover:text-primary" href="/">
                    {tCommon("home")}
                </Link>
                <ChevronRight
                    size={14}
                    className={locale === "ar" ? "rotate-180" : ""}
                />
                <span className="text-ink">{tCommon(config.navKey)}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-accent font-bold text-ink mb-4">
                {t("title")}
            </h1>
        </div>
    );
}
