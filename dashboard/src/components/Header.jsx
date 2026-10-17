import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

import SearchIcon from "@mui/icons-material/Search";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header
            className="sticky top-0 z-40 flex items-center gap-2 px-4 md:px-8 py-4
            lg:ltr:ml-[280px] lg:rtl:mr-[280px] lg:w-[calc(100%-280px)] w-full
            bg-surface-dim border-b border-surface-variant backdrop-blur-md"
        >
            {/* Hamburger - ( Mobile ) */}
            <button
                className="lg:hidden p-2 text-slate-500 hover:text-primary transition-colors"
                onClick={onMenuClick}
            >
                <MenuIcon />
            </button>

            {/* Search Bar */}
            <div
                className={`items-center flex-1 ${
                    searchOpen ? "flex" : "hidden md:flex"
                }`}
            >
                <div className="relative w-full max-w-md">
                    <SearchIcon className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2
                        bg-surface-container-low border border-outline-variant rounded-lg
                        focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder={
                            language === "ar"
                                ? "ابحث..."
                                : "Search analytics, products, or users..."
                        }
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1 ltr:ml-auto rtl:mr-auto">
                {/* Search toggle ( Mobile ) */}
                <button
                    className="md:hidden p-2 text-slate-500 hover:text-primary transition-colors"
                    onClick={() => setSearchOpen((prev) => !prev)}
                >
                    {searchOpen ? <CloseIcon /> : <SearchIcon />}
                </button>

                <button
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                    onClick={toggleTheme}
                >
                    {theme === "light" ? <LightModeIcon /> : <NightlightIcon />}
                </button>

                <button
                    className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer text-sm font-medium"
                    onClick={() =>
                        changeLanguage(language === "en" ? "ar" : "en")
                    }
                >
                    {language === "en" ? "العربية" : "English"}
                </button>
            </div>
        </header>
    );
};

export default Header;
