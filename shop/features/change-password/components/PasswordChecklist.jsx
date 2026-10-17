import { useTranslations } from "next-intl";

function ChecklistItem({ done, children }) {
    return (
        <li
            className={`flex items-center gap-2 text-xs transition ${
                done ? "text-emerald-700" : "text-stone-500"
            }`}
        >
            <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    done
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-200 text-stone-500"
                }`}
            >
                {done ? "✓" : "•"}
            </span>
            {children}
        </li>
    );
}

export default function PasswordChecklist({ checks }) {
    const { t } = useTranslations();

    return (
        <ul className="mt-3 space-y-1.5">
            <ChecklistItem done={checks.length}>
                {t("changePassword.checkLength")}
            </ChecklistItem>
            <ChecklistItem done={checks.letter}>
                {t("changePassword.checkLetter")}
            </ChecklistItem>
            <ChecklistItem done={checks.digit}>
                {t("changePassword.checkDigit")}
            </ChecklistItem>
        </ul>
    );
}
