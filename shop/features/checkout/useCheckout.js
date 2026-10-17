"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useDispatch, useSelector } from "react-redux";

import { selectCartItems, clear } from "@/features/cart/cartSlice";
import { useCreateOrderMutation } from "@/lib/api/ordersApi";
import { useGetAvailableCitiesQuery } from "@/lib/api/citiesApi";
import { getUnitPrice } from "@/utils/price";

import { INITIAL_FORM, REVIEW_STEP_INDEX, STEPS } from "./constants";
import { buildOrderPayload, getOrderError, isInfoStepValid } from "./utils";

export function useCheckout(t) {
    const router = useRouter();
    const locale = useLocale();
    const isRtl = locale === "ar";
    const dispatch = useDispatch();

    const cartItems = useSelector(selectCartItems);

    // ---- STATE -------------------------------
    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [paymentNotice, setPaymentNotice] = useState(null);
    const [error, setError] = useState(null);

    const isPlacingRef = useRef(false);

    const { data: cities = [], isLoading: citiesLoading } =
        useGetAvailableCitiesQuery();
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    // No Cart Items -> redirect to cart page
    useEffect(() => {
        if (cartItems.length === 0 && !isPlacingRef.current) {
            router.replace("/cart");
        }
    }, [cartItems.length, router]);

    // ---- DERIVED VALUES ----
    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (acc, item) => acc + getUnitPrice(item) * item.quantity,
                0,
            ),
        [cartItems],
    );

    const selectedCityObj = useMemo(
        () => cities.find((c) => String(c.id) === String(form.cityId)) ?? null,
        [cities, form.cityId],
    );

    const selectedCity = selectedCityObj
        ? isRtl
            ? selectedCityObj.nameAr
            : selectedCityObj.nameEn
        : "";

    // Display only. The server calculates the real total.
    const deliveryPrice = Number(selectedCityObj?.deliveryPrice ?? 0);
    const total = subtotal + deliveryPrice;
    const couponCode = form.couponCode.trim();
    const step = STEPS[stepIndex];

    // ---- VALIDATION -----------------------------
    const canGoNext = () => {
        if (step === "info") return isInfoStepValid(form);
        if (step === "review") return cartItems.length > 0;
        return true;
    };

    // ---- HANDLERS ----
    const updateField = (name, value) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    const handleCouponChange = (value) => {
        updateField("couponCode", value);
        setError(null);
    };

    const goNext = () => {
        if (!canGoNext()) return;
        setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    };

    const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

    const handleSelectPayment = (method) => {
        if (!method.available) {
            setPaymentNotice(t("paymentUnavailable"));
            return;
        }
        setPaymentNotice(null);
        setPaymentMethod(method.value);
    };

    // ---- SUBMIT FORM ---------------------------
    const handlePlaceOrder = async () => {
        if (!paymentMethod) return;
        setError(null);

        isPlacingRef.current = true;

        try {
            const payload = buildOrderPayload({
                form,
                paymentMethod,
                cartItems,
            });
            const order = await createOrder(payload).unwrap();
            dispatch(clear());
            router.push(`/checkout/confirmation?orderId=${order.orderId}`);
        } catch (err) {
            isPlacingRef.current = false;
            const { text, couponRelated } = getOrderError(err, t);
            setError(text);
            if (couponRelated) setStepIndex(REVIEW_STEP_INDEX);
        }
    };

    return {
        step,
        stepIndex,
        form,
        updateField,
        handleCouponChange,
        cartItems,
        cities,
        citiesLoading,
        selectedCityObj,
        selectedCity,
        subtotal,
        deliveryPrice,
        total,
        couponCode,
        paymentMethod,
        paymentNotice,
        handleSelectPayment,
        error,
        isLoading,
        canGoNext: canGoNext(),
        goNext,
        goBack,
        handlePlaceOrder,
    };
}
