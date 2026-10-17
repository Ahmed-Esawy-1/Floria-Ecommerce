import React, { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

import Loading from "@/components/Loading";
import MultiSelect from "@/components/MultiSelect";
import ColorRow from "./ColorRow";
import ImageModeModal from "./ImageModeModal";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import PaletteIcon from "@mui/icons-material/Palette";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { useProductForm } from "../hooks/useProductForm";

const ProductForm = ({ mode, productId, onSuccess }) => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("products");
    const { language } = useLanguage();

    const form = useProductForm({ mode, productId, onSuccess });
    const {
        isEdit,
        product,
        categories,
        occasions,
        colorPresets,
        hasColors,
        generalImages,
        productColors,
        loading,
        fetchLoading,
        errors,
        modeModal,
        handleInputChange,
        setProduct,
        reorderGeneralImages,
        reorderColorImages,
        handleGeneralFileChange,
        removeGeneralImage,
        addColor,
        removeColor,
        addColorImages,
        removeColorImage,
        requestToggle,
        confirmToggle,
        cancelToggle,
        canSubmit,
        handleFormSubmit,
        resetForm,
    } = form;

    const generalFileRef = useRef(null);
    const [draggingGeneralIndex, setDraggingGeneralIndex] = useState(null);
    const [dragOverGeneralIndex, setDragOverGeneralIndex] = useState(null);

    if (fetchLoading) return <Loading />;

    return (
        <>
            <form
                onSubmit={handleFormSubmit}
                className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
            >
                <div className="flex flex-wrap gap-3">
                    {/* EN NAME */}
                    <div className="flex-1 min-w-60">
                        <label className="required block text-on-surface-variant mb-2">
                            {t("form.nameEn")}
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                            placeholder="e.g. Rose Elegance Bouquet"
                            dir="ltr"
                            type="text"
                            name="nameEn"
                            value={product.nameEn}
                            onChange={handleInputChange}
                        />
                        {errors.nameEn && (
                            <p className="text-error text-sm mt-1">
                                {errors.nameEn}
                            </p>
                        )}
                    </div>
                    {/* AR NAME */}
                    <div className="flex-1 min-w-60">
                        <label className="required block text-on-surface-variant mb-2">
                            {t("form.nameAr")}
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                            placeholder="مثال: باقة ورود روز إليجانس"
                            dir="rtl"
                            type="text"
                            name="nameAr"
                            value={product.nameAr}
                            onChange={handleInputChange}
                        />
                        {errors.nameAr && (
                            <p className="text-error text-sm mt-1">
                                {errors.nameAr}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* PRICE */}
                    <div className="min-w-60 flex-1">
                        <label className="required block text-on-surface-variant mb-2">
                            {t("form.price")}
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                            placeholder={t("form.pricePlaceholder")}
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                        />
                        {errors.price && (
                            <p className="text-error text-sm mt-1">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* CATEGORY */}
                    <div className="min-w-60 flex-1">
                        <MultiSelect
                            label={tCommon("category")}
                            options={categories}
                            selectedIds={product.categoryIds}
                            onChange={(ids) =>
                                setProduct((p) => ({ ...p, categoryIds: ids }))
                            }
                            getLabel={(c) =>
                                language === "en" ? c.nameEn : c.nameAr
                            }
                        />
                    </div>

                    {/* OCCASIONS */}
                    <div className="min-w-60 flex-1">
                        <MultiSelect
                            label={tCommon("occasion")}
                            options={occasions}
                            selectedIds={product.occasionIds}
                            onChange={(ids) =>
                                setProduct((p) => ({ ...p, occasionIds: ids }))
                            }
                            getLabel={(o) =>
                                language === "en" ? o.nameEn : o.nameAr
                            }
                        />
                    </div>
                </div>

                {/* IMAGES */}
                <div>
                    <label className="required block text-on-surface-variant mb-2">
                        {t("form.images")}
                    </label>

                    <div
                        onClick={requestToggle}
                        className="flex items-center gap-3 p-4 mb-4 border border-outline-variant rounded-xl bg-surface-container-lowest cursor-pointer select-none hover:border-primary transition-all"
                    >
                        <div
                            className={`relative w-11 h-6 rounded-full transition-all ${hasColors ? "bg-indigo-600" : "bg-slate-300"}`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${hasColors ? "left-6" : "left-1"}`}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                {hasColors
                                    ? t("form.variant")
                                    : t("form.general")}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                {hasColors
                                    ? t("form.variantBody")
                                    : t("form.generalBody")}
                            </p>
                        </div>
                    </div>

                    {!hasColors && (
                        <div>
                            <input
                                ref={generalFileRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleGeneralFileChange}
                            />

                            {generalImages.length === 0 ? (
                                <div
                                    onClick={() =>
                                        generalFileRef.current?.click()
                                    }
                                    className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                >
                                    <AddPhotoAlternateIcon className="!text-3xl text-on-surface-variant" />
                                    <p className="text-sm text-on-surface-variant">
                                        {t("form.generalDropzone")}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {generalImages.map((img, index) => (
                                        <div
                                            key={img.id ?? img.uid}
                                            draggable
                                            onDragStart={() =>
                                                setDraggingGeneralIndex(index)
                                            }
                                            onDragEnter={() =>
                                                setDragOverGeneralIndex(index)
                                            }
                                            onDragOver={(e) =>
                                                e.preventDefault()
                                            }
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                if (
                                                    draggingGeneralIndex !==
                                                    null
                                                ) {
                                                    reorderGeneralImages(
                                                        draggingGeneralIndex,
                                                        index,
                                                    );
                                                }
                                                setDraggingGeneralIndex(null);
                                                setDragOverGeneralIndex(null);
                                            }}
                                            onDragEnd={() => {
                                                setDraggingGeneralIndex(null);
                                                setDragOverGeneralIndex(null);
                                            }}
                                            className={`relative group max-h-60 aspect-[6/7] cursor-grab active:cursor-grabbing transition-all ${
                                                draggingGeneralIndex === index
                                                    ? "opacity-40"
                                                    : ""
                                            } ${
                                                dragOverGeneralIndex ===
                                                    index &&
                                                draggingGeneralIndex !== index
                                                    ? "ring-2 ring-primary rounded-xl"
                                                    : ""
                                            }`}
                                        >
                                            <img
                                                src={img.preview}
                                                alt=""
                                                className="w-full h-full object-cover rounded-xl border border-outline-variant"
                                            />
                                            {index === 0 && (
                                                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-black/60 text-white rounded-b-xl py-0.5">
                                                    cover
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeGeneralImage(img)
                                                }
                                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <CloseIcon className="!text-[10px]" />
                                            </button>
                                        </div>
                                    ))}

                                    <div
                                        onClick={() =>
                                            generalFileRef.current?.click()
                                        }
                                        className="max-h-60 aspect-[6/7] rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-on-surface-variant text-xs"
                                    >
                                        <span className="text-2xl">+</span>
                                        <span>Add more</span>
                                    </div>
                                </div>
                            )}

                            {errors.images && (
                                <p className="text-error text-sm mt-2">
                                    {errors.images}
                                </p>
                            )}
                        </div>
                    )}

                    {hasColors && (
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {colorPresets.map((c) => {
                                    const isAdded = productColors.some(
                                        (pc) => pc.colorId === c.id,
                                    );
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => addColor(c)}
                                            disabled={isAdded}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-all ${
                                                isAdded
                                                    ? "border-primary bg-primary/10 text-primary cursor-default"
                                                    : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary"
                                            }`}
                                        >
                                            <span
                                                className="w-3 h-3 rounded-full border border-outline-variant"
                                                style={{
                                                    background: c.hexCode,
                                                }}
                                            />
                                            {c.name}
                                            {isAdded && (
                                                <span className="ml-1">✓</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {productColors.length === 0 ? (
                                <div className="flex flex-col items-center py-10 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant gap-2">
                                    <PaletteIcon className="!text-3xl" />
                                    <p className="text-sm">
                                        {t("form.variantDropzone")}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {productColors.map((color) => (
                                        <ColorRow
                                            key={
                                                color.productColorId ??
                                                color.colorId
                                            }
                                            color={color}
                                            onRemoveColor={removeColor}
                                            onAddImages={addColorImages}
                                            onRemoveImage={removeColorImage}
                                            onReorderImage={reorderColorImages}
                                        />
                                    ))}
                                </div>
                            )}

                            {errors.colors && (
                                <p className="text-error text-sm mt-2">
                                    {errors.colors}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* EN DESCRIPTION */}
                <div>
                    <label className="block text-on-surface-variant mb-2">
                        {t("form.descriptionEn")}
                    </label>
                    <textarea
                        rows={5}
                        name="descriptionEn"
                        value={product.descriptionEn}
                        onChange={handleInputChange}
                        placeholder="Describe the product…"
                        dir="ltr"
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-outline"
                    />
                </div>

                {/* AR DESCRIPTION */}
                <div>
                    <label className="block text-on-surface-variant mb-2">
                        {t("form.descriptionAr")}
                    </label>
                    <textarea
                        rows={5}
                        name="descriptionAr"
                        value={product.descriptionAr}
                        onChange={handleInputChange}
                        placeholder="أدخل وصفًا للمنتج..."
                        dir="rtl"
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-outline"
                    />
                </div>

                {/* OFFER */}
                <div>
                    <label className="block text-on-surface-variant mb-2">
                        {t("form.offer")}
                    </label>

                    <div
                        onClick={() =>
                            setProduct((p) => ({ ...p, hasOffer: !p.hasOffer }))
                        }
                        className="flex items-center gap-3 p-4 mb-4 border border-outline-variant rounded-xl bg-surface-container-lowest cursor-pointer select-none hover:border-primary transition-all"
                    >
                        <div
                            className={`relative w-11 h-6 rounded-full transition-all ${product.hasOffer ? "bg-indigo-600" : "bg-slate-300"}`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${product.hasOffer ? "left-6" : "left-1"}`}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                {t("form.hasOffer")}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                {t("form.hasOfferBody")}
                            </p>
                        </div>
                    </div>

                    {product.hasOffer && (
                        <div className="flex flex-wrap gap-3 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                            <div className="min-w-48 flex-1">
                                <label className="required block text-on-surface-variant mb-2 text-sm">
                                    {t("form.discountType")}
                                </label>
                                <select
                                    name="discountType"
                                    value={product.offer?.discountType || ""}
                                    onChange={(e) =>
                                        setProduct((p) => ({
                                            ...p,
                                            offer: {
                                                ...p.offer,
                                                discountType: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface"
                                >
                                    <option value="">
                                        {t("form.selectType")}
                                    </option>
                                    <option value="PERCENTAGE">
                                        {t("form.percentage")}
                                    </option>
                                    <option value="FIXED">
                                        {t("form.fixedAmount")}
                                    </option>
                                </select>
                                {errors.offer?.discountType && (
                                    <p className="text-error text-sm mt-1">
                                        {errors.offer.discountType}
                                    </p>
                                )}
                            </div>

                            <div className="min-w-48 flex-1">
                                <label className="required block text-on-surface-variant mb-2 text-sm">
                                    {t("form.discountValue")}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={product.offer?.discountValue || ""}
                                    onChange={(e) =>
                                        setProduct((p) => ({
                                            ...p,
                                            offer: {
                                                ...p.offer,
                                                discountValue: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface"
                                />
                                {errors.offer?.discountValue && (
                                    <p className="text-error text-sm mt-1">
                                        {errors.offer.discountValue}
                                    </p>
                                )}
                            </div>

                            <div className="min-w-48 flex-1">
                                <label className="required block text-on-surface-variant mb-2 text-sm">
                                    {t("form.startAt")}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={product.offer?.startAt || ""}
                                    onChange={(e) =>
                                        setProduct((p) => ({
                                            ...p,
                                            offer: {
                                                ...p.offer,
                                                startAt: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface"
                                />
                            </div>

                            <div className="min-w-48 flex-1">
                                <label className="required block text-on-surface-variant mb-2 text-sm">
                                    {t("form.endAt")}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={product.offer?.endAt || ""}
                                    onChange={(e) =>
                                        setProduct((p) => ({
                                            ...p,
                                            offer: {
                                                ...p.offer,
                                                endAt: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface"
                                />
                            </div>

                            <div className="min-w-48 flex-1 flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="offerIsActive"
                                    checked={product.offer?.isActive ?? true}
                                    onChange={(e) =>
                                        setProduct((p) => ({
                                            ...p,
                                            offer: {
                                                ...p.offer,
                                                isActive: e.target.checked,
                                            },
                                        }))
                                    }
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <label
                                    htmlFor="offerIsActive"
                                    className="text-sm font-medium text-on-surface cursor-pointer select-none"
                                >
                                    {t("form.offerActive")}
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {tCommon("cancel")}
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !canSubmit}
                        className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                            loading || !canSubmit
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        <SaveIcon fontSize="small" />
                        {loading
                            ? tCommon("saving")
                            : isEdit
                              ? t("form.editSave")
                              : t("form.createSave")}
                    </button>
                </div>
            </form>

            <ImageModeModal
                isOpen={modeModal.open}
                targetMode={modeModal.targetMode}
                itemCount={
                    hasColors ? productColors.length : generalImages.length
                }
                onClose={cancelToggle}
                onConfirm={confirmToggle}
            />
        </>
    );
};

export default ProductForm;
