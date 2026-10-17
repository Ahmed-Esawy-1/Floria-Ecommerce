import PageShell from "./PageShell";

export default function ProfileSkeleton() {
    return (
        <PageShell>
            <div className="mx-auto max-w-xl animate-pulse space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                <div className="mx-auto h-24 w-24 rounded-full bg-stone-200" />
                <div className="h-4 w-1/3 rounded bg-stone-200" />
                <div className="h-10 w-full rounded-lg bg-stone-200" />
                <div className="h-10 w-full rounded-lg bg-stone-200" />
            </div>
        </PageShell>
    );
}
