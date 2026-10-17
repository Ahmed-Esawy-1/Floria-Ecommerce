import { useTranslations } from "next-intl";
import { getInitials } from "../helpers";

export default function AvatarField({
    shownImage,
    savedName,
    imageFile,
    onFileChange,
}) {
    const t = useTranslations("profile");

    return (
        <section className="flex items-center gap-6">
            {shownImage ? (
                <img
                    src={shownImage}
                    alt={t("avatarAlt")}
                    referrerPolicy="no-referrer"
                    className="h-24 w-24 shrink-0 rounded-full object-cover shadow ring-4 ring-white"
                />
            ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-700 shadow ring-4 ring-white">
                    {getInitials(savedName)}
                </div>
            )}

            <div className="min-w-0 flex-1">
                <label
                    htmlFor="profile-image"
                    className="inline-flex cursor-pointer items-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50"
                >
                    {t("changeImage")}
                </label>
                <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onFileChange}
                />
                {imageFile ? (
                    <p className="mt-2 truncate text-xs text-stone-600">
                        {imageFile.name}
                    </p>
                ) : (
                    <p className="mt-2 text-xs text-stone-500">
                        {t("imageHint")}
                    </p>
                )}
            </div>
        </section>
    );
}
