import PageShell from "./PageShell";

export default function ChangePasswordSkeleton() {
    return (
        <PageShell>
            <div className="mx-auto max-w-md animate-pulse space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                <div className="h-6 w-1/2 rounded bg-stone-200" />
                <div className="h-10 w-full rounded-lg bg-stone-200" />
                <div className="h-10 w-full rounded-lg bg-stone-200" />
                <div className="h-10 w-full rounded-lg bg-stone-200" />
            </div>
        </PageShell>
    );
}
