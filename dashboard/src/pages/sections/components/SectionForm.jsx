import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axios";
import { BASE_URL } from "@/api/config";
import MultiSelect from "@/components/MultiSelect";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const MIN_PRODUCTS = 5;
const MAX_PRODUCTS = 15;

export default function SectionForm({ initialData, onSubmit, submitting }) {
    const { language } = useLanguage();
    const { t: tMain } = useTranslation();
    const { t } = useTranslation("sections");

    const [nameEn, setNameEn] = useState(initialData?.nameEn ?? "");
    const [nameAr, setNameAr] = useState(initialData?.nameAr ?? "");
    const [products, setProducts] = useState(initialData?.products ?? []);
    const [removedProductIds, setRemovedProductIds] = useState([]);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [errors, setErrors] = useState({});

    // ---- CATEGORY & OCCASION -------------------------------------
    const [categories, setCategories] = useState([]);
    const [occasions, setOccasions] = useState([]);
    const [categoryIds, setCategoryIds] = useState(
        initialData?.categoryIds ?? [],
    );
    const [occasionIds, setOccasionIds] = useState(
        initialData?.occasionIds ?? [],
    );

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [categoriesRes, occasionsRes] = await Promise.all([
                    api.get("/categories"),
                    api.get("/occasions"),
                ]);
                setCategories(categoriesRes.data);
                setOccasions(occasionsRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load categories & occasions");
            }
        }
        fetchOptions();
    }, []);

    // ---- URL VISIT ----------------------------------------------------------------
    const urlVisit = buildUrlVisit(categoryIds, occasionIds); // Read Only

    function buildUrlVisit(catIds, occIds) {
        if (!catIds.length && !occIds.length) {
            return "";
        }

        const params = new URLSearchParams();
        if (catIds.length) params.set("categoryIds", catIds.join(","));
        if (occIds.length) params.set("occasionIds", occIds.join(","));
        return `?${params.toString()}`;
    }

    // ---- SEARCH PRODUCTS ----------------------------------------------------
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const handle = setTimeout(async () => {
            try {
                setSearching(true);
                const { data } = await api.get("/products/search", {
                    params: { keyword: query },
                });
                setResults(
                    data.filter(
                        (p) => !products.some((sp) => sp.productId === p.id),
                    ),
                );
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);
        return () => clearTimeout(handle);
    }, [query, products]);

    // ---- PRODUCT LIST MANAGEMENT --------------------------------------------
    function addProduct(product) {
        if (products.length >= MAX_PRODUCTS) return;
        setProducts((prev) => [
            ...prev,
            {
                productId: product.id,
                nameEn: product.nameEn,
                nameAr: product.nameAr,
                primaryImageUrl: product.primaryImageUrl,
            },
        ]);
        setQuery("");
        setResults([]);
    }

    function removeProduct(productId) {
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
        // On Edit
        if (initialData?.products?.some((p) => p.productId === productId)) {
            setRemovedProductIds((prev) => [...prev, productId]);
        }
    }

    function moveProduct(index, direction) {
        setProducts((prev) => {
            const next = [...prev];
            const target = index + direction;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    // ---- VALIDATION ---------------------------------------------------------
    function validate() {
        const newErrors = {};
        if (!nameEn.trim()) newErrors.nameEn = t("form.errors.nameEnRequired");
        if (!nameAr.trim()) newErrors.nameAr = t("form.errors.nameArRequired");

        if (products.length < MIN_PRODUCTS) {
            newErrors.products = t("form.errors.minProducts", {
                count: MIN_PRODUCTS,
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ---- SUBMIT ---------------------------------------------------------
    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            nameEn: nameEn.trim(),
            nameAr: nameAr.trim(),
            urlVisit: urlVisit || null,
            categoryIds,
            occasionIds,
            products: products.map((p) => ({ productId: p.productId })),
            removedProductIds,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ---- RESET --------------------------------------------------------------
    function resetForm() {
        setNameEn(initialData?.nameEn ?? "");
        setNameAr(initialData?.nameAr ?? "");
        setProducts(initialData?.products ?? []);
        setRemovedProductIds([]);
        setCategoryIds(initialData?.categoryIds ?? []);
        setOccasionIds(initialData?.occasionIds ?? []);
        setQuery("");
        setResults([]);
        setErrors({});
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
        >
            {/* NAME (ENGLISH & ARABIC) */}
            <div className="flex flex-wrap gap-3">
                <div className="flex-1">
                    <label className="required block text-on-surface-variant mb-2">
                        {tMain("name")} {tMain("english")}
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                        placeholder="e.g. Birthday Favorites"
                        dir="ltr"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                    />
                    {errors.nameEn && (
                        <p className="text-error text-sm mt-1">
                            {errors.nameEn}
                        </p>
                    )}
                </div>

                <div className="flex-1">
                    <label className="required block text-on-surface-variant mb-2">
                        {tMain("name")} {tMain("arabic")}
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                        placeholder="مثال: مفضلات عيد الميلاد"
                        dir="rtl"
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                    />
                    {errors.nameAr && (
                        <p className="text-error text-sm mt-1">
                            {errors.nameAr}
                        </p>
                    )}
                </div>
            </div>

            {/* CATEGORY & OCCASION  */}
            <div className="flex flex-wrap gap-3">
                <div className="min-w-60 flex-1">
                    <MultiSelect
                        label={tMain("category")}
                        options={categories}
                        selectedIds={categoryIds}
                        onChange={setCategoryIds}
                        getLabel={(c) =>
                            language === "en" ? c.nameEn : c.nameAr
                        }
                    />
                </div>

                <div className="min-w-60 flex-1">
                    <MultiSelect
                        label={tMain("occasion")}
                        options={occasions}
                        selectedIds={occasionIds}
                        onChange={setOccasionIds}
                        getLabel={(o) =>
                            language === "en" ? o.nameEn : o.nameAr
                        }
                    />
                </div>
            </div>

            {/* URL */}
            <div>
                <label className="block text-on-surface-variant mb-2">
                    {t("form.urlVisit")} ({t("form.urlHint")})
                </label>
                <input
                    value={urlVisit || t("form.urlPlaceholder")}
                    readOnly
                    placeholder={t("form.urlPlaceholder")}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface-variant"
                />
            </div>

            {/* PRODUCT SEARCH */}
            <div>
                <label className="block text-on-surface-variant mb-2">
                    {tMain("products")} ({products.length}/{MAX_PRODUCTS})
                </label>
                <div className="relative">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("form.productPlaceholder")}
                        disabled={products.length >= MAX_PRODUCTS}
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                    />
                    {results.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg">
                            {results.map((p) => (
                                <button
                                    type="button"
                                    key={p.id}
                                    onClick={() => addProduct(p)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-primary/5 text-left"
                                >
                                    {p.primaryImageUrl && (
                                        <img
                                            src={BASE_URL + p.primaryImageUrl}
                                            alt=""
                                            className="w-8 h-8 rounded-lg object-cover"
                                        />
                                    )}
                                    <span className="text-sm">{p.nameEn}</span>
                                    <AddIcon
                                        fontSize="small"
                                        className="ms-auto text-on-surface-variant"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                    {searching && (
                        <p className="text-xs text-on-surface-variant mt-1">
                            {t("form.searching")}
                        </p>
                    )}
                </div>

                {/* SELECTED PRODUCTS */}
                <div className="flex flex-col gap-2 mt-3">
                    {products.map((p, i) => (
                        <div
                            key={p.productId}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest"
                        >
                            <span className="text-xs text-on-surface-variant w-5">
                                {i + 1}
                            </span>
                            {p.primaryImageUrl && (
                                <img
                                    src={BASE_URL + p.primaryImageUrl}
                                    alt=""
                                    className="w-8 h-8 rounded-lg object-cover"
                                />
                            )}
                            <span className="text-sm flex-1 truncate">
                                {language == "en" ? p.nameEn : p.nameAr}
                            </span>
                            <button
                                type="button"
                                onClick={() => moveProduct(i, -1)}
                                disabled={i === 0}
                            >
                                <ArrowUpwardIcon
                                    fontSize="small"
                                    className="text-on-surface-variant disabled:opacity-30"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveProduct(i, 1)}
                                disabled={i === products.length - 1}
                            >
                                <ArrowDownwardIcon
                                    fontSize="small"
                                    className="text-on-surface-variant disabled:opacity-30"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeProduct(p.productId)}
                            >
                                <CloseIcon
                                    fontSize="small"
                                    className="text-error"
                                />
                            </button>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <p className="text-sm text-on-surface-variant/60">
                            {t("form.noProducts")}
                        </p>
                    )}
                    {errors.products && (
                        <p className="text-error text-sm mt-1">
                            {errors.products}
                        </p>
                    )}
                </div>
            </div>

            {/* ACTIONS (Cancel | Save) */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 rounded-lg transition-all"
                >
                    {tMain("cancel")}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                        submitting
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    <SaveIcon fontSize="small" />
                    {tMain(submitting ? "saving" : "save")}
                </button>
            </div>
        </form>
    );
}
