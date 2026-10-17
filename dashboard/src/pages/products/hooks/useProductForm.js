import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import api from "@/api/axios";
import { DEFAULT_PRODUCT, uid } from "../utils/productDefaults";
import { mapProductResponse, buildComparable } from "../utils/productMapper";

export function useProductForm({ mode, productId, onSuccess }) {
    const { t } = useTranslation("products");
    const isEdit = mode === "edit";
    const originalStateRef = useRef(null);

    // ---- STATE ----------------------------------
    const [product, setProduct] = useState(DEFAULT_PRODUCT);
    const [categories, setCategories] = useState([]);
    const [occasions, setOccasions] = useState([]);
    const [colorPresets, setColorPresets] = useState([]);

    const [hasColors, setHasColors] = useState(false);
    const originalHasColorsRef = useRef(null);

    const [generalImages, setGeneralImages] = useState([]);
    const [removedGeneralImageIds, setRemovedGeneralImageIds] = useState([]);

    const [productColors, setProductColors] = useState([]);
    const [removedProductColorIds, setRemovedProductColorIds] = useState([]);
    const [removedColorImageIds, setRemovedColorImageIds] = useState({});

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEdit);
    const [errors, setErrors] = useState({});

    const [modeModal, setModeModal] = useState({
        open: false,
        targetMode: null,
    });

    // ---- FETCH DATA ------------------------------------------------------------------------------------
    useEffect(() => {
        async function fetchAll() {
            try {
                const requests = [
                    api.get("/categories"),
                    api.get("/occasions"),
                    api.get("/colors"),
                ];
                if (isEdit) requests.push(api.get(`/product/${productId}`));

                const [categoriesRes, occasionsRes, colorsRes, productRes] =
                    await Promise.all(requests);

                setCategories(categoriesRes.data);
                setOccasions(occasionsRes.data);
                setColorPresets(colorsRes.data);

                if (isEdit && productRes) {
                    const {
                        loadedProduct,
                        colorMode,
                        loadedGeneralImages,
                        loadedProductColors,
                    } = mapProductResponse(productRes.data);

                    setProduct(loadedProduct);
                    setHasColors(colorMode);
                    originalHasColorsRef.current = colorMode;
                    setGeneralImages(loadedGeneralImages);
                    setProductColors(loadedProductColors);

                    originalStateRef.current = {
                        product: loadedProduct,
                        hasColors: colorMode,
                        generalImages: loadedGeneralImages,
                        productColors: loadedProductColors,
                    };
                }
            } catch (err) {
                console.error(err);
                toast.error(t("toast.loadError"));
            } finally {
                setFetchLoading(false);
            }
        }
        fetchAll();
    }, [isEdit, productId]);

    // ---- INPUT CHANGE -----------------------------------------------------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // ---- REORDER -------------------------------------------------------------------------------------------
    const reorderGeneralImages = useCallback((fromIndex, toIndex) => {
        setGeneralImages((prev) => {
            if (fromIndex === toIndex) return prev;
            const updated = [...prev];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return updated;
        });
    }, []);

    const reorderColorImages = useCallback((colorId, fromIndex, toIndex) => {
        setProductColors((prev) =>
            prev.map((pc) => {
                if (pc.colorId !== colorId || fromIndex === toIndex) return pc;
                const updatedImages = [...pc.images];
                const [moved] = updatedImages.splice(fromIndex, 1);
                updatedImages.splice(toIndex, 0, moved);
                return { ...pc, images: updatedImages };
            }),
        );
    }, []);

    // ---- GENERAL IMAGE ----------------------------------------------------------

    const handleGeneralFileChange = (e) => {
        const files = Array.from(e.target.files);
        const mapped = files.map((f) => ({
            uid: uid(),
            file: f,
            existing: false,
            preview: URL.createObjectURL(f),
        }));
        setGeneralImages((prev) => [...prev, ...mapped]);
        e.target.value = "";
    };

    const removeGeneralImage = (img) => {
        if (img.existing) {
            setRemovedGeneralImageIds((prev) => [...prev, img.id]);
        }
        setGeneralImages((prev) =>
            prev.filter((p) =>
                img.existing ? p.id !== img.id : p.uid !== img.uid,
            ),
        );
    };

    // ---- VARIANT COLOR ----------------------------------------------------------------------------

    const addColor = useCallback((preset) => {
        setProductColors((prev) => {
            if (prev.some((c) => c.colorId === preset.id)) return prev;
            return [
                ...prev,
                {
                    productColorId: null,
                    colorId: preset.id,
                    nameEn: preset.nameEn,
                    nameAr: preset.nameAr,
                    hex: preset.hexCode,
                    isNew: true,
                    images: [],
                },
            ];
        });
    }, []);

    const removeColor = useCallback((colorId, productColorId) => {
        if (productColorId) {
            setRemovedProductColorIds((prev) => [...prev, productColorId]);
        }
        setProductColors((prev) => prev.filter((c) => c.colorId !== colorId));
    }, []);

    const addColorImages = useCallback((colorId, files) => {
        const newImgs = Array.from(files)
            .filter((f) => f.type.startsWith("image/"))
            .map((f) => ({
                uid: uid(),
                file: f,
                existing: false,
                preview: URL.createObjectURL(f),
            }));

        setProductColors((prev) =>
            prev.map((pc) =>
                pc.colorId === colorId
                    ? { ...pc, images: [...pc.images, ...newImgs] }
                    : pc,
            ),
        );
    }, []);

    const removeColorImage = useCallback((colorId, img) => {
        if (img.existing && img.id) {
            setRemovedColorImageIds((prev) => {
                const existing = prev[colorId] ?? [];
                if (existing.includes(img.id)) return prev;
                return { ...prev, [colorId]: [...existing, img.id] };
            });
        }
        setProductColors((prev) =>
            prev.map((pc) =>
                pc.colorId === colorId
                    ? {
                          ...pc,
                          images: pc.images.filter((i) =>
                              img.existing
                                  ? i.id !== img.id
                                  : i.uid !== img.uid,
                          ),
                      }
                    : pc,
            ),
        );
    }, []);

    // ---- MODE TOGGLE --------------------------------------------------------------------------

    const requestToggle = (setModeModalFn = setModeModal) => {
        const targetMode = hasColors ? "general" : "color";
        const itemCount = hasColors
            ? productColors.length
            : generalImages.length;

        if (itemCount === 0) {
            setHasColors((prev) => !prev);
            setErrors({});
            return;
        }
        setModeModalFn({ open: true, targetMode });
    };

    const confirmToggle = () => {
        if (hasColors) {
            setProductColors([]);
            setRemovedProductColorIds([]);
            setRemovedColorImageIds({});
        } else {
            setGeneralImages([]);
            setRemovedGeneralImageIds([]);
        }
        setHasColors((prev) => !prev);
        setErrors({});
        setModeModal({ open: false, targetMode: null });
    };

    const cancelToggle = () => setModeModal({ open: false, targetMode: null });

    // ---- VALIDATION -------------------------------------------------------------------------------------
    const validate = () => {
        const newErrors = {};
        if (!product.nameEn.trim())
            newErrors.nameEn = t("validation.nameEnRequired");
        if (!product.nameAr.trim())
            newErrors.nameAr = t("validation.nameArRequired");
        if (!product.price || Number(product.price) <= 0)
            newErrors.price = t("validation.priceRequired");

        if (!hasColors) {
            if (generalImages.length === 0)
                newErrors.images = t("validation.imagesRequired");
        } else {
            if (productColors.length === 0) {
                newErrors.colors = t("validation.colorsRequired");
            } else if (productColors.some((c) => c.images.length === 0)) {
                newErrors.colors = t("validation.colorImagesRequired");
            }
        }

        if (product.hasOffer) {
            if (!product.offer?.discountType)
                newErrors.offer = {
                    ...newErrors.offer,
                    discountType: t("validation.discountTypeRequired"),
                };
            if (
                !product.offer?.discountValue ||
                Number(product.offer.discountValue) <= 0
            )
                newErrors.offer = {
                    ...newErrors.offer,
                    discountValue: t("validation.discountValueRequired"),
                };
            if (!product.offer?.startAt)
                newErrors.offer = {
                    ...newErrors.offer,
                    startAt: t("validation.startAtRequired"),
                };
            if (!product.offer?.endAt)
                newErrors.offer = {
                    ...newErrors.offer,
                    endAt: t("validation.endAtRequired"),
                };
            else if (
                product.offer?.startAt &&
                product.offer.endAt <= product.offer.startAt
            )
                newErrors.offer = {
                    ...newErrors.offer,
                    endAt: t("validation.endAtAfterStart"),
                };
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---- DISABLED -----------------------------------------------------------------------------------

    const requiredFieldsFilled =
        product.nameEn.trim() !== "" &&
        product.nameAr.trim() !== "" &&
        product.price !== "" &&
        Number(product.price) > 0 &&
        (hasColors
            ? productColors.length > 0 &&
              productColors.every((c) => c.images.length > 0)
            : generalImages.length > 0) &&
        (!product.hasOffer ||
            (product.offer?.discountType &&
                Number(product.offer?.discountValue) > 0 &&
                product.offer?.startAt &&
                product.offer?.endAt));

    const isDirty =
        !isEdit ||
        !originalStateRef.current ||
        buildComparable(product, hasColors, generalImages, productColors) !==
            buildComparable(
                originalStateRef.current.product,
                originalStateRef.current.hasColors,
                originalStateRef.current.generalImages,
                originalStateRef.current.productColors,
            );

    const canSubmit = requiredFieldsFilled && isDirty;

    // ---- SUBMIT ------------------------------------------------------------------------------------------------
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!canSubmit) return;

        setLoading(true);

        try {
            const formData = new FormData();
            const modeSwitched =
                isEdit && originalHasColorsRef.current !== null
                    ? originalHasColorsRef.current !== hasColors
                    : false;

            if (isEdit) {
                // ---- EDIT
                const data = {
                    nameEn: product.nameEn,
                    nameAr: product.nameAr,
                    descriptionEn: product.descriptionEn,
                    descriptionAr: product.descriptionAr,
                    price: Number(product.price),
                    hasColor: hasColors,
                    categoryIds: product.categoryIds,
                    occasionIds: product.occasionIds,
                    removeCategoryIds: product.removeCategoryIds ?? [],
                    removeOccasionIds: product.removeOccasionIds ?? [],
                    modeSwitched,
                    hasOffer: product.hasOffer,
                    offer: product.hasOffer
                        ? {
                              discountType: product.offer.discountType,
                              discountValue: product.offer.discountValue,
                              startAt: product.offer.startAt,
                              endAt: product.offer.endAt,
                              isActive: product.offer.isActive ?? true,
                          }
                        : null,
                };

                if (!hasColors) {
                    data.removeImageIds = removedGeneralImageIds;
                    data.generalImageOrder = generalImages.map((img) =>
                        img.existing ? `existing:${img.id}` : `new:${img.uid}`,
                    );
                    generalImages
                        .filter((img) => !img.existing)
                        .forEach((img) => formData.append("images", img.file));
                } else {
                    data.removeColorIds = removedProductColorIds;

                    data.colorsMeta = productColors.map((c) => ({
                        colorId: c.colorId,
                        productColorId: c.productColorId,
                        isNew: c.isNew,
                        removeImageIds: removedColorImageIds[c.colorId] ?? [],
                        imageOrder: c.images.map((img) =>
                            img.existing
                                ? `existing:${img.id}`
                                : `new:${img.uid}`,
                        ),
                    }));

                    productColors.forEach((c) => {
                        c.images
                            .filter((img) => !img.existing)
                            .forEach((img) =>
                                formData.append(`color_${c.colorId}`, img.file),
                            );
                    });
                }

                formData.append(
                    "data",
                    new Blob([JSON.stringify(data)], {
                        type: "application/json",
                    }),
                );
            } else {
                // ---- CREATE
                formData.append("nameEn", product.nameEn);
                formData.append("nameAr", product.nameAr);
                formData.append("price", String(product.price));
                formData.append("descriptionEn", product.descriptionEn);
                formData.append("descriptionAr", product.descriptionAr);
                formData.append("hasColor", String(hasColors));

                product.categoryIds.forEach((id) =>
                    formData.append("categoryIds", id),
                );
                product.occasionIds.forEach((id) =>
                    formData.append("occasionIds", id),
                );

                if (!hasColors) {
                    generalImages
                        .filter((img) => !img.existing)
                        .forEach((img) => formData.append("images", img.file));
                } else {
                    const colorsMeta = productColors.map((c) => ({
                        colorId: c.colorId,
                        productColorId: c.productColorId,
                        isNew: c.isNew,
                        imageOrder: c.images.map((img) =>
                            img.existing
                                ? `existing:${img.id}`
                                : `new:${img.uid}`,
                        ),
                    }));

                    productColors.forEach((c) => {
                        c.images
                            .filter((img) => !img.existing)
                            .forEach((img) =>
                                formData.append(`color_${c.colorId}`, img.file),
                            );
                    });

                    formData.append("colorsMeta", JSON.stringify(colorsMeta));
                }

                formData.append("hasOffer", String(product.hasOffer));
                if (product.hasOffer) {
                    formData.append(
                        "offer.discountType",
                        product.offer.discountType,
                    );
                    formData.append(
                        "offer.discountValue",
                        String(product.offer.discountValue),
                    );
                    formData.append("offer.startAt", product.offer.startAt);
                    formData.append("offer.endAt", product.offer.endAt);
                    formData.append(
                        "offer.isActive",
                        String(product.offer.isActive ?? true),
                    );
                }
            }

            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };

            if (isEdit) {
                const res = await api.put(
                    `product/update/${productId}/full`,
                    formData,
                    config,
                );
                toast.success(t("toast.updateSuccess"));

                const {
                    loadedProduct,
                    colorMode,
                    loadedGeneralImages,
                    loadedProductColors,
                } = mapProductResponse(res.data);

                setProduct(loadedProduct);
                setHasColors(colorMode);
                originalHasColorsRef.current = colorMode;
                setGeneralImages(loadedGeneralImages);
                setProductColors(loadedProductColors);

                originalStateRef.current = {
                    product: loadedProduct,
                    hasColors: colorMode,
                    generalImages: loadedGeneralImages,
                    productColors: loadedProductColors,
                };

                setRemovedGeneralImageIds([]);
                setRemovedProductColorIds([]);
                setRemovedColorImageIds({});
                setErrors({});

                onSuccess?.(res.data);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                await api.post("/product/create", formData, config);
                toast.success(t("toast.createSuccess"));
                window.scrollTo({ top: 0, behavior: "smooth" });
                onSuccess?.();
            }
        } catch (err) {
            console.error(err?.response?.data);
            toast.error(t(isEdit ? "toast.updateError" : "toast.createError"));
        } finally {
            setLoading(false);
        }
    };

    // ---- RESET --------------------------------------------------------------------------
    const resetForm = () => {
        if (isEdit && originalStateRef.current) {
            const snap = originalStateRef.current;
            setProduct(snap.product);
            setHasColors(snap.hasColors);
            setGeneralImages(snap.generalImages);
            setProductColors(snap.productColors);
        } else {
            setProduct(DEFAULT_PRODUCT);
            setHasColors(false);
            setGeneralImages([]);
            setProductColors([]);
        }
        setRemovedGeneralImageIds([]);
        setRemovedProductColorIds([]);
        setRemovedColorImageIds({});
        setErrors({});
        setModeModal({ open: false, targetMode: null });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
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
    };
}
