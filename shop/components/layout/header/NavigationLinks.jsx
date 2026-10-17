import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

export default function NavigationLinks({ items, basePath, onClose }) {
    const locale = useLocale();
    const t = useTranslations("common");

    const query = basePath === "categories" ? "categoryIds" : "occasionIds";

    return (
        <>
            {items.map((item) => (
                <li key={item.id}>
                    <Link
                        href={`/shop?${query}=${item.id}`}
                        onClick={onClose}
                        className="block px-5 py-2.5 text-sm text-ink hover:text-primary hover:bg-rose/15 transition-colors"
                    >
                        {locale === "en" ? item.nameEn : item.nameAr}
                    </Link>
                </li>
            ))}

            <li>
                <Link
                    href={`/${basePath}`}
                    onClick={onClose}
                    className="flex gap-1 items-center px-5 py-2.5 text-sm font-semibold text-primary hover:bg-rose/15 hover:rounded-2xl transition-colors"
                >
                    {t("viewAll")}{" "}
                    <ArrowRight size={18} className="rtl:rotate-180 !text-sm" />
                </Link>
            </li>
        </>
    );
}
