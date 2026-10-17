import { useState } from "react";
import NavigationLinks from "./NavigationLinks";

import { ArrowDown } from "lucide-react";

const MobileAccordion = ({ label, items, basePath, onClose }) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest text-ink hover:bg-rose/15 hover:text-primary transition-colors"
            >
                {label}

                <ArrowDown
                    size={18}
                    className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <ul className="pl-3 pb-2 space-y-0.5">
                        <NavigationLinks
                            items={items}
                            basePath={basePath}
                            onClose={onClose}
                        />
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MobileAccordion;
