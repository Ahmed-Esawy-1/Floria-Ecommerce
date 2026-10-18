// src/pages/customers/CustomerForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import api from "@/api/axios";
import { BASE_URL } from "@/api/config";
import Loading from "@/components/Loading";
import { resolveImageUrl } from "@/helpers/resolveImageUrl";

const CustomerForm = ({ customerId }) => {
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("customers");
    const navigate = useNavigate();

    // ---- STATE ----------------------------------------
    const [form, setForm] = useState({ userName: "", email: "" });
    const [provider, setProvider] = useState("");
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const originalRef = useRef(null);

    const [submitting, setSubmitting] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // ---- FETCH ----------------------------------------
    useEffect(() => {
        async function fetchCustomer() {
            try {
                const { data } = await api.get(`/customer/${customerId}`);
                const loadedForm = {
                    userName: data.userName || "",
                    email: data.email || "",
                };
                const loadedPreview = data.imageUrl
                    ? resolveImageUrl(data.imageUrl)
                    : null;

                setForm(loadedForm);
                setProvider(data.provider || "");
                setImagePreview(loadedPreview);
                originalRef.current = {
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

        fetchCustomer();
    }, [customerId]);

    // ---- HANDLERS -------------------------------------
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

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
    };

    const handleReset = () => {
        if (!originalRef.current) return;
        setForm(originalRef.current.form);
        setImagePreview(originalRef.current.imagePreview);
        setImageFile(null);
        setErrors({});
    };

    // ---- VALIDATION -----------------------------------
    const validate = () => {
        const newErrors = {};

        if (!form.userName.trim() || form.userName.trim().length < 2) {
            newErrors.userName = t("form.errors.userName");
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = t("form.errors.email");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---- SUBMIT-DISABLED ------------------------------
    const isUnchanged =
        originalRef.current &&
        !imageFile &&
        form.userName === originalRef.current.form.userName &&
        form.email === originalRef.current.form.email;

    const isSubmitDisabled = submitting || isUnchanged;

    // ---- SUBMIT ---------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("userName", form.userName.trim());
            formData.append("email", form.email.trim());
            if (imageFile) formData.append("image", imageFile);

            const { data } = await api.put(
                `/customer/update/${customerId}`,
                formData,
            );
            toast.success(t("toast.updateSuccess"));

            const updatedForm = {
                userName: data.userName || "",
                email: data.email || "",
            };
            const updatedPreview = data.imageUrl
                ? resolveImageUrl(data.imageUrl)
                : null;

            setForm(updatedForm);
            setImagePreview(updatedPreview);
            setImageFile(null);
            originalRef.current = {
                form: updatedForm,
                imagePreview: updatedPreview,
            };
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error(error?.response?.data ?? error);
            toast.error(
                error?.response?.data?.message || t("toast.updateError"),
            );
        } finally {
            setSubmitting(false);
        }
    };

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
                    onDrop={(e) => {
                        e.preventDefault();
                        setImage(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container-low transition-colors"
                >
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={resolveImageUrl(imagePreview)}
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
                        onChange={(e) => setImage(e.target.files?.[0])}
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

            {/* PROVIDER (read-only) */}
            <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    {t("form.provider")}
                </label>
                <input
                    type="text"
                    value={provider}
                    disabled
                    className="w-full px-4 py-2 bg-surface-container-low outline-none border border-outline-variant rounded-lg opacity-70 cursor-not-allowed"
                />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => navigate("/customers")}
                    className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                    {tCommon("cancel")}
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isUnchanged}
                    className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                    {tCommon("reset")}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? t("form.submitting") : t("form.submit")}
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;
