import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

const CollectionGrid = async ({
    items, // (categories | occasions)
    locale, // (en | ar)
    t,
    tCommon,
    queryParam, // (categoryIds | occasionIds)
    emptyTitleKey, // Empty Title Key
    emptyDescKey, // Empty Description Key
}) => {
    const description = items.length > 0 ? t("description") : t(emptyDescKey);

    return (
        <main className="container mx-auto px-6 py-12">
            {/* HEADER */}
            <div className="mb-12">
                <nav className="flex items-center gap-2 text-xs text-text mb-4 uppercase tracking-widest">
                    <Link className="hover:text-primary" href="/">
                        {tCommon("home")}
                    </Link>
                    <ChevronRight
                        className={`${locale === "ar" ? "rotate-180" : ""}`}
                        size={14}
                    />
                    <span className="text-ink">
                        {tCommon(
                            queryParam === "categoryIds"
                                ? "categories"
                                : "occasions",
                        )}
                    </span>
                </nav>
                <h1 className="text-4xl md:text-5xl font-accent font-bold text-ink mb-4">
                    {t("title")}
                </h1>
                <p className="text-text max-w-2xl leading-relaxed">
                    {description}
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.length === 0 ? (
                    // EMPTY STATE
                    <div className="col-span-full text-center py-20">
                        <h2 className="text-2xl font-semibold mb-2 text-ink">
                            {t(emptyTitleKey)}
                        </h2>
                        <p className="text-text">{t(emptyDescKey)}</p>
                    </div>
                ) : (
                    // ITEMS
                    items.map((item) => (
                        <Link
                            key={item.id}
                            className="group occasion-card relative overflow-hidden rounded-2xl aspect-[4/5] bg-marble border border-gold/20 hover:border-gold/60 transition-all"
                            href={`/shop?${queryParam}=${item.id}`}
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                                alt={`${item.nameEn} thumbnail`}
                                fill
                                className="occasion-img object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority={false}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/10 to-transparent" />

                            {/* Text */}
                            <h3 className="absolute bottom-6 left-6 text-white text-2xl font-accent font-semibold">
                                {locale === "en" ? item.nameEn : item.nameAr}
                            </h3>
                        </Link>
                    ))
                )}
            </div>
        </main>
    );
};

export default CollectionGrid;
