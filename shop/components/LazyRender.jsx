"use client";

import useInView from "@/hooks/useInView";

export default function LazyRender({
    children,
    minHeight = 0,
    rootMargin = "150px",
}) {
    const { ref, isVisible } = useInView({ rootMargin });

    return (
        <div ref={ref} style={{ minHeight: isVisible ? undefined : minHeight }}>
            {isVisible ? children : null}
        </div>
    );
}
