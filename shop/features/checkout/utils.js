import { PHONE_REGEX } from "./constants";

// Errors
export const getOrderError = (err, t) => {
    const message = err?.data?.message;

    if (typeof message !== "string") {
        return { text: t("orderFailed"), couponRelated: false };
    }

    // Some products already have an active offer
    if (message.includes("active offer")) {
        return { text: t("couponOfferConflict"), couponRelated: true };
    }

    return { text: message, couponRelated: false };
};

// First step
export const isInfoStepValid = (form) =>
    form.fullName.trim().length > 1 &&
    PHONE_REGEX.test(form.phone) &&
    form.address.trim().length > 5 &&
    form.cityId !== "";

// Request payload
export const buildOrderPayload = ({ form, paymentMethod, cartItems }) => {
    const couponCode = form.couponCode.trim();

    return {
        fullName: form.fullName.trim(),
        phone: form.phone,
        address: form.address.trim(),
        cityId: Number(form.cityId),
        paymentMethod,
        couponCode: couponCode || undefined,
        items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        })),
    };
};
