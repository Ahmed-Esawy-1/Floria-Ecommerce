import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import api from "@/api/axios";
import { BASE_URL } from "@/api/config";

import Loading from "@/components/Loading";
import { useLanguage } from "@/contexts/LanguageContext";
import { getRoleLabel } from "@/helpers/roles";

const DEFAULT_FORM = {
    userName: "",
    email: "",
    password: "",
    roleId: "",
};

const EmployeeForm = ({ mode, employeeId }) => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("employees");
    const { language } = useLanguage();
    const isEdit = mode === "edit";

    // ---- STATE ----------------------------------------
    const [roles, setRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [errors, setErrors] = useState({});

    // Image
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Snapshot for Cancel (edit only)
    const originalStateRef = useRef(null);

    // UI state
    const [submitting, setSubmitting] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEdit);

    // ---- FETCH ROLES -------------------------------------------------------
    useEffect(() => {
        api.get("/roles/assignable")
            .then(({ data }) => setRoles(data))
            .catch(() => toast.error(t("toast.loadError")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- FETCH (edit only) --------------------------------------------------
    useEffect(() => {
        if (!isEdit) return;

        async function fetchUser() {
            try {
                const { data } = await api.get(`/employee/${employeeId}`);
                const loadedForm = {
                    userName: data.userName || "",
                    email: data.email || "",
                    password: "",
                    roleId: data.roleId || data.role?.id || "",
                };
                const loadedPreview = data.imageUrl
                    ? BASE_URL + data.imageUrl
                    : null;

                setForm(loadedForm);
                setCurrentRole(data.role ?? null);
                setImagePreview(loadedPreview);

                originalStateRef.current = {
                    form: loadedForm,
                    imagePreview: loadedPreview,
                };
            } catch (err) {
                console.error(err);
                toast.error(t("toast.loadError"));
            } finally {
                setFetchLoading(false);
            }
        }

        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, employeeId]);

    // ---- ROLE OPTIONS ---------------------------------------------------------
    // The employee's current role may not be in /roles/assignable (OWNER, or the
    // same role as the logged-in admin). Keep it visible and lock the select.
    const currentRoleInList =
        !currentRole || roles.some((r) => r.id === currentRole.id);

    const roleOptions = (
        currentRoleInList ? roles : [currentRole, ...roles]
    ).filter((r, i, arr) => r?.id && arr.findIndex((x) => x.id === r.id) === i);

    const roleLocked = isEdit && !currentRoleInList;

    // ---- HANDLERS ------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const setImage = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleImageChange = (e) => setImage(e.target.files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setImage(e.dataTransfer.files?.[0]);
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
    };

    // ---- RESET --------------------------------------------------------------
    const resetForm = () => {
        if (isEdit && originalStateRef.current) {
            const snap = originalStateRef.current;
            setForm(snap.form);
            setImagePreview(snap.imagePreview);
        } else {
            setForm(DEFAULT_FORM);
            setImagePreview(null);
        }
        setImageFile(null);
        setErrors({});
    };

    // ---- VALIDATION ------------------------------------------------------------
    const validate = () => {
        const newErrors = {};

        if (!form.userName.trim() || form.userName.trim().length < 2) {
            newErrors.userName = t("form.errors.userName");
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = t("form.errors.email");
        }

        // Password required on create, optional on edit
        if (!isEdit || form.password) {
            if (!form.password || form.password.length < 8) {
                newErrors.password = t("form.errors.password");
            } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(form.password)) {
                newErrors.password = t("form.errors.passwordPattern");
            }
        }

        if (!form.roleId) {
            newErrors.roleId = t("form.errors.role");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---- SUBMIT-DISABLED LOGIC ---------------------------------------------------
    const isCreateEmpty =
        !isEdit &&
        (!form.userName.trim() ||
            !form.email.trim() ||
            !form.password.trim() ||
            !form.roleId);

    const isEditUnchanged =
        isEdit &&
        originalStateRef.current &&
        !imageFile &&
        !form.password &&
        form.userName === originalStateRef.current.form.userName &&
        form.email === originalStateRef.current.form.email &&
        form.roleId === originalStateRef.current.form.roleId;

    const isSubmitDisabled = submitting || isCreateEmpty || isEditUnchanged;

    // ---- SUBMIT ------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("userName", form.userName.trim());
            formData.append("email", form.email.trim());

            if (form.password) {
                formData.append("password", form.password);
            }

            // On edit, only send the role when it actually changed
            const roleChanged =
                !isEdit ||
                form.roleId !== originalStateRef.current?.form.roleId;
            if (roleChanged) {
                formData.append("roleId", form.roleId);
            }

            if (imageFile) formData.append("image", imageFile);

            // No manual Content-Type: the browser adds it with the boundary
            if (isEdit) {
                const { data } = await api.put(
                    `/employee/update/${employeeId}`,
                    formData,
                );
                toast.success(t("toast.updateSuccess"));

                const updatedForm = {
                    userName: data.userName || "",
                    email: data.email || "",
                    password: "",
                    roleId: data.roleId || data.role?.id || "",
                };
                const updatedPreview = data.imageUrl
                    ? BASE_URL + data.imageUrl
                    : null;

                setForm(updatedForm);
                setCurrentRole(data.role ?? null);
                setImagePreview(updatedPreview);
                setImageFile(null);

                originalStateRef.current = {
                    form: updatedForm,
                    imagePreview: updatedPreview,
                };
            } else {
                await api.post("/employee/create", formData);
                toast.success(t("toast.createSuccess"));
                resetForm();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error(error?.response?.data ?? error);
            const msg = t(isEdit ? "toast.updateError" : "toast.createError");
            toast.error(error?.response?.data?.message || msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ----------------------------------------------------------------------------
    if (fetchLoading) return <Loading />;

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
        >
            {/* IMAGE */}
            <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    {t("form.image")}
                </label>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="relative border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container-low transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow"
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-on-surface-variant">
                            {t("form.imageHint")}
                        </p>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            {/* USERNAME */}
            <div>
                <label className="required block text-sm font-medium text-on-surface-variant mb-1">
                    {t("form.userName")}
                </label>
                <input
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface-container-lowest outline-none border border-outline-variant rounded-lg"
                />
                {errors.userName && (
                    <p className="text-error text-xs mt-1">{errors.userName}</p>
                )}
            </div>

            {/* EMAIL */}
            <div>
                <label className="required block text-sm font-medium text-on-surface-variant mb-1">
                    {t("form.email")}
                </label>
                <input
                    type="email"
                    name="email"
                    dir="ltr"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-surface-container-lowest outline-none border border-outline-variant rounded-lg"
                />
                {errors.email && (
                    <p className="text-error text-xs mt-1">{errors.email}</p>
                )}
            </div>

            {/* PASSWORD */}
            <div>
                <label
                    className={`${
                        isEdit ? "" : "required "
                    }block text-sm font-medium text-on-surface-variant mb-1`}
                >
                    {t("form.password")}{" "}
                    {isEdit && (
                        <span className="text-xs text-on-surface-variant font-normal">
                            {t("form.passwordEditHint")}
                        </span>
                    )}
                </label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={isEdit ? t("form.passwordPlaceholder") : ""}
                    className="w-full px-4 py-2 bg-surface-container-lowest outline-none border border-outline-variant rounded-lg"
                />
                {errors.password && (
                    <p className="text-error text-xs mt-1">{errors.password}</p>
                )}
            </div>

            {/* ROLE */}
            <div>
                <label className="required block text-sm font-medium text-on-surface-variant mb-1">
                    {t("form.role")}
                </label>
                <select
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    disabled={roleLocked}
                    className="w-full px-4 py-2 bg-surface-container-lowest outline-none border border-outline-variant rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <option value="">{t("form.rolePlaceholder")}</option>
                    {roleOptions.map((r) => (
                        <option key={r.id} value={r.id}>
                            {getRoleLabel(r, language)}
                        </option>
                    ))}
                </select>
                {errors.roleId && (
                    <p className="text-error text-xs mt-1">{errors.roleId}</p>
                )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                    {tCommon("cancel")}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting
                        ? t("form.submitting")
                        : isEdit
                          ? t("form.editSubmit")
                          : t("form.submit")}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;
