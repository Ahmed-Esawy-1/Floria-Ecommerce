import { Truck, CreditCard, Wallet } from "lucide-react";

export const STEPS = ["info", "review", "payment"];
export const REVIEW_STEP_INDEX = STEPS.indexOf("review");

export const PAYMENT_METHODS = [
    { value: "CASH", labelKey: "cod", icon: Truck, available: true },
    { value: "VISA", labelKey: "card", icon: CreditCard, available: false },
    {
        value: "VODAFONE_CASH",
        labelKey: "wallet",
        icon: Wallet,
        available: false,
    },
];

// 11 digits & starts with 010, 011, 012, or 015
export const PHONE_REGEX = /^01[0125]\d{8}$/;

export const INITIAL_FORM = {
    fullName: "",
    phone: "",
    address: "",
    cityId: "",
    couponCode: "",
};
