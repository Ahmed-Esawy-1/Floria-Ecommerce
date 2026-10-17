import { useTranslation } from "react-i18next";
import ProductChip from "./ProductChip";
import Can from "@/components/Can";
import { PERMISSIONS } from "@/constants/permissions";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SectionCard = ({
    section,
    index,
    expanded,
    onToggle,
    onEdit,
    onDelete,
    deleting,
}) => {
    const { t: tMain } = useTranslation();
    const { t } = useTranslation("sections");

    return (
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/40 transition-shadow hover:shadow-md">
            {/* CARD HEADER */}
            <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                {/* ORDER BADGE */}
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center">
                    {index + 1}
                </span>

                {/* NAMES */}
                <div className="flex-1 min-w-30">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-on-surface truncate">
                            {section.nameEn}
                        </span>
                        <span className="text-on-surface-variant/50">·</span>
                        <span
                            className="text-on-surface-variant font-medium"
                            dir="rtl"
                        >
                            {section.nameAr}
                        </span>
                    </div>
                    <div className="text-xs text-on-surface-variant/60 mt-0.5">
                        {t(
                            (section.products?.length ?? 0 > 1)
                                ? "product_other"
                                : "product_one",
                            { count: section.products?.length ?? 0 },
                        )}
                    </div>
                </div>

                {/* CONTROL */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Can permission={PERMISSIONS.UPDATE_SECTION}>
                        <button
                            onClick={onEdit}
                            className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                            {tMain("edit")}
                        </button>
                    </Can>

                    <Can permission={PERMISSIONS.DELETE_SECTION}>
                        <button
                            onClick={onDelete}
                            disabled={deleting}
                            className="px-3 py-1.5 text-xs font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
                        >
                            {deleting ? "…" : tMain("delete")}
                        </button>
                    </Can>

                    <button
                        onClick={onToggle}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
                        style={{
                            transform: expanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                        }}
                    >
                        <KeyboardArrowDownIcon fontSize="small" />
                    </button>
                </div>
            </div>

            {/* PRODUCT GRID (expanded) */}
            {expanded && (
                <div className="border-t border-outline-variant/30 px-5 py-4 bg-surface-container-low">
                    {!section.products || section.products.length === 0 ? (
                        <p className="text-sm text-on-surface-variant/60 py-2">
                            {t("empty.noProduct")}
                        </p>
                    ) : (
                        <div className="flex flex-wrap  gap-3">
                            {section.products.map((product, pIdx) => (
                                <ProductChip
                                    key={product.id}
                                    product={product}
                                    order={pIdx + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionCard;
