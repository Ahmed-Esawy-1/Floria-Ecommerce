"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useGetMeQuery, useUpdateProfileMutation } from "@/lib/api/authApi";
import { NAME_MIN } from "./constants";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import PageShell from "./components/PageShell";
import ProfileSkeleton from "./components/ProfileSkeleton";
import ProfileLoadError from "./components/ProfileLoadError";
import AvatarField from "./components/AvatarField";
import NameField from "./components/NameField";
import FormActions from "./components/FormActions";
import FeedbackBanner from "@/components/FeedbackBanner";
import getErrorMessage from "@/utils/getErrorMessage";

export default function ProfileView() {
    const tCommon = useTranslations("common.errors");
    const t = useTranslations("profile");
    const { data, isLoading, isError } = useGetMeQuery();
    const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

    // ---- User
    const user = data?.user;
    const savedName = user?.userName ?? "";

    // ---- STATE -------------------------
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ---- Name ----------------------------
    useEffect(() => {
        setName(savedName);
    }, [savedName]);

    // ---- IMAGE -----------------------------------------------------
    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const trimmedName = name.trim();
    const isDirty = trimmedName !== savedName || imageFile !== null;
    const shownImage = previewUrl || resolveImageUrl(user?.imageUrl);

    // ---- RESET ----------------------------------------------------
    function handleReset() {
        setName(savedName);
        setImageFile(null);
        setMessage("");
        setError("");
    }

    // ---- SUBMIT ---------------------------------------------------
    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        if (trimmedName.length < NAME_MIN) {
            setError(t("nameTooShort", { min: NAME_MIN }));
            return;
        }

        try {
            await updateProfile({ userName: trimmedName, imageFile }).unwrap();
            setMessage(t("profileUpdated"));
            setImageFile(null);
        } catch (err) {
            setError(getErrorMessage(err, tCommon("defaultError")));
        }
    }

    // ---- RENDER ------------------------------------------------
    if (isLoading) return <ProfileSkeleton />;
    if (isError) return <ProfileLoadError />;

    return (
        <PageShell>
            <div className="mx-auto max-w-xl">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-stone-900">
                        {t("title")}
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        {t("subtitle")}
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"
                >
                    {/* Image */}
                    <AvatarField
                        shownImage={shownImage}
                        savedName={savedName}
                        imageFile={imageFile}
                        onFileChange={(e) =>
                            setImageFile(e.target.files[0] ?? null)
                        }
                    />

                    {/* Name */}
                    <NameField
                        name={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Buttons */}
                    <FormActions
                        isDirty={isDirty}
                        saving={saving}
                        onReset={handleReset}
                    />
                </form>

                {/* Submit Result */}
                <FeedbackBanner type="success" message={message} />
                <FeedbackBanner type="error" message={error} />
            </div>
        </PageShell>
    );
}
