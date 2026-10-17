import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

i18n.use(
    resourcesToBackend(
        (language, namespace) =>
            import(`./locales/${language}/${namespace}.json`),
    ),
)
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem("lang") || "en",
        fallbackLng: "en",
        supportedLngs: ["en", "ar"],
        ns: ["common"],
        defaultNS: "common",
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: true,
        },
    });

i18n.on("languageChanged", (lng) => {
    document.documentElement.dir = i18n.dir(lng);
    document.documentElement.lang = lng;
});

document.documentElement.dir = i18n.dir(i18n.language);
document.documentElement.lang = i18n.language;

export default i18n;
