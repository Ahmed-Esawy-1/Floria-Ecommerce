export default function FeedbackBanner({ type = "success", message }) {
    if (!message) return null;

    const isError = type === "error";

    return (
        <div
            role={isError ? "alert" : "status"}
            className={`mt-4 rounded-lg p-4 text-sm ring-1 ${
                isError
                    ? "bg-red-50 text-red-700 ring-red-200"
                    : "bg-emerald-50 text-emerald-800 ring-emerald-200"
            }`}
        >
            {message}
        </div>
    );
}
