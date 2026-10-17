import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function ContactHero() {
    const t = await getTranslations("contact.hero");

    return (
        <section className="relative h-[360px] md:h-[420px] overflow-hidden bg-ink">
            <Image
                src="/images/contactus.jpeg"
                alt={t("imageAlt")}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-marble-light to-transparent" />

            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">
                    {t("label")}
                </span>
                <h1 className="text-4xl md:text-6xl font-heading font-light text-ink mb-4">
                    {t("title")}
                </h1>
                <p className="max-w-xl text-text leading-relaxed">
                    {t("description")}
                </p>
            </div>
        </section>
    );
}
