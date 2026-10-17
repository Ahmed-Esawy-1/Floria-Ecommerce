import { useState, useRef } from "react";
import NavigationLinks from "./NavigationLinks";

import { ArrowDown } from "lucide-react";

const Dropdown = ({ label, items, basePath }) => {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 120);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className="flex items-center gap-1 hover:text-primary transition-colors font-accent text-sm font-bold uppercase tracking-tight text-ink">
                {label}
                <ArrowDown
                    size={18}
                    className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* LINKS */}
            <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-62 bg-marble-light border border-gold/25 rounded-2xl shadow-xl transition-all duration-200 origin-top z-50
            ${
                open
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
            }`}
            >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-marble-light border-l border-t border-gold/25 rotate-45" />

                <ul className="py-2">
                    <NavigationLinks items={items} basePath={basePath} />
                </ul>
            </div>
        </div>
    );
};

export default Dropdown;
