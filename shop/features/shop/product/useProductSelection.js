"use client";

import { useState } from "react";

export function useProductSelection(product) {
    const [colorId, setColorId] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const colors = product?.hasColor ? (product.productColors ?? []) : [];

    const selectedColor =
        colors.find((c) => c.id === colorId) ?? colors[0] ?? null;

    // Images of its selected color
    const images = selectedColor
        ? (selectedColor.images ?? [])
        : (product?.images ?? []);

    const mainImage =
        images.find((img) => img.imageUrl === imageUrl)?.imageUrl ??
        images[0]?.imageUrl ??
        product?.primaryImageUrl ??
        null;

    const selectColor = (id) => {
        setColorId(id);
        setImageUrl(null); // back to the first image of the new color
    };

    return {
        colors,
        selectedColor,
        images,
        mainImage,
        selectColor,
        selectImage: setImageUrl,
    };
}
