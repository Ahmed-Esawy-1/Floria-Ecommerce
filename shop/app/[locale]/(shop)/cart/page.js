import CartView from "@/features/cart/CartView";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("cart");

    return {
        title: t("title"),
        robots: { index: false, follow: false },
    };
}

export default async function CartPage() {
    const t = await getTranslations("cart");

    return (
        <div className="flex-1 px-6 md:px-20 py-10 bg-marble-light">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-ink text-4xl font-extrabold tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-primary/70 text-lg font-medium">
                        {t("subtitle")}
                    </p>
                </div>

                <CartView />
            </div>
        </div>
    );
}
