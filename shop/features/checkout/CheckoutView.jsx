"use client";

import { useTranslations } from "next-intl";

import { useCheckout } from "./useCheckout";
import CheckoutStepper from "./components/CheckoutStepper";
import ShippingStep from "./components/ShippingStep";
import ReviewStep from "./components/ReviewStep";
import PaymentStep from "./components/PaymentStep";
import CheckoutNavigation from "./components/CheckoutNavigation";

export default function CheckoutView() {
    const t = useTranslations("checkout");
    const checkout = useCheckout(t);

    return (
        <div className="flex-1 px-6 md:px-20 py-10 bg-marble-light">
            <div className="max-w-4xl mx-auto">
                <CheckoutStepper stepIndex={checkout.stepIndex} />

                <div className="bg-white p-8 rounded-2xl border border-gold/15 shadow-sm">
                    {checkout.step === "info" && (
                        <ShippingStep
                            form={checkout.form}
                            updateField={checkout.updateField}
                            cities={checkout.cities}
                            citiesLoading={checkout.citiesLoading}
                            selectedCityObj={checkout.selectedCityObj}
                            deliveryPrice={checkout.deliveryPrice}
                        />
                    )}

                    {checkout.step === "review" && (
                        <ReviewStep
                            form={checkout.form}
                            cartItems={checkout.cartItems}
                            selectedCity={checkout.selectedCity}
                            couponCode={checkout.couponCode}
                            subtotal={checkout.subtotal}
                            deliveryPrice={checkout.deliveryPrice}
                            total={checkout.total}
                            onCouponChange={checkout.handleCouponChange}
                        />
                    )}

                    {checkout.step === "payment" && (
                        <PaymentStep
                            paymentMethod={checkout.paymentMethod}
                            paymentNotice={checkout.paymentNotice}
                            onSelect={checkout.handleSelectPayment}
                            total={checkout.total}
                            couponCode={checkout.couponCode}
                        />
                    )}

                    {checkout.error && (
                        <p className="text-red-500 text-sm mt-4 text-center">
                            {checkout.error}
                        </p>
                    )}

                    <CheckoutNavigation
                        stepIndex={checkout.stepIndex}
                        step={checkout.step}
                        canGoNext={checkout.canGoNext}
                        isLoading={checkout.isLoading}
                        paymentMethod={checkout.paymentMethod}
                        onBack={checkout.goBack}
                        onNext={checkout.goNext}
                        onPlace={checkout.handlePlaceOrder}
                    />
                </div>
            </div>
        </div>
    );
}
