import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "@/api/axios";
import Loading from "@/components/Loading";
import SectionForm from "./components/SectionForm";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Extract the occasions and categories
function parseUrlVisit(urlVisit) {
    if (!urlVisit) return { categoryIds: [], occasionIds: [] };

    const params = new URLSearchParams(urlVisit);

    const parseIds = (key) => {
        const raw = params.get(key);
        if (!raw) return [];
        return raw
            .split(",")
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n) && n !== 0);
    };

    return {
        categoryIds: parseIds("categoryIds"),
        occasionIds: parseIds("occasionIds"),
    };
}

export default function EditSection() {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("sections");
    const { sectionId } = useParams();

    // ---- STATE ------
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // ---- FETCH DATA ---------------------------------------------------------------------
    const fetchSection = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api(`/section/${sectionId}`);
            setSection({
                ...data,
                ...parseUrlVisit(data.urlVisit),
                products: data.products.map((p) => ({
                    productId: p.id,
                    nameEn: p.nameEn,
                    nameAr: p.nameAr,
                    primaryImageUrl: p.primaryImageUrl,
                })),
            });
        } catch (e) {
            setError(e?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }, [sectionId]);

    useEffect(() => {
        fetchSection();
    }, [fetchSection]);

    // ---- SUBMIT ---------------------------------------------------------------------
    async function handleSubmit(payload) {
        try {
            setSubmitting(true);
            setError(null);
            await api.put(`/section/update/${sectionId}`, payload);
            toast.success(t("toast.updateSuccess"));
            await fetchSection();
        } catch (e) {
            setError(e?.response?.data?.message);
            toast.error(t("toast.updateFailed"));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                        <Link
                            to="/sections"
                            className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                        >
                            {tCommon("sections")}
                        </Link>
                        <ChevronRightIcon
                            fontSize="small"
                            className="rtl:rotate-180"
                        />
                        <span className="text-indigo-600 font-bold">
                            {tCommon("edit")}
                        </span>
                    </nav>
                    <h2 className="text-on-surface">{t("edit.title")}</h2>
                    <p className="page-subtitle mt-1">{t("edit.subtitle")}</p>
                </div>
            </div>

            {error && <p className="text-error text-sm mb-4">{error}</p>}
            {section && (
                <SectionForm
                    initialData={section}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            )}
        </>
    );
}
