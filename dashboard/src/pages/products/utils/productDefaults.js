let _uid = 0;
export const uid = () => `uid_${++_uid}`;

export const DEFAULT_PRODUCT = {
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    price: "",
    categoryIds: [],
    occasionIds: [],
    hasOffer: false,
    offer: {
        discountType: "",
        discountValue: "",
        startAt: "",
        endAt: "",
        isActive: true,
    },
};
