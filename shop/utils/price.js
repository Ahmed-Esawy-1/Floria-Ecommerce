export const getPriceInfo = (price, priceAfterDiscount) => {
    const original = Number(price ?? 0);
    const discounted = Number(priceAfterDiscount);

    const hasDiscount =
        priceAfterDiscount != null &&
        Number.isFinite(discounted) &&
        discounted < original;

    return {
        finalPrice: hasDiscount ? discounted : original,
        oldPrice: hasDiscount ? original : null,
        discountPercent: hasDiscount
            ? Math.round(((original - discounted) / original) * 100)
            : 0,
        hasDiscount,
    };
};

export const getUnitPrice = (item) =>
    getPriceInfo(item?.price, item?.priceAfterDiscount).finalPrice;
