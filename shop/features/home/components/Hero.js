import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { Flower2 } from "lucide-react";

export default async function Hero() {
    const t = await getTranslations("home.hero");

    return (
        <section className="relative w-full min-h-screen bg-gradient-to-br from-[#fdfbf7] via-white to-[#f3ecdd] overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 h-screen flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-12 bg-gradient-to-r from-primary to-transparent" />
                            <span className="text-xs font-bold text-primary uppercase tracking-[0.15em]">
                                {t("label")}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-light leading-[1.1] text-ink">
                            <span className="block">{t("title_line1")}</span>
                            <span className="block text-primary">
                                {t("title_line2")}
                            </span>
                        </h1>

                        <div className="flex gap-4 items-start max-w-2xl pt-4">
                            <Flower2
                                size={40}
                                strokeWidth={1.5}
                                className="mt-2 shrink-0 text-primary"
                            />
                            <p className="text-lg text-text leading-relaxed font-light">
                                {t("description")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Link
                                href="/shop"
                                className="px-10 py-4 bg-primary text-white font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                            >
                                {t("button_primary")}
                            </Link>
                            <Link
                                href="/shop/offers"
                                className="px-10 py-4 bg-transparent border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-center"
                            >
                                {t("button_secondary")}
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block relative h-[600px]">
                        <div className="absolute inset-0 bg-gold rounded-3xl rotate-6 opacity-20" />
                        <div className="absolute inset-0 bg-rose rounded-3xl -rotate-3 opacity-15" />

                        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/40">
                            <Image
                                src="/images/hero.jpg"
                                alt="Premium bouquets and vases"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                priority
                                sizes="50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
