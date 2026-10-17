import { BASE_URL } from "@/api/config";

export function mapProductResponse(data) {
    // Product Basic Info
    const loadedProduct = {
        nameEn: data.nameEn || "",
        nameAr: data.nameAr || "",
        price: data.price || "",
        descriptionEn: data.descriptionEn || "",
        descriptionAr: data.descriptionAr || "",
        categoryIds: (data.categories ?? []).map((c) => c.id),
        occasionIds: (data.occasions ?? []).map((o) => o.id),

        // Offer
        hasOffer: Boolean(data.hasOffer),
        offer: data.offer
            ? {
                  discountType: data.offer.discountType || "",
                  discountValue: data.offer.discountValue ?? "",
                  startAt: data.offer.startAt || "",
                  endAt: data.offer.endAt || "",
                  isActive: data.offer.isActive ?? true,
              }
            : {
                  discountType: "",
                  discountValue: "",
                  startAt: "",
                  endAt: "",
                  isActive: true,
              },
    };

    // Color Mode
    const colorMode = Boolean(data.hasColor);

    // General Image
    const loadedGeneralImages = !colorMode
        ? (data.images ?? []).map((img) => ({
              id: img.id,
              existing: true,
              preview: BASE_URL + img.imageUrl,
          }))
        : [];

    // Variant Color
    const loadedProductColors = colorMode
        ? (data.productColors ?? []).map((c) => ({
              productColorId: c.id,
              colorId: c.colorId,
              nameEn: c.nameEn,
              nameAr: c.nameAr,
              hex: c.hexCode,
              isNew: false,
              images: (c.images ?? []).map((img) => ({
                  id: img.id,
                  existing: true,
                  preview: BASE_URL + img.imageUrl,
              })),
          }))
        : [];

    return {
        loadedProduct,
        colorMode,
        loadedGeneralImages,
        loadedProductColors,
    };
}

// To Compare for update to handle the disabled Submit
export function buildComparable(p, hc, gImgs, cColors) {
    return JSON.stringify({
        nameEn: p.nameEn,
        nameAr: p.nameAr,
        price: String(p.price),
        descriptionEn: (p.descriptionEn || "").trim(),
        descriptionAr: (p.descriptionAr || "").trim(),
        categoryIds: [...(p.categoryIds || [])].sort((a, b) => a - b),
        occasionIds: [...(p.occasionIds || [])].sort((a, b) => a - b),
        hasColors: hc,
        generalImages: gImgs.map((img) =>
            img.existing ? `existing:${img.id}` : `new:${img.uid}`,
        ),
        productColors: cColors.map((c) => ({
            colorId: c.colorId,
            images: c.images.map((img) =>
                img.existing ? `existing:${img.id}` : `new:${img.uid}`,
            ),
        })),
        hasOffer: Boolean(p.hasOffer),
        offer: p.hasOffer
            ? {
                  discountType: p.offer?.discountType || "",
                  discountValue: String(p.offer?.discountValue ?? ""),
                  startAt: p.offer?.startAt || "",
                  endAt: p.offer?.endAt || "",
                  isActive: Boolean(p.offer?.isActive ?? true),
              }
            : null,
    });
}
