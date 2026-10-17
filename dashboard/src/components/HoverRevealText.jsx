import { useState, useRef, useEffect } from "react";

const HoverRevealText = ({ text, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = triggerRect.bottom + 8; // Below with 8px gap
        let left = triggerRect.left;

        // Check if tooltip goes off-screen bottom
        if (top + tooltipRect.height > window.innerHeight) {
            // Move above instead
            top = triggerRect.top - tooltipRect.height - 8;
        }

        // Prevent horizontal overflow (right side)
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 8;
        }

        // Prevent horizontal overflow (left side)
        if (left < 0) {
            left = 8;
        }

        setTooltipPos({ top, left });
    }, [isVisible]);

    if (!text) return null;

    return (
        <>
            <div
                ref={triggerRef}
                className={`inline-block max-w-full ${className}`}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                <span className="block truncate">{text}</span>
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className="pointer-events-none fixed z-50 max-w-xs text-xs text-on-surface whitespace-normal break-words bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 shadow-lg"
                    style={{
                        top: `${tooltipPos.top}px`,
                        left: `${tooltipPos.left}px`,
                    }}
                >
                    {text}
                </div>
            )}
        </>
    );
};

export default HoverRevealText;
