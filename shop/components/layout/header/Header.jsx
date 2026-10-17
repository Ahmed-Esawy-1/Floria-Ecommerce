"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectTotalItems } from "@/features/cart/cartSlice";
import Dropdown from "./Dropdown";
import MobileAccordion from "./MobileAccordion";
import UserMenu from "./UserMenu";
import ProductSearch from "./search/ProductSearch";

import { Rose, UserRound, ShoppingCart, Menu, X } from "lucide-react";

export default function Header({ categories = [], occasions = [] }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const t = useTranslations("navigation");
    const tCommon = useTranslations("common");

    const user = useSelector((state) => state.auth.user);
    const totalItems = useSelector(selectTotalItems);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const closeUserMenu = () => setUserMenuOpen(false);
    const closeMobile = () => setMobileOpen(false);

    // ---- CHANGE LANGUAGE --------------------------------------------------
    const changeLanguage = () => {
        const next = locale === "en" ? "ar" : "en";
        const segments = pathname.split("/");
        segments[1] = next;
        router.push(segments.join("/"));
    };

    // ---- CLOSE USER MENU ON OUTSIDE CLICK OR ESCAPE -----------------------
    useEffect(() => {
        if (!userMenuOpen) return;

        const handleClickOutside = (e) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target)
            ) {
                setUserMenuOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setUserMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [userMenuOpen]);

    // Close user menu when the page changes
    useEffect(() => {
        setUserMenuOpen(false);
    }, [pathname]);

    return (
        <>
            {/* DESKTOP & TOP BAR */}
            <header className="sticky top-0 z-50 glass-effect border-b border-gold/20">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* TITLE */}
                    <div className="flex items-center gap-2 text-primary">
                        <Rose fontSize="large" />
                        <Link
                            className="font-heading text-2xl font-bold tracking-tight"
                            href="/"
                        >
                            {tCommon("siteName")}
                        </Link>
                    </div>

                    {/* LINKS */}
                    <nav className="hidden lg:flex items-center gap-5 font-body">
                        <Dropdown
                            label={t("occasions")}
                            items={occasions}
                            basePath="occasions"
                        />
                        <Dropdown
                            label={t("categories")}
                            items={categories}
                            basePath="categories"
                        />
                        <Link
                            className="font-accent text-sm font-bold uppercase tracking-tight hover:text-primary transition-colors"
                            href="/shop/best-sellers"
                        >
                            {t("bestSellers")}
                        </Link>
                        <Link
                            className="font-accent text-sm font-bold uppercase tracking-tight hover:text-primary transition-colors"
                            href="/shop"
                        >
                            {t("shop")}
                        </Link>
                    </nav>

                    {/* SEARCH & LANGUAGE & CART */}
                    <div className="flex items-center gap-4">
                        <ProductSearch />

                        <button
                            onClick={changeLanguage}
                            className="text-sm font-semibold hover:text-primary transition-colors text-ink"
                        >
                            {locale === "en" ? "العربية" : "English"}
                        </button>

                        {/* USER MENU */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((prev) => !prev)}
                                className="hover:text-primary text-ink transition-colors"
                            >
                                <UserRound />
                            </button>
                            {userMenuOpen && (
                                <UserMenu user={user} onClose={closeUserMenu} />
                            )}
                        </div>

                        <Link
                            href="/cart"
                            className="relative hover:text-primary text-ink"
                        >
                            <ShoppingCart />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            className="lg:hidden text-ink"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu />
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE OVERLAY */}
            <div
                className={`fixed inset-0 z-50 bg-primary-dark/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden
                    ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={closeMobile}
            />

            {/* MOBILE DRAWER */}
            <div
                className={`fixed top-0 z-50 h-full w-72 bg-marble-light shadow-2xl transition-all duration-300 lg:hidden flex flex-col
                    ${locale === "ar" ? "right-0" : "left-0"}
                    ${mobileOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"}`}
            >
                {/* DRAWER HEADER */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-gold/20">
                    <div className="flex items-center gap-2 text-primary">
                        <Rose />
                        <span className="font-heading text-xl font-bold">
                            {tCommon("siteName")}
                        </span>
                    </div>
                    <button onClick={closeMobile} className="text-ink">
                        <X />
                    </button>
                </div>

                {/* MOBILE SEARCH */}
                <div className="px-4 pt-6">
                    <ProductSearch variant="mobile" onSelect={closeMobile} />
                </div>

                {/* LINKS */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    <MobileAccordion
                        label={t("occasions")}
                        items={occasions}
                        basePath="occasions"
                        onClose={closeMobile}
                    />
                    <MobileAccordion
                        label={t("categories")}
                        items={categories}
                        basePath="categories"
                        onClose={closeMobile}
                    />
                    <Link
                        href="/shop/best-sellers"
                        onClick={closeMobile}
                        className="block px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest text-ink hover:bg-rose/15 hover:text-primary transition-colors"
                    >
                        {t("bestSellers")}
                    </Link>
                    <Link
                        href="/shop"
                        onClick={closeMobile}
                        className="block px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest text-ink hover:bg-rose/15 hover:text-primary transition-colors"
                    >
                        {t("shop")}
                    </Link>
                </nav>

                {/* PROFILE & LANGUAGE */}
                <div className="px-6 py-5 border-t border-gold/20 flex items-center justify-between">
                    <button
                        onClick={changeLanguage}
                        className="text-sm font-semibold hover:text-primary transition-colors text-ink"
                    >
                        {locale === "en" ? "العربية" : "English"}
                    </button>
                    {user ? (
                        <UserRound className="text-primary" />
                    ) : (
                        <Link href="/login" onClick={closeMobile}>
                            <UserRound className="text-ink" />
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
