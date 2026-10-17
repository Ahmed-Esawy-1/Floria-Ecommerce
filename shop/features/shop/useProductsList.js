"use client";

import { useCallback, useMemo, useState } from "react";

import {
    useGetColorsQuery,
    useGetShopProductsQuery,
    useGetShopPriceRangeQuery,
} from "@/lib/api/shopApi";
import {
    useGetCategoriesQuery,
    useGetOccasionsQuery,
} from "@/lib/api/collectionsApi";
import useWatchlistIds from "@/hooks/useWatchlistIds";

import { DEFAULT_FILTERS, EMPTY_RANGE, PAGE_SIZE } from "./constants";
import { buildFacetBody, toggleId } from "./helpers";

export function useProductsList(
    config, // (sortBy / onOffer)
    initialFacets = DEFAULT_FILTERS, // read from the URL on the server like (categoryIds)
    initialProducts = null, // first page of products fetched on the server (or null)
) {
    const [facets, setFacets] = useState(initialFacets);
    const [price, setPrice] = useState(null); // null => full range
    const [page, setPage] = useState(0);

    const { data: categories = [], isLoading: categoriesLoading } =
        useGetCategoriesQuery();
    const { data: occasions = [], isLoading: occasionsLoading } =
        useGetOccasionsQuery();
    const { data: colors = [], isLoading: colorsLoading } = useGetColorsQuery();
    const watchlistIds = useWatchlistIds();

    const body = useMemo(
        () => buildFacetBody(config, facets),
        [config, facets],
    );

    const { data: priceData, isLoading: priceLoading } =
        useGetShopPriceRangeQuery(body);

    const {
        data: productsInfo,
        isLoading: productsLoading,
        isFetching,
    } = useGetShopProductsQuery({
        ...body,
        page,
        size: PAGE_SIZE,
        sortBy: config.sortBy ?? undefined,
        ...(price ?? {}),
    });

    // True while the user still looks at exactly what the server rendered
    const isInitialState =
        page === 0 &&
        price === null &&
        JSON.stringify(facets) === JSON.stringify(initialFacets);

    const current = productsInfo ?? (isInitialState ? initialProducts : null);

    // ---- HANDLERS ----
    const toggleFacet = useCallback((key, id) => {
        setPage(0);
        setPrice(null);
        setFacets((prev) => ({ ...prev, [key]: toggleId(prev[key], id) }));
    }, []);

    const changePrice = useCallback((next) => {
        setPage(0);
        setPrice(next ? { minPrice: next.min, maxPrice: next.max } : null);
    }, []);

    const clearAll = useCallback(() => {
        setPage(0);
        setPrice(null);
        setFacets(DEFAULT_FILTERS);
    }, []);

    const loadMore = useCallback(() => setPage((p) => p + 1), []);

    return {
        filters: facets,
        price,
        toggleFacet,
        changePrice,
        clearAll,

        products: current?.content ?? [],
        totalElements: current?.totalElements ?? 0,
        hasMore: current ? !current.last : false,
        loadMore,

        // Skeleton only when there is no data at all (neither server nor client)
        isLoading: productsLoading && !current,
        isFetching,
        filtersLoading:
            categoriesLoading ||
            occasionsLoading ||
            colorsLoading ||
            priceLoading,

        data: {
            categories,
            occasions,
            colors,
            priceRange: priceData ?? EMPTY_RANGE,
        },
        watchlistIds,
    };
}
