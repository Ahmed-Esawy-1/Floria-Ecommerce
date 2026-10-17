export const PAGE_SIZE = 12;

export const DEFAULT_FILTERS = {
    categoryIds: [],
    occasionIds: [],
    colorIds: [],
};

export const EMPTY_RANGE = {};

// Type of products
export const PRODUCT_VARIANTS = {
    all: { path: "/shop", sortBy: null, onOffer: false },
    newArrivals: {
        path: "/shop/new-arrivals",
        sortBy: "newest",
        onOffer: false,
    },
    bestSellers: {
        path: "/shop/best-sellers",
        sortBy: "bestSellers",
        onOffer: false,
    },
    offers: { path: "/shop/offers", sortBy: null, onOffer: true },
};
