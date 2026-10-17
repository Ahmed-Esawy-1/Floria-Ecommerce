import { DEFAULT_FILTERS } from "./constants";

// (sorted & unique & remove invalid values)
// "3,1,2" => [1, 2, 3]
export const parseIds = (param) => {
    if (!param) return [];
    const ids = param
        .split(",")
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0);
    return [...new Set(ids)].sort((a, b) => a - b);
};

export const toggleId = (list, id) =>
    list.includes(id)
        ? list.filter((item) => item !== id)
        : [...list, id].sort((a, b) => a - b);

// Shared by /shop/products & products/price-range
export const buildFacetBody = (config, facets) => ({
    ...facets,
    ...(config.onOffer ? { onOffer: true } : {}),
});

// Read the url from Next's searchParams
// { categoryIds: "3,1" } => { categoryIds: [1, 3], occasionIds: [], colorIds: [] }
export function facetsFromSearchParams(sp = {}) {
    const first = (v) => (Array.isArray(v) ? v[0] : v);
    return {
        ...DEFAULT_FILTERS,
        categoryIds: parseIds(first(sp.categoryIds)),
        occasionIds: parseIds(first(sp.occasionIds)),
    };
}
