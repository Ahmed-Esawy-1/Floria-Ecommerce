import ProductsPage from "@/features/shop/ProductsPage";
import { buildListMetadata } from "@/features/shop/seo";

const VARIANT = "newArrivals";

export async function generateMetadata({ params, searchParams }) {
    const { locale } = await params;
    return buildListMetadata({ locale, variant: VARIANT, searchParams });
}

export default async function Page({ params, searchParams }) {
    const { locale } = await params;
    return (
        <ProductsPage
            variant={VARIANT}
            locale={locale}
            searchParams={searchParams}
        />
    );
}
