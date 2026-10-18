"use client";

import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import {
    selectCartItems,
    selectCartLoading,
    selectSubtotal,
} from "@/features/cart/cartSlice";

import Spinner from "@/components/loading/Spinner";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";

export default function CartView() {
    const t = useTranslations("cart");

    const cartItems = useSelector(selectCartItems);
    const cartLoading = useSelector(selectCartLoading);
    const subtotal = useSelector(selectSubtotal);

    const isEmpty = !cartLoading && cartItems.length === 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6">
                {cartLoading && <Spinner />}

                {isEmpty && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gold/15">
                        <h2 className="text-2xl font-bold text-ink mb-2">
                            {t("emptyTitle")}
                        </h2>
                        <p className="text-slate-500">{t("emptyDesc")}</p>
                    </div>
                )}

                {!cartLoading &&
                    cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
            </div>

            <OrderSummary
                subtotal={subtotal}
                checkoutDisabled={cartLoading || cartItems.length === 0}
            />
        </div>
    );
}
