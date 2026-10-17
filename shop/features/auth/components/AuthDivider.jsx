export default function AuthDivider({ label }) {
    return (
        <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                {label}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
        </div>
    );
}
