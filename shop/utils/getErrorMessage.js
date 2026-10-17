export default function getErrorMessage(data, fallback) {
    if (!data) return fallback;

    if (typeof data.message === "string") return data.message;

    if (data.message && typeof data.message === "object") {
        const fieldMessage = Object.values(data.message).find(
            (v) => typeof v === "string",
        );
        if (fieldMessage) return fieldMessage;
    }

    return fallback;
}
