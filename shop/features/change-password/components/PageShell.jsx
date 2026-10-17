import { useTranslations } from "next-intl";

export default function PageShell({ children, centered = false }) {
    const { i18n } = useTranslations();

    return (
        <main
            dir={i18n.dir()}
            className={
                centered
                    ? "flex min-h-screen items-center justify-center bg-stone-50 px-4"
                    : "min-h-screen bg-stone-50 px-4 py-10"
            }
        >
            {children}
        </main>
    );
}
