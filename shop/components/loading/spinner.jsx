const SIZES = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[3px]",
    lg: "h-10 w-10 border-4",
};

export default function Spinner({
    size = "lg",
    fullScreen = true,
    className = "",
}) {
    return (
        <div
            role="status"
            aria-label="loading"
            className={
                fullScreen
                    ? "min-h-screen flex items-center justify-center"
                    : "inline-flex items-center justify-center"
            }
        >
            <div
                className={`${SIZES[size]} animate-spin rounded-full border-rose/20 border-t-primary ${className}`}
            />
        </div>
    );
}
