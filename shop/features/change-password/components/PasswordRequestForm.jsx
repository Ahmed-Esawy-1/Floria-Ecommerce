import { useTranslations } from "next-intl";
import { INPUT_CLASS } from "../constants";
import PasswordChecklist from "./PasswordChecklist";
import Spinner from "@/components/loading/spinner";

export default function PasswordRequestForm({
    form,
    checks,
    passwordsMatch,
    canSubmit,
    requesting,
    onChange,
    onSubmit,
}) {
    const { t } = useTranslations();

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"
        >
            <div>
                <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-stone-700"
                >
                    {t("changePassword.oldPassword")}
                </label>
                <input
                    id="oldPassword"
                    type="password"
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={onChange}
                    autoComplete="current-password"
                    required
                    className={INPUT_CLASS}
                />
            </div>

            <div>
                <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-stone-700"
                >
                    {t("changePassword.newPassword")}
                </label>
                <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                    required
                    className={INPUT_CLASS}
                />
                <PasswordChecklist checks={checks} />
            </div>

            <div>
                <label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium text-stone-700"
                >
                    {t("changePassword.confirmPassword")}
                </label>
                <input
                    id="confirmNewPassword"
                    type="password"
                    name="confirmNewPassword"
                    value={form.confirmNewPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                    required
                    className={INPUT_CLASS}
                />
                {form.confirmNewPassword && (
                    <p
                        className={`mt-2 text-xs ${passwordsMatch ? "text-emerald-700" : "text-red-600"}`}
                    >
                        {passwordsMatch
                            ? t("changePassword.passwordsMatch")
                            : t("changePassword.passwordsMismatch")}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={requesting || !canSubmit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {requesting && <Spinner />}
                {requesting
                    ? t("changePassword.requesting")
                    : t("changePassword.requestSubmit")}
            </button>
        </form>
    );
}
