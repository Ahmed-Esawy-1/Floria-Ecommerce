import { getTranslations } from "next-intl/server";
import ContactView from "@/features/contact/ContactView";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "contact.seo" });

    return {
        title: t("title"),
        description: t("description"),
        alternates: {
            canonical: `/${locale}/contact`,
            languages: { en: "/en/contact", ar: "/ar/contact" },
        },
        openGraph: {
            title: t("title"),
            description: t("description"),
            type: "website",
        },
    };
}

export default function ContactPage() {
    return <ContactView />;
}
