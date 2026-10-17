"use client";

import { useEffect, useRef, useState } from "react";

export default function useInView({
    rootMargin = "150px",
    threshold = 0,
} = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || isVisible) return;

        // Very old browsers: show the content right away
        if (!("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [isVisible, rootMargin, threshold]);

    return { ref, isVisible };
}
