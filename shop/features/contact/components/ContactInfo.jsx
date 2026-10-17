import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import {
    CONTACT_EMAIL,
    CONTACT_PHONE,
    OPENING_HOURS,
    SOCIAL_LINKS,
    STORE_COORDINATES,
} from "../constants";

const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-heading text-ink mb-6">{children}</h2>
);

export default async function ContactInfo() {
    const tCommon = await getTranslations("common");
    const t = await getTranslations("contact.info");

    const { lat, lng } = STORE_COORDINATES;
    const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    const details = [
        { icon: MapPin, title: t("addressTitle"), value: tCommon("address") },
        {
            icon: Phone,
            title: t("phoneTitle"),
            value: CONTACT_PHONE,
            href: `#`,
        },
        {
            icon: Mail,
            title: t("emailTitle"),
            value: CONTACT_EMAIL,
            href: ``,
        },
    ];

    return (
        <div className="space-y-12">
            {/* ADDRESS, PHONE, EMAIL */}
            <div>
                <SectionTitle>{t("atelierTitle")}</SectionTitle>
                <ul className="space-y-6">
                    {details.map(({ icon: Icon, title, value, href }) => (
                        <li key={title} className="flex items-start gap-4">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Icon size={20} />
                            </span>
                            <div>
                                <p className="font-bold text-ink">{title}</p>
                                {href ? (
                                    <Link
                                        href={href}
                                        dir="ltr"
                                        className="text-text hover:text-primary transition-colors"
                                    >
                                        {value}
                                    </Link>
                                ) : (
                                    <p className="text-text">{value}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* OPENING HOURS */}
            <div>
                <SectionTitle>{t("hoursTitle")}</SectionTitle>
                <div className="flex items-center gap-2 mb-4 text-text">
                    <Clock size={18} className="text-primary" />
                </div>
                <dl className="grid grid-cols-2 gap-4 text-sm text-text">
                    {OPENING_HOURS.map(({ key, open, close }) => (
                        <div key={key} className="contents">
                            <dt>{t(`hours.${key}`)}</dt>
                            <dd dir="ltr" className="text-end">
                                {open} – {close}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* SOCIAL */}
            <div>
                <SectionTitle>{t("followTitle")}</SectionTitle>
                <ul className="flex gap-4">
                    {SOCIAL_LINKS.map(({ key, href, icon: Icon }) => (
                        <li key={key}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t(`social.${key}`)}
                                className="flex size-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-all"
                            >
                                <Icon size={18} />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* MAP */}
            <iframe
                src={mapSrc}
                title={t("mapTitle")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-64 rounded-xl border border-primary/10 shadow-xl"
            />
        </div>
    );
}
