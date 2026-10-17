"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { STARS } from "../constants";

// Read-only stars.
export function Stars({ value = 0, size = 16 }) {
    return (
        <div
            className="flex items-center gap-0.5"
            role="img"
            aria-label={`${value} / 5`}
        >
            {STARS.map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={
                        n <= Math.round(value)
                            ? "fill-gold text-gold"
                            : "text-slate-300"
                    }
                />
            ))}
        </div>
    );
}

// Form Input
export function RatingInput({ value, onChange, label }) {
    const [hover, setHover] = useState(0);
    const shown = hover || value;

    return (
        <div
            role="radiogroup"
            aria-label={label}
            className="flex items-center gap-1"
            onMouseLeave={() => setHover(0)}
        >
            {STARS.map((n) => (
                <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={value === n}
                    aria-label={String(n)}
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHover(n)}
                    className="p-0.5"
                >
                    <Star
                        size={26}
                        className={
                            n <= shown
                                ? "fill-gold text-gold"
                                : "text-slate-300"
                        }
                    />
                </button>
            ))}
        </div>
    );
}
