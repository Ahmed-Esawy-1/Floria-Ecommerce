"use client";

import { useRef, useState, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import dynamic from "next/dynamic";

import "swiper/css";
import "swiper/css/pagination";

const SwiperNavButtons = dynamic(() => import("./SwiperNavButtons"), {
    ssr: false,
});

function AppSwiper({ items = [], renderSlide, breakpoints, ...props }) {
    const [canSlide, setCanSlide] = useState(false);
    const swiperRef = useRef(null);

    const updateNavState = (swiper) => {
        setCanSlide(swiper.slides.length > swiper.params.slidesPerView);
    };
    return (
        <Swiper
            pagination={{ clickable: true }}
            spaceBetween={20}
            breakpoints={breakpoints}
            onSwiper={(swiper) => {
                swiperRef.current = swiper;
                updateNavState(swiper);
            }}
            onResize={(swiper) => updateNavState(swiper)}
            onSlideChange={(swiper) => updateNavState(swiper)}
            {...props}
        >
            {items.map((item, i) => (
                <SwiperSlide key={item.id ?? i} className="pb-5">
                    {renderSlide(item)}
                </SwiperSlide>
            ))}

            {canSlide && <SwiperNavButtons />}
        </Swiper>
    );
}

export default memo(AppSwiper);
