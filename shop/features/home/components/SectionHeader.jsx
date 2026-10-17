import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, desc, href, viewAllLabel }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
            <div>
                <h2 className="text-2xl sm:text-4xl mb-2 font-heading text-ink">
                    {title}
                </h2>
                {desc && (
                    <p className="text-sm sm:text-base text-text">{desc}</p>
                )}
            </div>
            <Link
                href={href}
                className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all self-start sm:self-auto"
            >
                {viewAllLabel}
                <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
        </div>
    );
}
