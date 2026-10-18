import { NavLink, useNavigate } from "react-router";
import api from "@/api/axios";
import { BASE_URL } from "@/api/config";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "@/constants/permissions";
import { useAuth } from "@/contexts/AuthContext";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CategoryIcon from "@mui/icons-material/Category";
import PaletteIcon from "@mui/icons-material/Palette";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import BadgeIcon from "@mui/icons-material/Badge";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

const links = [
    {
        title: "home",
        path: "/dashboard",
        icon: DashboardIcon,
        permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
        title: "orders",
        path: "/orders",
        icon: ReceiptLongIcon,
        permission: PERMISSIONS.READ_ORDER,
    },
    {
        title: "products",
        path: "/products",
        icon: LocalFloristIcon,
        permission: PERMISSIONS.READ_PRODUCT,
    },
    {
        title: "cities",
        path: "/cities",
        icon: LocationCityIcon,
        permission: PERMISSIONS.READ_CITY,
    },
    {
        title: "coupons",
        path: "/coupons",
        icon: ConfirmationNumberIcon,
        permission: PERMISSIONS.READ_COUPON,
    },
    {
        title: "occasions",
        path: "/occasions",
        icon: CelebrationIcon,
        permission: PERMISSIONS.READ_OCCASION,
    },
    {
        title: "categories",
        path: "/categories",
        icon: CategoryIcon,
        permission: PERMISSIONS.READ_CATEGORY,
    },
    {
        title: "colors",
        path: "/colors",
        icon: PaletteIcon,
        permission: PERMISSIONS.READ_COLOR,
    },
    {
        title: "sections",
        path: "/sections",
        icon: ViewQuiltIcon,
        permission: PERMISSIONS.READ_SECTION,
    },
    {
        title: "employees",
        path: "/employees",
        icon: BadgeIcon,
        permission: PERMISSIONS.READ_EMPLOYEE,
    },
    {
        title: "customers",
        path: "/customers",
        icon: PeopleIcon,
        permission: PERMISSIONS.READ_CUSTOMER,
    },
    {
        title: "roles",
        path: "/roles",
        icon: AdminPanelSettingsIcon,
        permission: PERMISSIONS.READ_ROLE,
    },
];

const Sidebar = ({ open, onClose }) => {
    const { t } = useTranslation("sidebar");
    const navigate = useNavigate();
    const { user, hasPermission, logout } = useAuth();

    const visibleLinks = links.filter((link) => hasPermission(link.permission));

    // ---- LOGOUT --------------------------------------------------------------
    async function handleLogout() {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.log(error);
        } finally {
            logout();
            navigate("/");
        }
    }

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) onClose();
    };

    return (
        <>
            {/* Overlay - ( Mobile ) */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
               fixed ltr:left-0 rtl:right-0 top-0 z-50 h-full flex flex-col
               bg-surface-container w-[280px] border-r border-surface-variant shadow-sm
               transition-transform duration-300 ease-in-out
               ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
               lg:translate-x-0
            `}
            >
                {/* Close button - ( Mobile ) */}
                <button
                    className="absolute top-4 ltr:right-4 rtl:left-4 lg:hidden text-on-surface-variant hover:text-primary transition-colors"
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>

                <div className="px-6 py-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 flex items-center justify-center text-white bg-primary-container rounded-lg">
                            <Inventory2Icon />
                        </div>
                        <div>
                            <h1 className="text-primary tracking-tight">
                                {t("title")}
                            </h1>
                            <p className="text-on-surface-variant">
                                {t("subtitle")}
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <nav className="space-y-1">
                        {visibleLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    to={link.path}
                                    onClick={handleLinkClick}
                                    className={({ isActive }) =>
                                        `page-label flex items-center gap-3 px-4 py-3 ${
                                            isActive
                                                ? "border-l-4 border-primary bg-primary-container text-on-primary-container transition-all duration-200 ease-in-out"
                                                : "text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors"
                                        }`
                                    }
                                    key={link.path}
                                >
                                    <Icon fontSize="small" />
                                    <span>{t(`${link.title}`)}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto px-6 py-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <img
                            alt="User Profile"
                            className="w-10 h-10 bg-slate-200 rounded-full object-cover"
                            src={
                                user?.imageUrl
                                    ? `${BASE_URL}${user.imageUrl}`
                                    : "images/default_userImage.svg"
                            }
                        />
                        <div>
                            <p className="text-on-surface">{user?.userName}</p>
                            <p className="text-secondary text-[10px]">
                                System {user?.role}
                            </p>
                        </div>
                        <button
                            className="ml-auto text-slate-400 hover:text-error transition-colors"
                            onClick={handleLogout}
                        >
                            <LogoutIcon className="rtl:rotate-180" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
