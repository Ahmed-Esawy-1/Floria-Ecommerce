import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Link } from "react-router";
import api from "@/api/axios";
import SectionForm from "./components/SectionForm";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function CreateSection() {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("sections");

    // ---- STATE -------------------------------------------
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formKey, setFormKey] = useState(0); // Reset after save

    // ---- SUBMIT --------------------------------------------------------------
    async function handleSubmit(payload) {
        try {
            setSubmitting(true);
            setError(null);
            await api.post("/section/add", payload);
            toast.success(t("toast.createSuccess"));
            setFormKey((k) => k + 1); // remounts SectionForm
        } catch (e) {
            setError(e?.response?.data?.message);
            toast.error(t("toast.createFailed"));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {/* HEADER */}
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
                            {tCommon("create")}
                        </span>
                    </nav>
                    <h2 className="text-on-surface">{t("create.title")}</h2>
                    <p className="page-subtitle mt-1">{t("create.subtitle")}</p>
                </div>
            </div>
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            {/* FORM */}
            <SectionForm
                key={formKey}
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </>
    );
}
