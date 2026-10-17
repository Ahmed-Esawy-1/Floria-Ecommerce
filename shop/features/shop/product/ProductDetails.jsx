"use client";

import { notFound, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import Spinner from "@/components/loading/spinner";
import { useGetProductQuery } from "@/lib/api/shopApi";
import { decodeId } from "@/lib/hashId";

import ColorPicker from "./components/ColorPicker";
import ProductDescription from "./components/ProductDescription";
import ProductGallery from "./components/ProductGallery";
import PurchaseBox from "./components/PurchaseBox";
import { useProductSelection } from "./useProductSelection";

import LazyRender from "@/components/LazyRender";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const ProductComments = dynamic(() => import("./comments/ProductComments"));
const RelatedProducts = dynamic(() => import("./related/RelatedProducts"));

export default function ProductDetails() {
    const locale = useLocale();
    const t = useTranslations("product");

    const { id: hashedId } = useParams();
    const realId = decodeId(hashedId);

    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useGetProductQuery(realId, { skip: realId === null });

    const selection = useProductSelection(product);

    // ---- when refresh or go to new product start from top ----
    useEffect(() => {
        if (product?.id) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [product?.id]);

    // ---- RENDER ----------------------------------
    if (realId === null || error?.status === 404) notFound();

    if (isLoading) return <Spinner />;

    // Any other failure (network, 500): let the user retry
    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-slate-600">{t("productError")}</p>
                <button
                    type="button"
                    onClick={refetch}
                    className="px-6 py-2.5 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                    {t("retry")}
                </button>
            </div>
        );
    }

    const isEn = locale === "en";
    const name = isEn ? product.nameEn : product.nameAr;
    const description = isEn ? product.descriptionEn : product.descriptionAr;

    return (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7">
                    <ProductGallery
                        name={name}
                        mainImage={selection.mainImage}
                        images={selection.images}
                        onSelect={selection.selectImage}
                    />
                </div>

                <div className="lg:col-span-5 space-y-8">
                    <h1 className="text-ink text-3xl lg:text-4xl font-accent font-medium leading-tight">
                        {name}
                    </h1>

                    <ColorPicker
                        colors={selection.colors}
                        selectedId={selection.selectedColor?.id}
                        onSelect={selection.selectColor}
                    />

                    <PurchaseBox
                        product={product}
                        selectedColor={selection.selectedColor}
                    />

                    <ProductDescription text={description} />
                </div>
            </div>

            <div className="mb-20">
                <LazyRender minHeight={300}>
                    <ProductComments productId={product.id} />
                </LazyRender>

                <LazyRender minHeight={300}>
                    <RelatedProducts productId={product.id} />
                </LazyRender>
            </div>
        </main>
    );
}
