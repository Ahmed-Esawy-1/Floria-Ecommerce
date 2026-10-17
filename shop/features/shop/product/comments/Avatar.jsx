"use client";

import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { useState } from "react";

export default function Avatar({ name, image }) {
    const [failed, setFailed] = useState(false);
    const src = resolveImageUrl(image);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setFailed(true)}
                className="w-10 h-10 rounded-full object-cover shrink-0"
            />
        );
    }

    return (
        <span className="w-10 h-10 rounded-full bg-rose/20 text-primary font-bold flex items-center justify-center shrink-0">
            {name?.trim()?.[0]?.toUpperCase() ?? "?"}
        </span>
    );
}
