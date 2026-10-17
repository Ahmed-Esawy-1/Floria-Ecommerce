import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "@/constants/permissions";
import Can from "@/components/Can";
import api from "@/api/axios";
import PageHeader from "@/components/PageHeader";
import Loading from "@/components/Loading";
import DeletedModal from "@/components/DeleteModal";
import SectionCard from "./components/SectionCard";

import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import { toast } from "sonner";

export default function Sections() {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("sections");
    const navigate = useNavigate();

    // ---- STATE ---------------------------------------
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [deleting, setDeleting] = useState(null);
    const [deleteSection, setDeleteSection] = useState(null); // section pending delete

    // ---- FETCH SECTIONS ---------------------------------------------------------------
    useEffect(() => {
        async function getSections() {
            try {
                setLoading(true);
                const { data } = await api("/sections");
                setSections(data);
            } catch (e) {
                toast.error(
                    e?.response?.data?.message || t("toast.fetchFailed"),
                );
            } finally {
                setLoading(false);
            }
        }
        getSections();
    }, []);

    function toggleExpand(id) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    // ---- DELETE ---------------------------------------------------------------------
    async function handleConfirmDelete() {
        if (!deleteSection) return;
        try {
            setDeleting(deleteSection.id);
            await api.delete(`/section/delete/${deleteSection.id}`);
            setSections((prev) =>
                prev.filter((s) => s.id !== deleteSection.id),
            );
            toast.success(t("toast.deleteSuccess"));
        } catch (e) {
            toast.error(e?.response?.data?.message || t("toast.deleteFailed"));
        } finally {
            setDeleting(null);
            setDeleteSection(null);
        }
    }

    return (
        <>
            {/* HEADER */}
            <PageHeader
                title={t("title")}
                subtitle={`${t(sections.length > 1 ? "other" : "one", { count: sections.length })}
            · ${t("subtitle")}`}
            >
                <div className="flex flex-wrap gap-2">
                    <Can permission={PERMISSIONS.DELETE_SECTION}>
                        <Link
                            to="/sections/trash"
                            className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
                        >
                            {tCommon("trash")}
                        </Link>
                    </Can>
                    <Can permission={PERMISSIONS.CREATE_SECTION}>
                        <button
                            onClick={() => navigate("/sections/create")}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            <AddIcon />
                            {t("new")}
                        </button>
                    </Can>
                </div>
            </PageHeader>

            {loading ? (
                <Loading />
            ) : // NOT FOUND
            sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <FolderIcon className="!text-5xl mb-4" />
                    <p className="text-on-surface-variant text-lg font-medium mb-2">
                        {t("empty.title")}
                    </p>
                    <p className="text-on-surface-variant/60 text-sm mb-6">
                        {t("empty.subtitle")}
                    </p>
                </div>
            ) : (
                // CARDS
                <div className="flex flex-col gap-4">
                    {sections.map((section, i) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            index={i}
                            expanded={!!expanded[section.id]}
                            onToggle={() => toggleExpand(section.id)}
                            onEdit={() =>
                                navigate(`/sections/${section.id}/edit`)
                            }
                            onDelete={() => setDeleteSection(section)}
                            deleting={deleting === section.id}
                        />
                    ))}
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            <Can permission={PERMISSIONS.DELETE_SECTION}>
                <DeletedModal
                    isOpen={!!deleteSection}
                    onClose={() => setDeleteSection(null)}
                    onConfirm={handleConfirmDelete}
                    name={deleteSection?.nameEn}
                    mode="soft"
                />
            </Can>
        </>
    );
}
