import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PERMISSIONS } from "@/constants/permissions";
import api from "@/api/axios";

const ACTION_REGEX = /^(CREATE|READ|UPDATE|DELETE)_(.+)$/;
const ACTION_ORDER = ["CREATE", "READ", "UPDATE", "DELETE"];
const CODE_REGEX = /^[A-Z][A-Z_]*$/;

const EMPTY_FORM = {
    code: "",
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
};

const formatLabel = (value) =>
    value
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

// Converts free text into a valid role code, e.g. "store manager" -> "STORE_MANAGER"
const normalizeCode = (value) =>
    value
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z_]/g, "");

// Groups permission names by entity, e.g. "CREATE_PRODUCT" -> "PRODUCT"
const groupPermissions = () => {
    const groups = new Map();

    Object.keys(PERMISSIONS).forEach((name) => {
        const match = name.match(ACTION_REGEX);
        const entity = match ? match[2] : "SYSTEM";
        const action = match ? match[1] : null;

        if (!groups.has(entity)) groups.set(entity, []);
        groups.get(entity).push({ name, action });
    });

    groups.forEach((items) =>
        items.sort((a, b) => {
            const ai = ACTION_ORDER.indexOf(a.action);
            const bi = ACTION_ORDER.indexOf(b.action);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        }),
    );

    return [...groups.entries()];
};

const inputClass =
    "w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30";

export default function CreateRole() {
    const navigate = useNavigate();
    const { t } = useTranslation("roles");
    const { t: tCommon } = useTranslation("common");
    const groups = useMemo(groupPermissions, []);

    const [form, setForm] = useState(EMPTY_FORM);
    const [selected, setSelected] = useState(new Set());
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // ---- FIELD HANDLERS -------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        const next = name === "code" ? normalizeCode(value) : value;
        setForm((prev) => ({ ...prev, [name]: next }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // ---- PERMISSION HANDLERS --------------------------------------------
    const togglePermission = (permission) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(permission)) next.delete(permission);
            else next.add(permission);
            return next;
        });
        setErrors((prev) => ({ ...prev, permissions: undefined }));
    };

    const toggleGroup = (items) => {
        const names = items.map((i) => i.name);
        const allSelected = names.every((n) => selected.has(n));
        setSelected((prev) => {
            const next = new Set(prev);
            names.forEach((n) => (allSelected ? next.delete(n) : next.add(n)));
            return next;
        });
        setErrors((prev) => ({ ...prev, permissions: undefined }));
    };

    // Action checkbox label, e.g. "Read" / "عرض". Non-CRUD permissions
    // (like VIEW_DASHBOARD) fall back to their formatted constant name.
    const permissionLabel = (name, action) =>
        action ? t(`actions.${action}`) : formatLabel(name);

    // ---- VALIDATION -----------------------------------------------------
    const validate = () => {
        const newErrors = {};

        if (!form.code.trim()) {
            newErrors.code = t("errors.codeRequired");
        } else if (!CODE_REGEX.test(form.code)) {
            newErrors.code = t("errors.codeInvalid");
        }
        if (!form.nameEn.trim()) newErrors.nameEn = t("errors.nameEnRequired");
        if (!form.nameAr.trim()) newErrors.nameAr = t("errors.nameArRequired");
        if (!form.descriptionEn.trim())
            newErrors.descriptionEn = t("errors.descriptionEnRequired");
        if (!form.descriptionAr.trim())
            newErrors.descriptionAr = t("errors.descriptionArRequired");
        if (selected.size === 0)
            newErrors.permissions = t("errors.permissionsRequired");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---- SUBMIT ---------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validate()) return;

        setSubmitting(true);
        try {
            await api.post("/role/create", {
                code: form.code.trim(),
                nameEn: form.nameEn.trim(),
                nameAr: form.nameAr.trim(),
                descriptionEn: form.descriptionEn.trim(),
                descriptionAr: form.descriptionAr.trim(),
                // Backend maps these to the Permission enum by constant name
                permissions: [...selected],
            });
            toast.success(t("toast.createSuccess"));
            navigate("/roles");
        } catch (err) {
            setError(err?.response?.data?.message || t("errors.createFailed"));
        } finally {
            setSubmitting(false);
        }
    };

    const fieldError = (key) =>
        errors[key] && <p className="text-error text-xs mt-1">{errors[key]}</p>;

    return (
        <>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-on-surface">{t("createPage.title")}</h2>
                    <p className="page-subtitle mt-1">
                        {t("createPage.subtitle")}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
            >
                {/* CODE */}
                <div>
                    <label
                        htmlFor="role-code"
                        className="required block text-sm font-medium text-on-surface-variant mb-1"
                    >
                        {t("createPage.code")}
                    </label>
                    <input
                        id="role-code"
                        name="code"
                        type="text"
                        dir="ltr"
                        value={form.code}
                        onChange={handleChange}
                        className={`${inputClass} max-w-md`}
                        placeholder={t("createPage.codePlaceholder")}
                    />
                    {fieldError("code")}
                </div>

                {/* NAMES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="role-name-en"
                            className="required block text-sm font-medium text-on-surface-variant mb-1"
                        >
                            {t("createPage.nameEn")}
                        </label>
                        <input
                            id="role-name-en"
                            name="nameEn"
                            type="text"
                            dir="ltr"
                            value={form.nameEn}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder={t("createPage.namePlaceholderEn")}
                        />
                        {fieldError("nameEn")}
                    </div>
                    <div>
                        <label
                            htmlFor="role-name-ar"
                            className="required block text-sm font-medium text-on-surface-variant mb-1"
                        >
                            {t("createPage.nameAr")}
                        </label>
                        <input
                            id="role-name-ar"
                            name="nameAr"
                            type="text"
                            dir="rtl"
                            value={form.nameAr}
                            onChange={handleChange}
                            className={inputClass}
                        />
                        {fieldError("nameAr")}
                    </div>
                </div>

                {/* DESCRIPTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="role-desc-en"
                            className="required block text-sm font-medium text-on-surface-variant mb-1"
                        >
                            {t("createPage.descriptionEn")}
                        </label>
                        <textarea
                            id="role-desc-en"
                            name="descriptionEn"
                            rows={3}
                            dir="ltr"
                            value={form.descriptionEn}
                            onChange={handleChange}
                            className={inputClass}
                        />
                        {fieldError("descriptionEn")}
                    </div>
                    <div>
                        <label
                            htmlFor="role-desc-ar"
                            className="required block text-sm font-medium text-on-surface-variant mb-1"
                        >
                            {t("createPage.descriptionAr")}
                        </label>
                        <textarea
                            id="role-desc-ar"
                            name="descriptionAr"
                            rows={3}
                            dir="rtl"
                            value={form.descriptionAr}
                            onChange={handleChange}
                            className={inputClass}
                        />
                        {fieldError("descriptionAr")}
                    </div>
                </div>

                {/* PERMISSIONS */}
                <div>
                    <div className="required block text-sm font-medium text-on-surface-variant mb-2">
                        {t("createPage.permissions")}
                    </div>
                    <div className="text-sm text-on-surface-variant mb-2">
                        {t("createPage.permissionsSelected", {
                            count: selected.size,
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map(([entity, items]) => {
                            const allChecked = items.every((i) =>
                                selected.has(i.name),
                            );
                            const someChecked = items.some((i) =>
                                selected.has(i.name),
                            );

                            return (
                                <fieldset
                                    key={entity}
                                    className="border border-outline-variant rounded-lg p-4"
                                >
                                    <legend className="px-2 font-medium text-on-surface">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allChecked}
                                                ref={(el) => {
                                                    if (el)
                                                        el.indeterminate =
                                                            !allChecked &&
                                                            someChecked;
                                                }}
                                                onChange={() =>
                                                    toggleGroup(items)
                                                }
                                            />
                                            {formatLabel(entity)}
                                        </label>
                                    </legend>

                                    <div className="flex flex-col gap-2 mt-2">
                                        {items.map(({ name: perm, action }) => (
                                            <label
                                                key={perm}
                                                className="flex items-center gap-2 text-sm cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(perm)}
                                                    onChange={() =>
                                                        togglePermission(perm)
                                                    }
                                                />
                                                {permissionLabel(perm, action)}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            );
                        })}
                    </div>
                    {fieldError("permissions")}
                </div>

                {error && <p className="text-error text-sm">{error}</p>}

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                        {tCommon("cancel")}
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting
                            ? t("createPage.submitting")
                            : t("createPage.submit")}
                    </button>
                </div>
            </form>
        </>
    );
}
