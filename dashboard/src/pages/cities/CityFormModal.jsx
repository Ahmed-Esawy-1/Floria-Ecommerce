import { useEffect, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

const DEFAULT_CITY = {
    nameEn: "",
    nameAr: "",
    deliveryPrice: "",
    available: true,
};

const CityFormModal = ({
    isOpen,
    onClose,
    onSaved,
    editData = null, // Data | null => Create
}) => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("cities");

    const [city, setCity] = useState(DEFAULT_CITY);
    const [errors, setErrors] = useState(null);

    // ---- FETCH DATA --------------------------------------------
    useEffect(() => {
        if (editData) {
            setCity({
                nameEn: editData.nameEn || "",
                nameAr: editData.nameAr || "",
                deliveryPrice: editData.deliveryPrice || "",
                available: editData.available ?? true,
            });
        } else {
            resetForm();
        }

        setErrors(null);
    }, [editData, isOpen]);

    // ---- RESET -------------------------------------------
    function resetForm() {
        setCity(DEFAULT_CITY);
    }

    // ---- VALIDATION ---------------------------------------------
    const isValidPrice = useMemo(() => {
        const price = parseFloat(city.deliveryPrice);
        return !isNaN(price) && price > 0;
    }, [city.deliveryPrice]);

    function validate() {
        const newErrors = {};

        if (!city.nameEn.trim()) {
            newErrors.nameEn = t("validation.nameEnRequired");
        }

        if (!city.nameAr.trim()) {
            newErrors.nameAr = t("validation.nameArRequired");
        }

        if (!city.deliveryPrice || !isValidPrice) {
            newErrors.deliveryPrice = t("validation.priceRequired");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ---- DISABLED --------------------------------------------------------

    const isUnchanged = useMemo(() => {
        if (!editData) return false;
        return (
            city.nameEn === (editData.nameEn || "") &&
            city.nameAr === (editData.nameAr || "") &&
            city.deliveryPrice === (editData.deliveryPrice || "") &&
            city.available === (editData.available ?? true)
        );
    }, [city, editData]);

    const isDisabled = useMemo(() => {
        const fieldsInvalid =
            city.nameEn.trim().length === 0 ||
            city.nameAr.trim().length === 0 ||
            !city.deliveryPrice ||
            !isValidPrice;

        return fieldsInvalid || isUnchanged;
    }, [
        city.nameEn,
        city.nameAr,
        city.deliveryPrice,
        isValidPrice,
        isUnchanged,
    ]);

    // ---- INPUTS CHANGE --------------------------------------
    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;
        setCity((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }

    // ---- SUBMIT ---------------------------------------------------------------------------------------
    async function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSaved({
                nameEn: city.nameEn.trim(),
                nameAr: city.nameAr.trim(),
                deliveryPrice: parseFloat(city.deliveryPrice),
                available: city.available,
            });
            resetForm();
            onClose();
        } catch (err) {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-outline bg-surface-container-low shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
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
                    {/* ENGLISH NAME */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-on-surface">
                            {tCommon("name")}{" "}
                            <span className="text-on-surface-variant">
                                ({tCommon("english")})
                            </span>
                        </label>
                        <input
                            type="text"
                            name="nameEn"
                            placeholder="e.g. Cairo"
                            value={city.nameEn}
                            onChange={handleInputChange}
                            className="h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                        {errors?.nameEn && (
                            <p className="text-error text-xs mt-1">
                                {errors.nameEn}
                            </p>
                        )}
                    </div>

                    {/* ARABIC NAME */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-on-surface">
                            {tCommon("name")}{" "}
                            <span className="text-on-surface-variant">
                                ({tCommon("arabic")})
                            </span>
                        </label>
                        <input
                            type="text"
                            name="nameAr"
                            placeholder="e.g. القاهرة"
                            dir="rtl"
                            value={city.nameAr}
                            onChange={handleInputChange}
                            className="h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                        {errors?.nameAr && (
                            <p className="text-error text-xs mt-1">
                                {errors.nameAr}
                            </p>
                        )}
                    </div>

                    {/* DELIVERY PRICE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-on-surface">
                            {t("form.deliveryPrice")}
                        </label>
                        <div className="flex items-stretch gap-2">
                            <input
                                type="number"
                                name="deliveryPrice"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={city.deliveryPrice}
                                onChange={handleInputChange}
                                className="w-full min-w-0 h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <div className="h-12 px-4 shrink-0 rounded-xl border border-outline bg-surface-container-lowest flex items-center justify-center text-sm font-medium text-on-surface-variant">
                                EGP
                            </div>
                        </div>
                        {errors?.deliveryPrice && (
                            <p className="text-error text-xs mt-1">
                                {errors.deliveryPrice}
                            </p>
                        )}
                    </div>

                    {/* AVAILABLE TOGGLE */}
                    <div className="flex items-center gap-3 pt-2">
                        <label className="flex items-center cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                name="available"
                                checked={city.available}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-outline cursor-pointer accent-primary"
                            />
                            <span className="text-sm font-medium text-on-surface">
                                {t("form.available")}
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

export default CityFormModal;
