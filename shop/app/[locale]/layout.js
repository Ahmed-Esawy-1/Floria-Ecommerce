import "./globals.css";
import "./app.css";

import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import StoreProvider from "@/providers/storeProvider";
import CartInitializer from "@/features/cart/CartInitializer";
import AuthInitializer from "@/features/auth/AuthInitializer";
import { fetchCategories, fetchOccasions } from "@/lib/api/serverFetch";
import { collectionsApi } from "@/lib/api/collectionsApi";
import { makeStore } from "@/lib/store";
import { SITE_URL } from "@/lib/config";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "common" });
    const siteName = t("siteName");

    return {
        metadataBase: new URL(SITE_URL),

        title: {
            default: siteName,
            template: `%s | ${siteName}`,
        },

        description: t("seoDescription"),

        icons: {
            icon: "/images/logo.webp",
        },

        verification: {
            google: "fjbbZTAImv1c4b1sp0G8AzZyTOBYKWqO5qC4-kPLuss",
        },

        openGraph: {
            siteName,
            type: "website",
            locale: locale === "ar" ? "ar_EG" : "en_US",
            alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
        },
    };
}

// ---- FONTS ---------------------------------------------
import {
    Inter,
    Cormorant_Garamond,
    Playwrite_GB_J,
    Alexandria,
    Aref_Ruqaa,
} from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body-en",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-heading-en",
});

const playwrite = Playwrite_GB_J({
    subsets: ["latin"],
    variable: "--font-accent-en",
});

const alexandria = Alexandria({
    subsets: ["arabic"],
    variable: "--font-body-ar",
});

const arefRuqaa = Aref_Ruqaa({
    subsets: ["arabic"],
    weight: ["400", "700"],
    variable: "--font-heading-ar",
});

export default async function RootLayout({ children, params }) {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) notFound();

    const messages = await getMessages({ locale });

    const [categories, occasions] = await Promise.all([
        fetchCategories().catch(() => []),
        fetchOccasions().catch(() => []),
    ]);

    const store = makeStore();

    // Store the fetched data in Redux cache
    await Promise.all([
        categories?.length > 0
            ? store.dispatch(
                  collectionsApi.util.upsertQueryData(
                      "getCategories",
                      undefined,
                      categories,
                  ),
              )
            : Promise.resolve(),
        occasions?.length > 0
            ? store.dispatch(
                  collectionsApi.util.upsertQueryData(
                      "getOccasions",
                      undefined,
                      occasions,
                  ),
              )
            : Promise.resolve(),
    ]);

    const preloadedState = store.getState();

    return (
        <html
            lang={locale}
            dir={locale === "ar" ? "rtl" : "ltr"}
            suppressHydrationWarning
            className={[
                inter.variable,
                cormorant.variable,
                playwrite.variable,
                alexandria.variable,
                arefRuqaa.variable,
            ].join(" ")}
        >
            <body>
                <StoreProvider preloadedState={preloadedState}>
                    <NextIntlClientProvider messages={messages}>
                        <AuthInitializer>
                            <CartInitializer>
                                <div>
                                    <Header
                                        categories={categories}
                                        occasions={occasions}
                                    />
                                    {children}
                                    <Footer />
                                </div>
                                <Toaster richColors position="top-center" />
                            </CartInitializer>
                        </AuthInitializer>
                    </NextIntlClientProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
