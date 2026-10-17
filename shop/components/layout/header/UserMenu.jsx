"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLogoutMutation } from "@/lib/api/authApi";
import { LogOut, User, Lock, Package, Edit, Heart } from "lucide-react";

const itemClass =
    "flex w-full items-center gap-3 px-4 py-3 text-start text-sm font-medium text-ink transition-colors hover:bg-rose/10";

function MenuItem({ href, icon: Icon, onClick, children }) {
    return (
        <Link href={href} onClick={onClick} className={itemClass}>
            <Icon size={18} className="shrink-0 text-primary" />
            <span className="truncate">{children}</span>
        </Link>
    );
}

export default function UserMenu({ user, onClose }) {
    const router = useRouter();
    const t = useTranslations("navigation.userMenu");
    const [logout] = useLogoutMutation();

    const isOAuthUser = user?.provider === "GOOGLE";

    const handleLogout = () => {
        onClose();
        logout();
        router.replace("/");
    };

    const panelClass =
        "absolute end-0 top-full z-[100] mt-2 w-56 sm:w-64 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto rounded-lg border border-gold/30 bg-white shadow-xl";

    // ---- NOT LOGGED IN ----
    if (!user) {
        return (
            <div className={panelClass}>
                <nav className="divide-y divide-gold/20">
                    <MenuItem href="/login" icon={User} onClick={onClose}>
                        {t("login")}
                    </MenuItem>
                    <MenuItem href="/signup" icon={Edit} onClick={onClose}>
                        {t("signup")}
                    </MenuItem>
                </nav>
            </div>
        );
    }

    // ---- LOGGED IN ----
    return (
        <div className={panelClass}>
            <div className="flex items-center gap-3 border-b border-gold/20 bg-marble-light/50 px-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-rose">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.userName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-bold text-white">
                            {user.userName?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1 text-start">
                    <p className="truncate text-sm font-semibold text-ink">
                        {user.userName || user.email}
                    </p>
                    <p className="truncate text-xs text-text/70">
                        {user.email}
                    </p>
                </div>
            </div>

            <nav className="divide-y divide-gold/20 py-2">
                <MenuItem href="/profile" icon={User} onClick={onClose}>
                    {t("profile")}
                </MenuItem>

                <MenuItem href="/watchlist" icon={Heart} onClick={onClose}>
                    {t("watchlist")}
                </MenuItem>

                {!isOAuthUser && (
                    <MenuItem
                        href="/change-password"
                        icon={Lock}
                        onClick={onClose}
                    >
                        {t("changePassword")}
                    </MenuItem>
                )}

                <MenuItem href="/orders" icon={Package} onClick={onClose}>
                    {t("trackOrder")}
                </MenuItem>

                <button
                    type="button"
                    onClick={handleLogout}
                    className={itemClass}
                >
                    <LogOut size={18} className="shrink-0 text-primary" />
                    <span>{t("logout")}</span>
                </button>
            </nav>
        </div>
    );
}
