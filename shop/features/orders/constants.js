export const PAGE_SIZE = 5;

// Order Status
export const STATUS_STYLES = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-sky-100 text-sky-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURNED: "bg-slate-200 text-slate-700",
};

export const STATUSES = Object.keys(STATUS_STYLES);

// ALL means no status filter
export const FILTERS = ["ALL", ...STATUSES];

// Statuses the user is allowed to cancel
export const CANCELLABLE_STATUSES = ["PENDING"];
