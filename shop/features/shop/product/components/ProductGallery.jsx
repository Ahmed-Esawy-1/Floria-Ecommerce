"use client";

import AppSwiper from "@/components/AppSwiper";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { THUMB_BREAKPOINTS } from "../constants";

export default function ProductGallery({ name, mainImage, images, onSelect }) {
    return (
        <div className="space-y-4">
            {/* MAIN IMAGE */}
            <div className="relative w-full max-h-[65vh] sm:max-h-[500px] lg:max-h-none lg:aspect-square bg-marble rounded-xl overflow-hidden border border-gold/20">
                {mainImage && (
                    <img
                        src={resolveImageUrl(mainImage)}
                        alt={name}
                        fetchPriority="high"
                        className="w-full h-full max-h-[65vh] sm:max-h-[500px] lg:max-h-none object-cover"
                    />
                )}
            </div>

            {/* THUMBNAILS  */}
            {images.length > 1 && (
                <AppSwiper
                    items={images}
                    breakpoints={THUMB_BREAKPOINTS}
                    renderSlide={(img) => {
                        const active = mainImage === img.imageUrl;

                        return (
                            <button
                                type="button"
                                onClick={() => onSelect(img.imageUrl)}
                                aria-label={name}
                                aria-pressed={active}
                                className={`block w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                    active
                                        ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                                        : "border-gold/20 hover:border-gold/50"
                                }`}
                            >
                                <img
                                    src={resolveImageUrl(img.imageUrl)}
                                    alt=""
                                    loading="lazy"
                                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                />
                            </button>
                        );
                    }}
                />
            )}
        </div>
    );
}
