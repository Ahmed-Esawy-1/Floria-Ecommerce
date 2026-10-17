"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import { PHONE_REGEX } from "../constants";

const inputClass =
    "w-full rounded-xl border border-gold/20 p-4 text-ink focus:outline-none focus:ring-2 focus:ring-primary/40";
const labelClass = "block text-sm font-semibold text-ink mb-2";

export default function ShippingStep({
    form,
    updateField,
    cities,
    citiesLoading,
    selectedCityObj,
    deliveryPrice,
}) {
    const t = useTranslations("checkout");
    const isRtl = useLocale() === "ar";
    const { formatPrice } = useFormatNumber();

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-primary" />
                <h2 className="text-ink text-2xl font-bold">
                    {t("shippingInfo")}
                </h2>
            </div>

            <div>
                <label className={labelClass}>{t("fullName")}</label>
                <input
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>{t("phone")}</label>
                <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    value={form.phone}
                    onChange={(e) =>
                        updateField("phone", e.target.value.replace(/\D/g, ""))
                    }
                    className={inputClass}
                />
                {form.phone && !PHONE_REGEX.test(form.phone) && (
                    <p className="text-red-500 text-xs mt-1">
                        {t("phoneInvalid")}
                    </p>
                )}
            </div>

            <div>
                <label className={labelClass}>{t("city")}</label>
                <select
                    value={form.cityId}
                    disabled={citiesLoading}
                    onChange={(e) => updateField("cityId", e.target.value)}
                    className={`${inputClass} bg-white`}
                >
                    <option value="">{t("selectCity")}</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {isRtl ? city.nameAr : city.nameEn}
                            {" — "}
                            {formatPrice(city.deliveryPrice)}
                        </option>
                    ))}
                </select>

                {selectedCityObj && (
                    <p className="text-slate-500 text-sm mt-2">
                        {t("delivery")}:{" "}
                        <span className="text-ink font-semibold">
                            {formatPrice(deliveryPrice)}
                        </span>
                    </p>
                )}
            </div>

            <div>
                <label className={labelClass}>{t("address")}</label>
                <textarea
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={4}
                    placeholder={t("addressPlaceholder")}
                    className={inputClass}
                />
            </div>
        </div>
    );
}
