import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const namespaces = [
    "common",
    "auth",
    "navigation",
    "home",
    "collections",
    "shop",
    "cart",
    "watchlist",
    "orders",
    "product",
    "checkout",
    "confirmation",
    "contact",
    "profile",
    "change-password",
    "chatbot",
];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale)) {
        locale = routing.defaultLocale;
    }

    const modules = await Promise.all(
        namespaces.map((ns) => import(`../messages/${locale}/${ns}.json`)),
    );

    const messages = namespaces.reduce((acc, ns, i) => {
        acc[ns] = modules[i].default;
        return acc;
    }, {});

    return {
        locale,
        messages,
    };
});
