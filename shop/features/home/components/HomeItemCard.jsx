"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { API_URL } from "@/lib/config";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

// Card for an occasion or a category
export default function HomeItemCard({ item, href, rounded = false }) {
    const locale = useLocale();
    const name = locale === "en" ? item.nameEn : item.nameAr;

    return (
        <Link href={href} className="group block">
            <div
                className={`relative aspect-square overflow-hidden mb-4 bg-marble-light shadow-sm ring-1 ring-gold/25 group-hover:ring-gold group-hover:shadow-xl transition-all ${
                    rounded ? "rounded-full" : "rounded-3xl"
                }`}
            >
                <Image
                    src={resolveImageUrl(item.imageUrl)}
                    alt={`${name} thumbnail`}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
            </div>
            <p className="text-center font-bold text-sm uppercase tracking-wider text-ink">
                {name}
            </p>
        </Link>
    );
}
