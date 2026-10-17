import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

import InventoryIcon from "@mui/icons-material/Inventory";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DEFAULT_USER_INFO = {
    email: "",
    password: "",
    rememberMe: false,
};

const Login = () => {
    const { t } = useTranslation("auth");
    const { t: tCommon } = useTranslation("common");
    const navigate = useNavigate();
    const { login } = useAuth();

    // ---- STATE ------------------------------------------------
    const [userInfo, setUserInfo] = useState(DEFAULT_USER_INFO);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ---- INPUTS CHANGE -----------------------------------
    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (error) setError("");
    }

    // ---- SUBMIT --------------------------------------
    async function handleFormSubmit(e) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await login(userInfo);
            navigate("/dashboard");
        } catch (err) {
            if (err.code === "ACCESS_DENIED") {
                setError(t("login.errors.accessDenied"));
            } else {
                const status = err.response?.status;
                setError(
                    status === 401
                        ? tCommon("errors.invalidCredentials")
                        : tCommon("errors.loginFailed"),
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-[440px]">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg shadow-primary/20 mb-4">
                        <InventoryIcon className="text-on-primary !text-[28px]" />
                    </div>
                    <h1 className="text-on-surface text-2xl font-bold tracking-wider">
                        {t("login.brand")}
                    </h1>
                    <p className="text-on-surface-variant mt-1">
                        {t("login.tagline")}
                    </p>
                </div>

                <div className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-on-surface text-2xl/6 font-bold tracking-wider">
                            {t("login.title")}
                        </h2>
                        <p className="text-on-surface-variant text-sm/6 tracking-wide">
                            {t("login.subtitle")}
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-4 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm/6"
                        >
                            {error}
                        </div>
                    )}

                    <form
                        className="space-y-6"
                        onSubmit={handleFormSubmit}
                        noValidate
                    >
                        {/* EMAIL */}
                        <div className="space-y-1">
                            <label
                                className="text-on-surface-variant text-sm/6"
                                htmlFor="email"
                            >
                                {t("login.email")}
                            </label>
                            <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest text-on-surface text-sm/6 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                                    id="email"
                                    name="email"
                                    placeholder={t("login.emailPlaceholder")}
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={userInfo.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label
                                    className="text-on-surface-variant text-sm leading-6"
                                    htmlFor="password"
                                >
                                    {t("login.password")}
                                </label>
                                <button
                                    type="button"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    {t("login.forgotPassword")}
                                </button>
                            </div>
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest text-on-surface text-sm/6 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                                    id="password"
                                    name="password"
                                    placeholder={t("login.passwordPlaceholder")}
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={userInfo.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* REMEMBER ME */}
                        <div className="flex items-center gap-1">
                            <input
                                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={userInfo.rememberMe}
                                onChange={handleInputChange}
                            />
                            <label
                                className="text-on-surface leading-7 tracking-wide"
                                htmlFor="rememberMe"
                            >
                                {t("login.rememberMe")}
                            </label>
                        </div>

                        {/* SUBMIT */}
                        <button
                            className="flex items-center justify-center gap-1 w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-lg shadow-md shadow-primary/10 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t("login.button") + "..."
                                : t("login.button")}
                            {!isSubmitting && (
                                <ArrowForwardIcon
                                    fontSize="small"
                                    className="rtl:rotate-180"
                                />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
