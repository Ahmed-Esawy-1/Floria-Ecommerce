export default function FormField({ id, label, error, hint, children }) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-semibold text-slate-900 mb-2"
            >
                {label}
            </label>
            {children}
            {error ? (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : (
                hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>
            )}
        </div>
    );
}
