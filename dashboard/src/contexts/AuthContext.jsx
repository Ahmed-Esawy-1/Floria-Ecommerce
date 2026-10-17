import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import api, {
    readStoredTokens,
    persistTokens,
    clearStoredTokens,
} from "@/api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [dashboardAccess, setDashboardAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ---- USER DATA ----------------------------------------------
    const loadCurrentUser = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user);
            setDashboardAccess(data.dashboardAccess);
            return data;
        } catch (err) {
            clearStoredTokens();
            setUser(null);
            setDashboardAccess(false);
            throw err;
        }
    }, []);

    // ---- WHEN REFRESH GET TOKENS IF EXISTS -------------------------------------------------
    useEffect(() => {
        async function restore() {
            if (readStoredTokens()) {
                try {
                    await loadCurrentUser();
                } catch {
                    // expired | invalid tokens
                }
            }
            setIsLoading(false);
        }
        restore();
    }, [loadCurrentUser]);

    // ---- LOGIN ---------------------------------------------
    const login = useCallback(
        async ({ email, password, rememberMe }) => {
            const { data: tokens } = await api.post("/auth/login", {
                email: email.trim(),
                password: password.trim(),
                rememberMe,
            });

            persistTokens(tokens, rememberMe);

            try {
                const me = await loadCurrentUser();
                if (!me.dashboardAccess) {
                    const err = new Error("accessDenied");
                    err.code = "ACCESS_DENIED";
                    throw err;
                }
                return me;
            } catch (err) {
                clearStoredTokens();
                setUser(null);
                setDashboardAccess(false);
                throw err;
            }
        },
        [loadCurrentUser],
    );

    // ---- LOGOUT ---------------------
    const logout = useCallback(() => {
        clearStoredTokens();
        setUser(null);
        setDashboardAccess(false);
    }, []);

    // ---- PERMISSION --------------------------
    const hasPermission = useCallback(
        (permission) => user?.permissions?.includes(permission) ?? false,
        [user],
    );

    const value = {
        user,
        dashboardAccess,
        isAuthenticated: !!user && dashboardAccess,
        isLoading,
        login,
        logout,
        hasPermission,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
