import { useEffect, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "@/api/axios";

const DEFAULT_COUPON = {
    code: "",
    discountType: "PERCENTAGE", // must match your DiscountType enum values
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    startAt: "",
    endAt: "",
    usageLimit: "",
    active: true,
};

const MIN_USAGE_LIMIT = 5;

// LocalDateTime ("2026-10-01T10:30:00") -> datetime-local value ("2026-10-01T10:30")
const toInputDateTime = (value) => (value ? value.slice(0, 16) : "");

const toFormState = (c) => ({
    code: c.code || "",
    discountType: c.discountType || "PERCENTAGE",
    discountValue: c.discountValue != null ? String(c.discountValue) : "",
    minimumOrderAmount:
        c.minimumOrderAmount != null ? String(c.minimumOrderAmount) : "",
    maximumDiscountAmount:
        c.maximumDiscountAmount != null ? String(c.maximumDiscountAmount) : "",
    startAt: toInputDateTime(c.startAt),
    endAt: toInputDateTime(c.endAt),
    usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
    active: c.active ?? true,
});

const inputClass =
    "h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

const isPositive = (v) => {
    const n = parseFloat(v);
    return !isNaN(n) && n > 0;
};

const CouponFormModal = ({
    isOpen,
    onClose,
    onSaved,
    editData = null, // Data | null => Create
}) => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("coupons");

    const [coupon, setCoupon] = useState(DEFAULT_COUPON);
    const [errors, setErrors] = useState(null);
    const [generating, setGenerating] = useState(false);

    // ---- FETCH DATA --------------------------------------------
    useEffect(() => {
        if (editData) {
            setCoupon(toFormState(editData));
        } else {
            resetForm();
        }

        setErrors(null);
    }, [editData, isOpen]);

    // ---- RESET -------------------------------------------
    function resetForm() {
        setCoupon(DEFAULT_COUPON);
    }

    // ---- VALIDATION ---------------------------------------------
    const isValidValue = useMemo(() => {
        if (!isPositive(coupon.discountValue)) return false;
        if (
            coupon.discountType === "PERCENTAGE" &&
            parseFloat(coupon.discountValue) > 100
        )
            return false;
        return true;
    }, [coupon.discountValue, coupon.discountType]);

    const isValidUsageLimit = useMemo(() => {
        const n = parseInt(coupon.usageLimit, 10);
        return !isNaN(n) && n >= MIN_USAGE_LIMIT;
    }, [coupon.usageLimit]);

    const isValidDateRange = useMemo(() => {
        if (!coupon.startAt || !coupon.endAt) return false;
        return new Date(coupon.endAt) > new Date(coupon.startAt);
    }, [coupon.startAt, coupon.endAt]);

    function validate() {
        const newErrors = {};

        if (!coupon.code.trim()) {
            newErrors.code = t("validation.codeRequired");
        }

        if (!isValidValue) {
            newErrors.discountValue = t(
                coupon.discountType === "PERCENTAGE"
                    ? "validation.percentageInvalid"
                    : "validation.valueRequired",
            );
        }

        if (!isPositive(coupon.minimumOrderAmount)) {
            newErrors.minimumOrderAmount = t("validation.minOrderRequired");
        }

        if (!isPositive(coupon.maximumDiscountAmount)) {
            newErrors.maximumDiscountAmount = t(
                "validation.maxDiscountRequired",
            );
        }

        if (!coupon.startAt) {
            newErrors.startAt = t("validation.startRequired");
        }

        if (!coupon.endAt) {
            newErrors.endAt = t("validation.endRequired");
        } else if (coupon.startAt && !isValidDateRange) {
            newErrors.endAt = t("validation.endBeforeStart");
        }

        if (!isValidUsageLimit) {
            newErrors.usageLimit = t("validation.usageLimitInvalid", {
                min: MIN_USAGE_LIMIT,
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ---- DISABLED --------------------------------------------------------
    const isUnchanged = useMemo(() => {
        if (!editData) return false;
        const original = toFormState(editData);
        return Object.keys(original).every((k) => coupon[k] === original[k]);
    }, [coupon, editData]);

    const isDisabled = useMemo(() => {
        const fieldsInvalid =
            coupon.code.trim().length === 0 ||
            !isValidValue ||
            !isPositive(coupon.minimumOrderAmount) ||
            !isPositive(coupon.maximumDiscountAmount) ||
            !isValidDateRange ||
            !isValidUsageLimit;

        return fieldsInvalid || isUnchanged;
    }, [
        coupon.code,
        coupon.minimumOrderAmount,
        coupon.maximumDiscountAmount,
        isValidValue,
        isValidDateRange,
        isValidUsageLimit,
        isUnchanged,
    ]);

    // ---- INPUTS CHANGE --------------------------------------
    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;
        setCoupon((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }

    // ---- GENERATE CODE ---------------------------------------------
    async function handleGenerateCode() {
        setGenerating(true);
        try {
            const { data } = await api.post("coupon/generate-code");
            setCoupon((prev) => ({ ...prev, code: data }));
            setErrors((prev) => (prev ? { ...prev, code: undefined } : null));
        } catch (err) {
            toast.error(
                err?.response?.data?.message || t("toast.generateError"),
            );
        } finally {
            setGenerating(false);
        }
    }

    // ---- SUBMIT ---------------------------------------------------------------------------------------
    // datetime-local gives "yyyy-MM-ddTHH:mm"; LocalDateTime needs seconds-optional ISO
    const withSeconds = (v) => (v.length === 16 ? `${v}:00` : v);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSaved({
                code: coupon.code.trim().toUpperCase(),
                discountType: coupon.discountType,
                discountValue: parseFloat(coupon.discountValue),
                minimumOrderAmount: parseFloat(coupon.minimumOrderAmount),
                maximumDiscountAmount: parseFloat(coupon.maximumDiscountAmount),
                startAt: withSeconds(coupon.startAt),
                endAt: withSeconds(coupon.endAt),
                usageLimit: parseInt(coupon.usageLimit, 10),
                active: coupon.active,
            });
            resetForm();
            onClose();
        } catch (err) {
            // parent already showed the toast; keep the modal open
            console.error(err);
        }
    }

    // ---- CLOSE MODAL ---------------------------------------------
    function handleClose() {
        resetForm();
        setErrors(null);
        onClose();
    }

    if (!isOpen) return null;
    // -----------------------------------------------------

    const fieldError = (name) =>
        errors?.[name] && (
            <p className="text-error text-xs mt-1">{errors[name]}</p>
        );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border border-outline bg-surface-container-low shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline bg-surface-container-low">
                    <div>
                        <h2 className="text-xl font-semibold text-on-surface">
                            {t(editData ? "edit" : "add")}
                        </h2>
                        <p className="text-sm text-on-surface-variant mt-1">
                            {t("form.subtitle")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors"
                    >
                        <CloseIcon className="!text-lg text-on-surface-variant" />
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 flex flex-col gap-5"
                >
                    {/* CODE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-on-surface">
                            {t("form.code")}
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                name="code"
                                placeholder="e.g. SPRING25"
                                dir="ltr"
                                value={coupon.code}
                                onChange={handleInputChange}
                                className={`flex-1 uppercase tracking-wide ${inputClass}`}
                            />
                            {!editData && (
                                <button
                                    type="button"
                                    onClick={handleGenerateCode}
                                    disabled={generating}
                                    title={t("form.generate")}
                                    className="h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest flex items-center justify-center gap-1 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-60"
                                >
                                    <AutorenewIcon
                                        fontSize="small"
                                        className={
                                            generating ? "animate-spin" : ""
                                        }
                                    />
                                    {t("form.generate")}
                                </button>
                            )}
                        </div>
                        {fieldError("code")}
                    </div>

                    {/* DISCOUNT TYPE + VALUE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-on-surface">
                            {t("form.discount")}
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                name="discountValue"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={coupon.discountValue}
                                onChange={handleInputChange}
                                className={`flex-1 ${inputClass}`}
                            />
                            <select
                                name="discountType"
                                value={coupon.discountType}
                                onChange={handleInputChange}
                                className="h-12 px-3 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary text-sm font-medium text-on-surface-variant min-w-24"
                            >
                                <option value="PERCENTAGE">%</option>
                                <option value="FIXED">EGP</option>
                            </select>
                        </div>
                        {fieldError("discountValue")}
                    </div>

                    {/* MIN ORDER + MAX DISCOUNT */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-on-surface">
                                {t("form.minOrder")}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="minimumOrderAmount"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    value={coupon.minimumOrderAmount}
                                    onChange={handleInputChange}
                                    className={`flex-1 min-w-0 ${inputClass}`}
                                />
                                <div className="h-12 px-3 rounded-xl border border-outline bg-surface-container-lowest flex items-center justify-center text-sm font-medium text-on-surface-variant">
                                    EGP
                                </div>
                            </div>
                            {fieldError("minimumOrderAmount")}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-on-surface">
                                {t("form.maxDiscount")}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="maximumDiscountAmount"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    value={coupon.maximumDiscountAmount}
                                    onChange={handleInputChange}
                                    className={`flex-1 min-w-0 ${inputClass}`}
                                />
                                <div className="h-12 px-3 rounded-xl border border-outline bg-surface-container-lowest flex items-center justify-center text-sm font-medium text-on-surface-variant">
                                    EGP
                                </div>
                            </div>
                            {fieldError("maximumDiscountAmount")}
                        </div>
                    </div>

                    {/* START + END */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-on-surface">
                                {t("form.startAt")}
                            </label>
                            <input
                                type="datetime-local"
                                name="startAt"
                                value={coupon.startAt}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                            {fieldError("startAt")}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-on-surface">
                                {t("form.endAt")}
                            </label>
                            <input
                                type="datetime-local"
                                name="endAt"
                                min={coupon.startAt || undefined}
                                value={coupon.endAt}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                            {fieldError("endAt")}
                        </div>
                    </div>

                    {/* USAGE LIMIT */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-on-surface">
                            {t("form.usageLimit")}
                        </label>
                        <input
                            type="number"
                            name="usageLimit"
                            placeholder={String(MIN_USAGE_LIMIT)}
                            step="1"
                            min={MIN_USAGE_LIMIT}
                            value={coupon.usageLimit}
                            onChange={handleInputChange}
                            className={inputClass}
                        />
                        {fieldError("usageLimit")}
                    </div>

                    {/* ACTIVE TOGGLE */}
                    <div className="flex items-center gap-3 pt-2">
                        <label className="flex items-center cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={coupon.active}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-outline cursor-pointer accent-primary"
                            />
                            <span className="text-sm font-medium text-on-surface">
                                {t("form.active")}
                            </span>
                        </label>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 h-12 rounded-xl border border-outline hover:bg-surface-container transition-colors font-medium"
                        >
                            {tCommon("cancel")}
                        </button>

                        <button
                            type="submit"
                            disabled={isDisabled}
                            className={`px-5 py-2 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all h-12
                        ${
                            isDisabled
                                ? "bg-outline cursor-not-allowed opacity-60"
                                : "bg-primary hover:bg-primary/90 shadow-sm"
                        }`}
                        >
                            <SaveIcon fontSize="small" />
                            {t(editData ? "form.update" : "form.save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CouponFormModal;
