// Pagination
export const ORDERS_PER_PAGE = 10;
export const MAX_VISIBLE_PAGES = 5;

// Order statuses
export const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
];

// Filter-only option, not a real status
export const ALL_STATUSES = "ALL";

// Filter dropdown options
export const STATUS_OPTIONS = [ALL_STATUSES, ...ORDER_STATUSES];

// Badge colors per status
export const STATUS_STYLES = {
    PENDING: "bg-gray-100 text-gray-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-amber-100 text-amber-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-purple-100 text-purple-800",
};

// Table
export const TABLE_HEADER = [
    "id",
    "customer",
    "date",
    "amount",
    "status",
    "city",
    "actions",
];

// Assets
export const DEFAULT_AVATAR = "/images/default_user_profile.png";
