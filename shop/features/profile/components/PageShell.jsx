import { useLocale } from "next-intl";

export default function PageShell({ children, centered = false }) {
    const locale = useLocale();

    return (
        <main
            dir={locale}
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
