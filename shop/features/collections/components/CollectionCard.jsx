import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { API_URL } from "@/lib/config";

export default async function CollectionCard({ item, queryParam }) {
    const locale = await getLocale();
    const name = locale === "en" ? item.nameEn : item.nameAr;

    return (
        <Link
            href={`/shop?${queryParam}=${item.id}`}
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-marble border border-gold/20 hover:border-gold/60 transition-all"
        >
            <Image
                src={resolveImageUrl(`${API_URL}${item.imageUrl}`)}
                alt={`${name} thumbnail`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/20 to-transparent" />

            <h3 className="absolute bottom-6 left-6 right-6 text-white text-2xl font-accent font-semibold drop-shadow-md">
                {name}
            </h3>
        </Link>
    );
}
