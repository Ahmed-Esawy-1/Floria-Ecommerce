import JsonLd from "@/components/seo/JsonLd";

import { fetchShopProducts } from "@/lib/api/serverFetch";
import { PAGE_SIZE, PRODUCT_VARIANTS } from "./constants";
import { buildFacetBody, facetsFromSearchParams } from "./helpers";
import { buildListJsonLd } from "./seo";
import ProductsView from "./ProductsView";

export default async function ProductsPage({ variant, locale, searchParams }) {
    const config = PRODUCT_VARIANTS[variant];
    const facets = facetsFromSearchParams(await searchParams);

    const products = await fetchShopProducts(
        {
            ...buildFacetBody(config, facets),
            sortBy: config.sortBy ?? undefined,
        },
        { size: PAGE_SIZE },
    ).catch(() => null);

    const jsonLd = await buildListJsonLd({ locale, variant, products });

    return (
        <>
            <JsonLd data={jsonLd} />
            <ProductsView
                key={JSON.stringify(facets)}
                variant={variant}
                initialFacets={facets}
                initialProducts={products}
            />
        </>
    );
}
