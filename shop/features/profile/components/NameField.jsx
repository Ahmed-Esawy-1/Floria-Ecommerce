import { useTranslations } from "next-intl";
import { INPUT_CLASS, NAME_MAX, NAME_MIN } from "../constants";

export default function NameField({ name, onChange }) {
    const t = useTranslations("profile");

    return (
        <section>
            <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-stone-700"
            >
                {t("nameLabel")}
            </label>
            <input
                id="profile-name"
                type="text"
                value={name}
                onChange={onChange}
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
                required
                className={INPUT_CLASS}
            />
            <div className="mt-1.5 flex justify-end text-xs text-stone-500">
                <span>
                    {name.length}/{NAME_MAX}
                </span>
            </div>
        </section>
    );
}
