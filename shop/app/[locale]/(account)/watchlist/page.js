import { getTranslations } from "next-intl/server";
import WatchlistView from "@/features/watchlist/WatchlistView";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "watchlist" });

    return {
        title: t("title"),
        robots: { index: false, follow: false },
    };
}

export default function WatchlistPage() {
    return <WatchlistView />;
}
